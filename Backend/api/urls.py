from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet, ProjectViewSet, ProjectStageViewSet,
    InvoiceViewSet, InvoiceItemViewSet, IncidentViewSet, ProductViewSet
)

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'products', ProductViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'project-stages', ProjectStageViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'invoice-items', InvoiceItemViewSet)
router.register(r'incidents', IncidentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
