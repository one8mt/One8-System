import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { X, Calculator, TrendingUp } from 'lucide-react';

interface AddPRFormProps {
  onClose: () => void;
}

export function AddPRForm({ onClose }: AddPRFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    supplier: '',
    amount: '',
    quantity: '',
    urgency: '',
    department: '',
    justification: ''
  });

  // Mock inventory data for selected category
  const [inventoryData, setInventoryData] = useState({
    currentStock: 25,
    incomingPOs: 30,
    reorderPoint: 50,
    demandForecast: 20
  });

  const [suggestedQty, setSuggestedQty] = useState(0);

  // Calculate suggested quantity based on inventory
  useEffect(() => {
    if (formData.category) {
      const { currentStock, incomingPOs, reorderPoint, demandForecast } = inventoryData;
      const projectedStock = currentStock + incomingPOs;
      const requiredQty = Math.max(0, reorderPoint - projectedStock + demandForecast);
      setSuggestedQty(requiredQty);
    }
  }, [formData.category, inventoryData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('PR Form submitted:', formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>New Purchase Requisition</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Office Supplies"
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
                    <SelectItem value="other">Other</SelectItem>
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
                placeholder="Detailed description of items needed"
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Preferred Supplier (Optional)</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  placeholder="e.g., TechCorp Ltd"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Estimated Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Inventory-Based Suggestion */}
            {formData.category && suggestedQty > 0 && (
              <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <Calculator className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Suggested Quantity: {suggestedQty} units</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Based on: Current Stock ({inventoryData.currentStock}) + Incoming ({inventoryData.incomingPOs}) - ROP ({inventoryData.reorderPoint}) + Forecast ({inventoryData.demandForecast})
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleInputChange('quantity', suggestedQty.toString())}
                      className="ml-2"
                    >
                      Apply
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="1"
                    required
                  />
                  {formData.quantity && suggestedQty > 0 && parseInt(formData.quantity) !== suggestedQty && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Suggested: {suggestedQty}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procurement">Procurement</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Business Justification</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                placeholder="Explain why this purchase is needed"
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
