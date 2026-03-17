from django.core.management.base import BaseCommand
from parking.models import ParkingSlot, ParkingSession


class Command(BaseCommand):
    help = 'Clear all parking sessions to enable slot deletion testing'

    def handle(self, *args, **options):
        # Delete all parking sessions
        session_count = ParkingSession.objects.count()
        ParkingSession.objects.all().delete()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {session_count} parking sessions')
        )
        self.stdout.write(
            self.style.SUCCESS('All slots can now be deleted for testing')
        )
