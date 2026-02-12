import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { AlertTriangle, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

export interface CriticalStockItem {
  id: string;
  name: string;
  currentStock: number;
  rop: number;
  suggestedQty: number;
  warehouse: string;
  department: string;
  moq?: number;
  multiple?: number;
}

interface PRItem {
  id: string;
  itemCode: string;
  itemName: string;
  qty: number;
  for: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface CriticalStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePR?: (itemData: CriticalStockItem) => void;
}

// Mock data for critical stock items
const criticalItems: CriticalStockItem[] = [
  {
    id: 'ITM-001',
    name: 'A4 Paper (Box)',
    currentStock: 12,
    rop: 50,
    suggestedQty: 100,
    warehouse: 'Main Warehouse',
    department: 'Office Supplies',
    moq: 50,
    multiple: 10
  },
  {
    id: 'ITM-002',
    name: 'Printer Toner - Black',
    currentStock: 3,
    rop: 10,
    suggestedQty: 20,
    warehouse: 'Main Warehouse',
    department: 'IT Supplies',
    moq: 5,
    multiple: 5
  },
  {
    id: 'ITM-003',
    name: 'USB Cables (Pack of 10)',
    currentStock: 8,
    rop: 25,
    suggestedQty: 50,
    warehouse: 'IT Warehouse',
    department: 'IT Supplies',
    moq: 10,
    multiple: 10
  }
];

export function CriticalStockModal({ isOpen, onClose, onCreatePR }: CriticalStockModalProps) {
  const [selectedItem, setSelectedItem] = useState<CriticalStockItem | null>(null);
  
  // PR Form fields
  const [title, setTitle] = useState('');
  const [requester, setRequester] = useState('Current User');
  const [location, setLocation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PRItem[]>([]);

  const handleItemSelect = (item: CriticalStockItem) => {
    setSelectedItem(item);
    
    // Auto-fill PR form fields
    setTitle('Critical Stock Replenishment');
    setLocation(item.warehouse);
    setDeliveryDate('');
    
    // Auto-fill items table with selected item
    setItems([{
      id: '1',
      itemCode: item.id,
      itemName: item.name,
      qty: item.suggestedQty,
      for: '',
      priority: 'Medium'
    }]);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), itemCode: '', itemName: '', qty: 0, for: '', priority: 'Medium' }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof PRItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = () => {
    if (!selectedItem) {
      toast.error('Please select an item');
      return;
    }

    if (!title || !location || !deliveryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate PR ID
    const prId = `PR-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

    // Success toast in both English and Arabic
    toast.success(`PR#${prId} created successfully`, {
      description: 'تم إنشاء طلب الشراء بنجاح'
    });

    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setTitle('');
    setRequester('Current User');
    setLocation('');
    setDeliveryDate('');
    setNotes('');
    setItems([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Stock Alert - Create Purchase Requisition
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Critical Items List - Always visible */}
          <div>
            <Label>Select Item Below Reorder Point</Label>
            <div className="mt-2 space-y-2">
              {criticalItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedItem?.id === item.id
                      ? 'border-red-500 bg-red-50 dark:bg-red-950'
                      : 'border-border hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.id} • {item.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p className="font-medium text-red-600">{item.currentStock}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">ROP</p>
                          <p className="font-medium">{item.rop}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Suggested</p>
                          <p className="font-medium text-green-600">{item.suggestedQty}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PR Form - Only show when item is selected */}
          {selectedItem && (
            <>
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter PR title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="requester">Requester</Label>
                  <Input
                    id="requester"
                    value={requester}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">
                    Receiving Location <span className="text-red-500">*</span>
                  </Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                      <SelectItem value="IT Warehouse">IT Warehouse</SelectItem>
                      <SelectItem value="Production Floor">Production Floor</SelectItem>
                      <SelectItem value="Office Building">Office Building</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deliveryDate">
                    Required Delivery Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="mt-1"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Items Requested</Label>
                  <Button onClick={addItem} size="sm" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[140px_1fr_120px_1fr_140px_50px] gap-4 px-6 py-3 bg-muted/30 border-b">
                    <div className="text-sm font-medium">Item Code</div>
                    <div className="text-sm font-medium">Item Name</div>
                    <div className="text-sm font-medium text-center">Qty</div>
                    <div className="text-sm font-medium">For</div>
                    <div className="text-sm font-medium">Priority</div>
                    <div></div>
                  </div>

                  {/* Table Rows */}
                  {items.map((item, index) => (
                    <div key={item.id} className={`grid grid-cols-[140px_1fr_120px_1fr_140px_50px] gap-4 px-6 py-4 items-center ${index !== items.length - 1 ? 'border-b' : ''}`}>
                      <Input
                        value={item.itemCode}
                        onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                        placeholder="ITM-001"
                        className="h-9 border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Input
                        value={item.itemName}
                        onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                        placeholder="Item name"
                        className="h-9 border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <div className="flex items-center justify-center">
                        <Input
                          type="number"
                          value={item.qty || ''}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="h-9 w-20 text-center bg-muted/50 rounded-full border-0 focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                      <Input
                        value={item.for}
                        onChange={(e) => updateItem(item.id, 'for', e.target.value)}
                        placeholder="Production Line A"
                        className="h-9 border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          item.priority === 'High' ? 'bg-red-500' :
                          item.priority === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <Select
                          value={item.priority}
                          onValueChange={(value) => updateItem(item.id, 'priority', value)}
                        >
                          <SelectTrigger className="h-9 border-0 bg-transparent px-0 gap-1 focus:ring-0 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {items.length > 1 && (
                        <Button
                          onClick={() => removeItem(item.id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Add any special requirements or notes..."
                />
              </div>

              {/* Attachment */}
              <div>
                <Label>Attachment</Label>
                <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS (max 10MB)</p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedItem}>
            Submit PR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
