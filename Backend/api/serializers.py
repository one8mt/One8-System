from rest_framework import serializers
from .models import Client, Project, ProjectStage, Invoice, InvoiceItem, Incident, IncidentItem

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
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
    class Meta:
        model = InvoiceItem
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    client_address = serializers.CharField(source='client.address', read_only=True)
    client_city = serializers.CharField(source='client.city', read_only=True)
    client_country = serializers.CharField(source='client.country', read_only=True)
    items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'

class IncidentItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='invoice_item.item_name', read_only=True)
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
