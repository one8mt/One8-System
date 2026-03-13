from django.contrib import admin
from .models import Client, Project, ProjectStage, Invoice, InvoiceItem, Incident, IncidentItem, Product

# Register your models here.

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_email', 'phone', 'city', 'country', 'created_at')
    search_fields = ('name', 'contact_email', 'city', 'country')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('item_code', 'name', 'created_at')
    search_fields = ('item_code', 'name')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'created_at')
    list_filter = ('client',)
    search_fields = ('title', 'client__name')

@admin.register(ProjectStage)
class ProjectStageAdmin(admin.ModelAdmin):
    list_display = ('stage_name', 'project', 'status', 'sequence_order')
    list_filter = ('status', 'project')
    search_fields = ('stage_name', 'project__title')
    ordering = ('project', 'sequence_order')

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'net_total', 'status', 'date')
    list_filter = ('status', 'date')
    search_fields = ('id', 'client__name')
    inlines = [InvoiceItemInline]
    readonly_fields = ('net_total',)

class IncidentItemInline(admin.TabularInline):
    model = IncidentItem
    extra = 1

@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ('id', 'invoice', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'invoice__id', 'invoice__client__name')
    inlines = [IncidentItemInline]
