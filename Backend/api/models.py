import uuid
from django.db import models

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    contact_email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='projects')
    invoice = models.ForeignKey('Invoice', on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.client.name}"

class ProjectStage(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='stages')
    stage_name = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    phase_number = models.IntegerField(default=1)
    sequence_order = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    delivery_note_file = models.FileField(upload_to='delivery_notes/', null=True, blank=True)

    class Meta:
        ordering = ['phase_number', 'sequence_order']

    def __str__(self):
        return f"{self.project.title} - {self.stage_name}"

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue')
    ]

    id = models.CharField(max_length=100, primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='invoices')
    date = models.DateField(auto_now_add=True)
    net_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice {self.id} for {self.client.name}"

class InvoiceItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    item_code = models.CharField(max_length=100)
    item_name = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        self.line_total = self.quantity * self.unit_price
        super().save(*args, **kwargs)

        # Update invoice total
        total = sum(item.line_total for item in self.invoice.items.all())
        self.invoice.net_total = total
        self.invoice.save(update_fields=['net_total'])

    def __str__(self):
        return f"{self.quantity}x {self.item_name} (Invoice {self.invoice.id})"

class Incident(models.Model):
    INCIDENT_TYPE_CHOICES = [
        ('Refund', 'Refund'),
        ('Missing', 'Missing'),
        ('Damaged', 'Damaged'),
        ('Exchange', 'Exchange'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Flagged', 'Flagged'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='incidents')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    notes = models.TextField(null=True, blank=True)
    attachment = models.FileField(upload_to='incident_attachments/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Incident {self.id} (Invoice {self.invoice.id})"

class IncidentItem(models.Model):
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='items')
    invoice_item = models.ForeignKey(InvoiceItem, on_delete=models.CASCADE)
    incident_type = models.CharField(max_length=20, choices=Incident.INCIDENT_TYPE_CHOICES)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.incident_type} - {self.quantity}x {self.invoice_item.item_name}"
