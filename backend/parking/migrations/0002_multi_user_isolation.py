from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def assign_owners(apps, schema_editor):
    app_label, model_name = settings.AUTH_USER_MODEL.split('.')
    User = apps.get_model(app_label, model_name)
    ParkingSlot = apps.get_model('parking', 'ParkingSlot')
    Vehicle = apps.get_model('parking', 'Vehicle')
    ParkingSession = apps.get_model('parking', 'ParkingSession')

    fallback_user = User.objects.order_by('id').first()
    if fallback_user is None:
        fallback_user = User.objects.create(username='migration_owner')

    ParkingSlot.objects.filter(owner__isnull=True).update(owner=fallback_user)
    Vehicle.objects.filter(owner__isnull=True).update(owner=fallback_user)

    for session in ParkingSession.objects.filter(owner__isnull=True).select_related('slot', 'vehicle'):
        owner = getattr(session.slot, 'owner', None) or getattr(session.vehicle, 'owner', None) or fallback_user
        session.owner = owner
        session.save(update_fields=['owner'])


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('parking', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='parkingslot',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='parking_slots', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='parkingsession',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='parking_sessions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='parkingslot',
            name='number',
            field=models.CharField(max_length=10),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='plate_number',
            field=models.CharField(max_length=20),
        ),
        migrations.RunPython(assign_owners, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='parkingslot',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parking_slots', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='parkingsession',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parking_sessions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='parkingslot',
            constraint=models.UniqueConstraint(fields=('owner', 'number'), name='unique_slot_number_per_owner'),
        ),
        migrations.AddConstraint(
            model_name='vehicle',
            constraint=models.UniqueConstraint(fields=('owner', 'plate_number'), name='unique_plate_number_per_owner'),
        ),
    ]
