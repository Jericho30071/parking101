from datetime import timedelta

from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ParkingSession, ParkingSlot, Vehicle
from .serializers import (
    LoginSerializer,
    ParkingSessionSerializer,
    ParkingSlotSerializer,
    RegisterSerializer,
    UserSerializer,
    VehicleSerializer,
)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'token': token.key,
                'user': UserSerializer(user).data,
            }
        )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'token': token.key,
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'detail': 'Logged out'}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'user': UserSerializer(request.user).data})


class ParkingSlotViewSet(viewsets.ModelViewSet):
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ParkingSlot.objects.filter(owner=self.request.user).order_by('number')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            # Check if slot has any ACTIVE sessions
            active_sessions = instance.sessions.filter(status='active')
            if active_sessions.exists():
                return Response(
                    {'error': 'Cannot delete slot with currently parked vehicles. Please release all vehicles first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # If there are completed sessions, we need to handle them
            # Option 1: Delete completed sessions first, then delete slot
            completed_sessions = instance.sessions.filter(status='completed')
            if completed_sessions.exists():
                # Archive or delete completed sessions before deleting slot
                completed_sessions.delete()
            
            # Now delete the slot
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            # Handle any database constraint errors
            return Response(
                {'error': f'Cannot delete slot: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(owner=self.request.user).order_by('plate_number')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ParkingSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ParkingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = ParkingSession.objects.select_related('slot', 'vehicle').filter(owner=self.request.user)

        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)

        slot_param = self.request.query_params.get('slot')
        if slot_param:
            qs = qs.filter(slot_id=slot_param)

        vehicle_param = self.request.query_params.get('vehicle')
        if vehicle_param:
            qs = qs.filter(vehicle_id=vehicle_param)

        return qs.order_by('-entry_time')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        last_24h = now - timedelta(hours=24)

        slots_total = ParkingSlot.objects.filter(owner=request.user).count()
        slots_active = ParkingSlot.objects.filter(owner=request.user, is_active=True).count()

        sessions_active = ParkingSession.objects.filter(owner=request.user, status='active').count()
        sessions_completed_today = ParkingSession.objects.filter(
            owner=request.user,
            status='completed',
            exit_time__isnull=False,
            exit_time__gte=today_start,
        ).count()

        revenue_today = (
            ParkingSession.objects.filter(
                owner=request.user,
                status='completed',
                exit_time__isnull=False,
                exit_time__gte=today_start,
                fee__isnull=False,
            ).aggregate(total=Sum('fee'))['total']
            or 0
        )

        recent_activity_24h = ParkingSession.objects.filter(owner=request.user, entry_time__gte=last_24h).count()
        vehicle_types = list(
            Vehicle.objects.filter(owner=request.user)
            .values('vehicle_type')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        return Response(
            {
                'slots': {
                    'total': slots_total,
                    'active': slots_active,
                },
                'sessions': {
                    'active': sessions_active,
                    'completed_today': sessions_completed_today,
                    'recent_24h': recent_activity_24h,
                },
                'revenue': {
                    'today': str(revenue_today),
                },
                'vehicles': {
                    'by_type': vehicle_types,
                },
            }
        )
