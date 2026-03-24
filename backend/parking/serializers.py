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
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate_first_name(self, value):
        first_name = (value or '').strip()
        if not first_name:
            raise serializers.ValidationError('First name is required')
        return first_name

    def validate_last_name(self, value):
        last_name = (value or '').strip()
        if not last_name:
            raise serializers.ValidationError('Last name is required')
        return last_name

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
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data.get('email') or '',
            password=validated_data['password'],
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

    def validate_username(self, value):
        username = (value or '').strip()
        if not username:
            raise serializers.ValidationError('Username is required')

        user = self.instance
        if User.objects.filter(username=username).exclude(id=getattr(user, 'id', None)).exists():
            raise serializers.ValidationError('Username is already taken')
        return username

    def validate(self, attrs):
        first_name = (attrs.get('first_name', getattr(self.instance, 'first_name', '')) or '').strip()
        last_name = (attrs.get('last_name', getattr(self.instance, 'last_name', '')) or '').strip()

        if not first_name:
            raise serializers.ValidationError({'first_name': 'First name is required'})
        if not last_name:
            raise serializers.ValidationError({'last_name': 'Last name is required'})

        attrs['first_name'] = first_name
        attrs['last_name'] = last_name
        if 'email' in attrs:
            attrs['email'] = (attrs.get('email') or '').strip()
        return attrs


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
