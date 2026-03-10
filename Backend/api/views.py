from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Client, Project, ProjectStage, Invoice, InvoiceItem, Incident, IncidentItem
from .serializers import (
    ClientSerializer, ProjectSerializer, ProjectStageSerializer,
    InvoiceSerializer, InvoiceItemSerializer, IncidentSerializer, IncidentItemSerializer
)
from django.db.models import Count, Q

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=True, methods=['post'])
    def create_new_phase(self, request, pk=None):
        project = self.get_object()
        last_stage = project.stages.all().order_by('phase_number', 'sequence_order').last()
        next_phase = (last_stage.phase_number if last_stage else 0) + 1
        
        stages_data = [
            {'name': 'To Go', 'order': 1, 'status': 'active'},
            {'name': 'Delivered', 'order': 2, 'status': 'pending'},
            {'name': 'Closed', 'order': 3, 'status': 'pending'},
        ]
        
        new_stages = []
        for s in stages_data:
            stage = ProjectStage.objects.create(
                project=project,
                stage_name=s['name'],
                sequence_order=s['order'],
                phase_number=next_phase,
                status=s['status']
            )
            new_stages.append(ProjectStageSerializer(stage).data)
            
        return Response(new_stages)

class ProjectStageViewSet(viewsets.ModelViewSet):
    queryset = ProjectStage.objects.all()
    serializer_class = ProjectStageSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=False, methods=['get'])
    def search_by_email(self, request):
        invoice_id = request.query_params.get('invoice_id')
        email = request.query_params.get('email')
        
        if not invoice_id or not email:
            return Response({'error': 'Invoice ID and Email are required'}, status=400)
            
        try:
            invoice = Invoice.objects.get(id=invoice_id, client__contact_email=email)
            return Response(InvoiceSerializer(invoice).data)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found or email does not match'}, status=404)

class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

    def create(self, request, *args, **kwargs):
        import json
        invoice_id = request.data.get('invoice')
        items_data = request.data.get('items', [])
        if isinstance(items_data, str):
            try:
                items_data = json.loads(items_data)
            except json.JSONDecodeError:
                items_data = []
        notes = request.data.get('notes', '')

        try:
            invoice = Invoice.objects.get(id=invoice_id)
            attachment = request.data.get('attachment')
            incident = Incident.objects.create(
                invoice=invoice, 
                notes=notes,
                attachment=attachment
            )
            
            for item in items_data:
                # Expect item to have invoice_item (ID), incident_type, and quantity
                invoice_item = InvoiceItem.objects.get(id=item['invoice_item'])
                IncidentItem.objects.create(
                    incident=incident,
                    invoice_item=invoice_item,
                    incident_type=item['incident_type'],
                    quantity=item['quantity']
                )
            
            serializer = self.get_serializer(incident)
            return Response(serializer.data, status=201)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
