import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddRFQFormProps {
  onClose: () => void;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
}

export function AddRFQForm({ onClose }: AddRFQFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    specifications: '',
    deadline: '',
    budget: '',
    deliveryLocation: '',
    terms: ''
  });

  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', email: '' });

  const availableSuppliers: Supplier[] = [
    { id: '1', name: 'TechCorp Ltd', email: 'quotes@techcorp.com' },
    { id: '2', name: 'Office Plus', email: 'rfq@officeplus.com' },
    { id: '3', name: 'Global Supplies', email: 'sales@globalsupplies.com' },
    { id: '4', name: 'Quick Solutions', email: 'quotes@quicksolutions.com' },
    { id: '5', name: 'Premium Vendors', email: 'rfq@premiumvendors.com' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('RFQ Form submitted:', { formData, selectedSuppliers });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSupplierToggle = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>New Request for Quotation</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">RFQ Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., IT Equipment Package"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office-supplies">Office Supplies</SelectItem>
                      <SelectItem value="it-equipment">IT Equipment</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="General description of what you need"
                  className="min-h-[80px]"
                  required
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="specifications">Detailed Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  placeholder="Technical specifications, quantities, quality requirements, etc."
                  className="min-h-[100px]"
                  required
                />
              </div> */}
            </div>

            {/* Requirements & Terms */}
            <div className="space-y-4">
              <h3 className="font-medium">Requirements & Terms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Quote Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="e.g., SAR 10,000 - SAR15,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryLocation">Delivery Location</Label>
                <Input
                  id="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                  placeholder="Full delivery address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  placeholder="Payment terms, delivery requirements, warranty, etc."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Supplier Selection */}
            <div className="space-y-4">
              <h3 className="font-medium">Select Suppliers</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSuppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`supplier-${supplier.id}`}
                      checked={selectedSuppliers.includes(supplier.id)}
                      onCheckedChange={() => handleSupplierToggle(supplier.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`supplier-${supplier.id}`} className="cursor-pointer">
                        {supplier.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{supplier.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                Selected: {selectedSuppliers.length} supplier{selectedSuppliers.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedSuppliers.length === 0}>
                Send RFQ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
