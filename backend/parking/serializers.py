from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import ParkingSession, ParkingSlot, Vehicle


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('Invalid username or password')

        attrs['user'] = user
        return attrs


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, value):
        username = (value or '').strip()
        if not username:
            raise serializers.ValidationError('Username is required')
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username is already taken')
        return username

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email') or '',
            password=validated_data['password'],
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class ParkingSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSlot
        fields = ('id', 'number', 'is_active', 'created_at', 'updated_at')

    def validate_number(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        number = (value or '').strip().upper()
        if not number:
            raise serializers.ValidationError('Slot number is required')

        qs = ParkingSlot.objects.filter(owner=user, number=number)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError('Slot number already exists for this account')
        return number


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ('id', 'plate_number', 'vehicle_type', 'created_at', 'updated_at')

    def validate_plate_number(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        plate_number = (value or '').strip().upper()
        if not plate_number:
            raise serializers.ValidationError('Plate number is required')

        qs = Vehicle.objects.filter(owner=user, plate_number=plate_number)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError('Plate number already exists for this account')
        return plate_number


class ParkingSessionSerializer(serializers.ModelSerializer):
    slot = serializers.PrimaryKeyRelatedField(queryset=ParkingSlot.objects.none())
    vehicle = serializers.PrimaryKeyRelatedField(queryset=Vehicle.objects.none())

    class Meta:
        model = ParkingSession
        fields = (
            'id',
            'slot',
            'vehicle',
            'entry_time',
            'exit_time',
            'status',
            'fee',
            'created_at',
            'updated_at',
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            self.fields['slot'].queryset = ParkingSlot.objects.filter(owner=user)
            self.fields['vehicle'].queryset = Vehicle.objects.filter(owner=user)

    def validate(self, attrs):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        slot = attrs.get('slot') or getattr(self.instance, 'slot', None)
        vehicle = attrs.get('vehicle') or getattr(self.instance, 'vehicle', None)

        if slot and slot.owner_id != getattr(user, 'id', None):
            raise serializers.ValidationError({'slot': 'Invalid slot for this account'})
        if vehicle and vehicle.owner_id != getattr(user, 'id', None):
            raise serializers.ValidationError({'vehicle': 'Invalid vehicle for this account'})
        return attrs
