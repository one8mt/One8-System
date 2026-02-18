import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { RefreshCw, Repeat, AlertTriangle, Search, Edit } from 'lucide-react';

interface FormData {
  invoiceNumber: string;
  email: string;
  phone: string;
}

interface IncidentType {
  id: string;
  title: string;
  color: string;
  icon: any;
  bgColor: string;
  borderColor: string;
  ringColor: string;
  iconBg: string;
  iconText: string;
  boxColor: string;
}

const incidentTypes: IncidentType[] = [
  {
    id: 'refund',
    title: 'Refund',
    color: 'green',
    icon: RefreshCw,
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
    ringColor: 'ring-green-500',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconText: 'text-green-600 dark:text-green-400',
    boxColor: 'bg-green-500'
  },
  {
    id: 'exchange',
    title: 'Exchange',
    color: 'yellow',
    icon: Repeat,
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    ringColor: 'ring-yellow-500',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconText: 'text-yellow-600 dark:text-yellow-400',
    boxColor: 'bg-yellow-500'
  },
  {
    id: 'damaged',
    title: 'Damaged',
    color: 'red',
    icon: AlertTriangle,
    bgColor: 'bg-red-50 dark:bg-red-950',
    borderColor: 'border-red-200 dark:border-red-800',
    ringColor: 'ring-red-500',
    iconBg: 'bg-red-100 dark:bg-red-900',
    iconText: 'text-red-600 dark:text-red-400',
    boxColor: 'bg-red-500'
  },
  {
    id: 'missing',
    title: 'Missing',
    color: 'blue',
    icon: Search,
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    ringColor: 'ring-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconText: 'text-blue-600 dark:text-blue-400',
    boxColor: 'bg-blue-500'
  }
];

interface Item {
  id: string;
  itemName: string;
  quantity: number;
  requestedQuantity: number;
  price: number;
  incidentType: string | null; // Which incident type is assigned to this item
}

const mockInvoiceItems: Item[] = [
  { id: '1', itemName: 'Laptop Dell XPS 15', quantity: 2, requestedQuantity: 0, price: 1299.99, incidentType: null },
  { id: '2', itemName: 'Office Chair Ergonomic', quantity: 5, requestedQuantity: 0, price: 349.99, incidentType: null },
  { id: '3', itemName: 'Wireless Mouse Logitech', quantity: 10, requestedQuantity: 0, price: 29.99, incidentType: null },
  { id: '4', itemName: 'USB-C Hub Multiport', quantity: 8, requestedQuantity: 0, price: 49.99, incidentType: null },
  { id: '5', itemName: 'Monitor 27" 4K Display', quantity: 3, requestedQuantity: 0, price: 599.99, incidentType: null }
];

export function IncidentRequest() {
  const [step, setStep] = useState<'invoice' | 'details' | 'incidents'>('invoice');
  const [formData, setFormData] = useState<FormData>({
    invoiceNumber: '',
    email: '',
    phone: ''
  });
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>(mockInvoiceItems);

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.invoiceNumber) {
      setStep('details');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      setStep('incidents');
    }
  };

  const handleEditForm = () => {
    setStep('invoice');
  };

  const toggleIncidentType = (id: string) => {
    setSelectedIncidents(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const cycleItemIncidentType = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      // If no incident type, set to first selected incident
      if (!item.incidentType) {
        return { ...item, incidentType: selectedIncidents[0] || null };
      }
      
      // Find current index in selected incidents
      const currentIndex = selectedIncidents.indexOf(item.incidentType);
      
      // Cycle to next incident type, or null if at the end
      if (currentIndex === -1 || currentIndex === selectedIncidents.length - 1) {
        return { ...item, incidentType: null };
      }
      
      return { ...item, incidentType: selectedIncidents[currentIndex + 1] };
    }));
  };

  const handleRequestedQuantityChange = (itemId: string, value: string) => {
    const numericValue = Number(value);
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const safeValue = Number.isNaN(numericValue)
        ? item.requestedQuantity
        : Math.max(0, Math.min(item.quantity, numericValue));
      return { ...item, requestedQuantity: safeValue };
    }));
  };

  const getItemBoxColor = (incidentTypeId: string | null) => {
    if (!incidentTypeId) return 'bg-gray-200 dark:bg-gray-700';
    
    const type = incidentTypes.find(t => t.id === incidentTypeId);
    return type?.boxColor || 'bg-gray-200 dark:bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Incident Request</h1>
          <p className="text-muted-foreground">
            Submit and track product incidents for refunds, exchanges, damages, or missing items
          </p>
        </div>

        {/* Step 1: Invoice Number */}
        {step === 'invoice' && (
          <div className="flex justify-center">
            <Card className="w-full max-w-[600px]">
              <CardHeader>
                <CardTitle>Enter Invoice Number</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvoiceSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="Enter invoice number"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#0B3AAE] hover:bg-[#0B3AAE]/90 text-white">
                    Continue
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Email and Phone */}
        {step === 'details' && (
          <div className="flex justify-center">
            <Card className="w-full max-w-[600px]">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input value={formData.invoiceNumber} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-xs text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#0B3AAE] hover:bg-[#0B3AAE]/90 text-white">
                    Continue
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Incident Selection and Items */}
        {step === 'incidents' && (
          <div className="space-y-6">
            {/* Collapsed Form Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Invoice Number</p>
                      <p className="font-medium">{formData.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{formData.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEditForm}
                    className="ml-4 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Incident Type Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Incident Type(s)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {incidentTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedIncidents.includes(type.id);
                  
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? `ring-2 ring-offset-2 ${type.ringColor} ${type.borderColor} ${type.bgColor}` 
                          : 'border-border hover:shadow-md'
                      }`}
                      onClick={() => toggleIncidentType(type.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${type.iconBg} ${type.iconText}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{type.title}</h3>
                            </div>
                          </div>
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Items Selection */}
            {selectedIncidents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Assign Incident Types to Items</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click the colored box next to each item to cycle through incident types
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Type</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <button
                              onClick={() => cycleItemIncidentType(item.id)}
                              className={`w-10 h-10 rounded-md border-2 border-gray-300 dark:border-gray-600 transition-all hover:scale-110 ${getItemBoxColor(item.incidentType)}`}
                              title={item.incidentType ? incidentTypes.find(t => t.id === item.incidentType)?.title : 'Click to select incident type'}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.itemName}
                            {item.incidentType && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {incidentTypes.find(t => t.id === item.incidentType)?.title}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min={0}
                              max={item.quantity}
                              value={item.requestedQuantity}
                              onChange={(e) => handleRequestedQuantityChange(item.id, e.target.value)}
                              className="h-8 w-14 mx-auto text-center"
                            />
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.requestedQuantity * item.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Legend */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Color Legend:</p>
                    <div className="flex flex-wrap gap-4">
                      {selectedIncidents.map(incidentId => {
                        const type = incidentTypes.find(t => t.id === incidentId);
                        if (!type) return null;
                        const IconComponent = type.icon;
                        return (
                          <div key={type.id} className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded ${type.boxColor}`} />
                            <span className="text-sm">{type.title}</span>
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600" />
                        <span className="text-sm">No incident type</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Items with incidents: <span className="font-semibold text-foreground">
                            {items.filter(i => i.incidentType).length} of {items.length}
                          </span>
                        </p>
                      </div>
                      <Button 
                        size="lg"
                        disabled={items.filter(i => i.incidentType).length === 0}
                        className="bg-[#0B3AAE] hover:bg-[#0B3AAE]/90 text-white"
                      >
                        Submit Incident Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
