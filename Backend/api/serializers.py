from rest_framework import serializers
from .models import Client, Project, ProjectStage, Invoice, InvoiceItem, Incident, IncidentItem, Product

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProjectStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStage
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    client_address = serializers.CharField(source='client.address', read_only=True)
    client_city = serializers.CharField(source='client.city', read_only=True)
    client_country = serializers.CharField(source='client.country', read_only=True)
    stages = ProjectStageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = '__all__'

class InvoiceItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    item_name = serializers.CharField(source='product_name', read_only=True)
    incident_type = serializers.SerializerMethodField()
    incident_quantity = serializers.SerializerMethodField()

    class Meta:
        model = InvoiceItem
        fields = '__all__'

    def get_incident_type(self, obj):
        # Find if this specific invoice item is part of any incident
        incident_item = IncidentItem.objects.filter(invoice_item=obj).first()
        return incident_item.incident_type if incident_item else None

    def get_incident_quantity(self, obj):
        # Find the quantity reported in the incident for this item
        incident_item = IncidentItem.objects.filter(invoice_item=obj).first()
        return incident_item.quantity if incident_item else 0

class InvoiceSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    client_address = serializers.CharField(source='client.address', read_only=True)
    client_city = serializers.CharField(source='client.city', read_only=True)
    client_country = serializers.CharField(source='client.country', read_only=True)
    items = InvoiceItemSerializer(many=True, read_only=True)
    has_incident = serializers.SerializerMethodField()
    incident_deduction = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = '__all__'

    def get_has_incident(self, obj):
        return obj.incidents.exists()

    def get_incident_deduction(self, obj):
        total_deduction = 0
        for incident in obj.incidents.all():
            for item in incident.items.all():
                # Deduction for Refund, Missing, Damaged, and Exchange
                if item.incident_type in ['Refund', 'Missing', 'Damaged', 'Damage', 'Exchange']:
                    total_deduction += item.quantity * item.invoice_item.unit_price
        return total_deduction

class IncidentItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='invoice_item.product_name', read_only=True)
    item_code = serializers.CharField(source='invoice_item.item_code', read_only=True)
    unit_price = serializers.DecimalField(source='invoice_item.unit_price', max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = IncidentItem
        fields = '__all__'

class IncidentSerializer(serializers.ModelSerializer):
    items = IncidentItemSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='invoice.client.name', read_only=True)
    invoice_id = serializers.CharField(source='invoice.id', read_only=True)

    class Meta:
        model = Incident
        fields = '__all__'
