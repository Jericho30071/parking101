from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DashboardView,
    LoginView,
    LogoutView,
    MeView,
    ParkingSessionViewSet,
    ParkingSlotViewSet,
    RegisterView,
    VehicleViewSet,
)

router = DefaultRouter()
router.register(r'slots', ParkingSlotViewSet, basename='slot')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'sessions', ParkingSessionViewSet, basename='session')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('', include(router.urls)),
]
