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
    queryset = ParkingSlot.objects.all().order_by('number')
    serializer_class = ParkingSlotSerializer
    permission_classes = [permissions.IsAuthenticated]


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by('plate_number')
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]


class ParkingSessionViewSet(viewsets.ModelViewSet):
    queryset = ParkingSession.objects.select_related('slot', 'vehicle').all().order_by('-entry_time')
    serializer_class = ParkingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        last_24h = now - timedelta(hours=24)

        slots_total = ParkingSlot.objects.count()
        slots_active = ParkingSlot.objects.filter(is_active=True).count()

        sessions_active = ParkingSession.objects.filter(status='active').count()
        sessions_completed_today = ParkingSession.objects.filter(
            status='completed',
            exit_time__isnull=False,
            exit_time__gte=today_start,
        ).count()

        revenue_today = (
            ParkingSession.objects.filter(
                status='completed',
                exit_time__isnull=False,
                exit_time__gte=today_start,
                fee__isnull=False,
            ).aggregate(total=Sum('fee'))['total']
            or 0
        )

        recent_activity_24h = ParkingSession.objects.filter(entry_time__gte=last_24h).count()
        vehicle_types = list(
            Vehicle.objects.values('vehicle_type')
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
