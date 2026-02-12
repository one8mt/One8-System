import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddPOFormProps {
  onClose: () => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: number;
}

export function AddPOForm({ onClose }: AddPOFormProps) {
  const [formData, setFormData] = useState({
    supplier: '',
    supplierContact: '',
    supplierEmail: '',
    paymentTerms: '',
    deliveryDate: '',
    deliveryAddress: '',
    notes: '',
    currency: 'USD'
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: '', unitPrice: '', total: 0 }
  ]);

  const suppliers = [
    { name: 'TechCorp Ltd', contact: 'John Smith', email: 'john@techcorp.com' },
    { name: 'Office Plus', contact: 'Sarah Johnson', email: 'sarah@officeplus.com' },
    { name: 'Global Supplies', contact: 'Mike Chen', email: 'mike@globalsupplies.com' },
    { name: 'Quick Solutions', contact: 'Emma Wilson', email: 'emma@quicksolutions.com' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('PO Form submitted:', { formData, lineItems });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSupplierChange = (supplierName: string) => {
    const supplier = suppliers.find(s => s.name === supplierName);
    if (supplier) {
      setFormData(prev => ({
        ...prev,
        supplier: supplierName,
        supplierContact: supplier.contact,
        supplierEmail: supplier.email
      }));
    }
  };

  const handleLineItemChange = (id: string, field: string, value: string) => {
    setLineItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            const quantity = parseFloat(updated.quantity) || 0;
            const unitPrice = parseFloat(updated.unitPrice) || 0;
            updated.total = quantity * unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString();
    setLineItems(prev => [...prev, {
      id: newId,
      description: '',
      quantity: '',
      unitPrice: '',
      total: 0
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>New Purchase Order</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Supplier Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select value={formData.supplier} onValueChange={handleSupplierChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.name} value={supplier.name}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supplierContact">Contact Person</Label>
                  <Input
                    id="supplierContact"
                    value={formData.supplierContact}
                    onChange={(e) => handleInputChange('supplierContact', e.target.value)}
                    placeholder="Contact name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierEmail">Contact Email</Label>
                <Input
                  id="supplierEmail"
                  type="email"
                  value={formData.supplierEmail}
                  onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
                  placeholder="contact@supplier.com"
                  required
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Order Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net-30">Net 30</SelectItem>
                      <SelectItem value="net-15">Net 15</SelectItem>
                      <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                      <SelectItem value="cash-on-delivery">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Required Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder="Full delivery address"
                  className="min-h-[80px]"
                  required
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Line Items</h3>
                <Button type="button" onClick={addLineItem} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 border rounded-lg">
                    <div className="col-span-5">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleLineItemChange(item.id, 'unitPrice', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Total</Label>
                      <div className="p-2 bg-muted rounded text-center font-medium">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Special instructions, terms, or conditions"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Create Purchase Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
