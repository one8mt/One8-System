import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface PRItem {
  id: string;
  itemCode: string;
  itemName: string;
  qty: number;
  for: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface CreatePRModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'inventory' | 'manual';
  prefillData?: {
    title?: string;
    requester?: string;
    location?: string;
    date?: string;
    items?: PRItem[];
    managerNotes?: string;
  };
}

export function CreatePRModal({ isOpen, onClose, mode, prefillData }: CreatePRModalProps) {
  const [title, setTitle] = useState(prefillData?.title || '');
  const [requester, setRequester] = useState(prefillData?.requester || 'Current User');
  const [location, setLocation] = useState(prefillData?.location || '');
  const [deliveryDate, setDeliveryDate] = useState(prefillData?.date || '');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PRItem[]>(
    prefillData?.items || [
      { id: '1', itemCode: '', itemName: '', qty: 0, for: '', priority: 'Medium' }
    ]
  );

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

  const handleSaveDraft = () => {
    const prId = `PR-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    toast.success(`PR#${prId} saved as draft`, {
      description: 'تم حفظ طلب الشراء كمسودة'
    });
    onClose();
  };

  const handleSubmit = () => {
    if (!title || !location || !deliveryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const prId = `PR-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    toast.success(`PR#${prId} submitted to Manager`, {
      description: 'تم إرسال طلب الشراء للمدير للموافقة'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'inventory' ? 'Review Purchase Request (from Inventory)' : 'New Purchase Request (Manual)'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                disabled={mode === 'manual'}
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
            <div className="flex items-center justify-between mb-2">
              <Label>Items</Label>
              <Button onClick={addItem} size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left text-sm">Item Code</th>
                      <th className="px-3 py-2 text-left text-sm">Item Name</th>
                      <th className="px-3 py-2 text-left text-sm">Qty</th>
                      <th className="px-3 py-2 text-left text-sm">For</th>
                      <th className="px-3 py-2 text-left text-sm">Priority</th>
                      <th className="px-3 py-2 text-left text-sm w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2">
                          <Input
                            value={item.itemCode}
                            onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                            placeholder="ITM-001"
                            className="h-8"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={item.itemName}
                            onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                            placeholder="Item name"
                            className="h-8"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={item.qty || ''}
                            onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="h-8 w-20"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={item.for}
                            onChange={(e) => updateItem(item.id, 'for', e.target.value)}
                            placeholder="Production Line A"
                            className="h-8"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={item.priority}
                            onValueChange={(value) => updateItem(item.id, 'priority', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Manager Notes - Display Only */}
          {prefillData?.managerNotes && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Label className="text-yellow-900 dark:text-yellow-100">Manager's Notes</Label>
              <p className="mt-2 text-sm text-yellow-900 dark:text-yellow-100">{prefillData.managerNotes}</p>
            </div>
          )}

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
        </div>

        <DialogFooter>
          {/* <Button variant="outline" onClick={onClose}>
            Cancel
          </Button> */}
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button onClick={handleSubmit}>
            Submit to Manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
