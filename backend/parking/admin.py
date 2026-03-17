from django.contrib import admin

from .models import ParkingSlot, Vehicle, ParkingSession


@admin.register(ParkingSlot)
class ParkingSlotAdmin(admin.ModelAdmin):
    list_display = ('number', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('number',)
    ordering = ('number',)


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('plate_number', 'vehicle_type', 'created_at', 'updated_at')
    list_filter = ('vehicle_type',)
    search_fields = ('plate_number',)
    ordering = ('plate_number',)


@admin.register(ParkingSession)
class ParkingSessionAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'slot', 'status', 'entry_time', 'exit_time', 'fee', 'created_at')
    list_filter = ('status',)
    search_fields = ('vehicle__plate_number', 'slot__number')
    ordering = ('-entry_time',)
