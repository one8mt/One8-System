import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Upload, Save, Send } from 'lucide-react';
import { toast } from 'sonner';

interface RFQItem {
  code: string;
  name: string;
  qty: number;
}

interface RFQData {
  id: string;
  category: string;
  deliveryLocation: string;
  deadline: string;
  status: string;
  statusColor: string;
  items: RFQItem[];
  requirements: string;
  terms: string;
}

interface SupplierRFQResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqData: RFQData;
}

export function SupplierRFQResponseModal({ isOpen, onClose, rfqData }: SupplierRFQResponseModalProps) {
  const [formData, setFormData] = useState({
    unitPrice: '',
    totalPrice: '',
    deliveryTime: '',
    paymentTerms: '',
    notes: '',
    attachment: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachment: file,
      }));
      toast.success('File attached successfully');
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved', {
      description: 'Your response has been saved as draft',
    });
  };

  const handleSubmitQuote = () => {
    if (!formData.totalPrice || !formData.deliveryTime) {
      toast.error('Please fill in all required fields', {
        description: 'Total price and delivery time are required',
      });
      return;
    }

    toast.success('Quote submitted successfully', {
      description: `Your quote for ${rfqData.id} has been sent to the procurement team`,
    });
    
    onClose();
  };

  const isReadOnly = rfqData.status === 'Quote Submitted';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div>
              <p>{rfqData.id} - RFQ Response</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">{rfqData.category}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* RFQ Basic Info (Read-only) */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{rfqData.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deadline</p>
              <p className="font-medium">{rfqData.deadline}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery Location</p>
              <p className="font-medium">{rfqData.deliveryLocation}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Terms</p>
              <p className="font-medium">{rfqData.terms}</p>
            </div>
          </div>

          {/* Items Summary (Read-only) */}
          <div>
            <h4 className="font-medium mb-3">Items Requested</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Requirements & Terms (Read-only) */}
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium mb-2">Requirements & Terms</h4>
            <p className="text-sm text-muted-foreground">{rfqData.requirements}</p>
          </div>

          {/* Supplier Input Fields */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Your Quote</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (Optional)</Label>
                <Input
                  id="unitPrice"
                  placeholder="SAR 0.00"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPrice">Total Price *</Label>
                <Input
                  id="totalPrice"
                  placeholder="SAR 0.00"
                  value={formData.totalPrice}
                  onChange={(e) => handleInputChange('totalPrice', e.target.value)}
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Delivery Time *</Label>
                <Input
                  id="deliveryTime"
                  placeholder="e.g., 14 days"
                  value={formData.deliveryTime}
                  onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  placeholder="e.g., Net 30"
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="notes">Notes / Additional Information</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or specifications..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={isReadOnly}
                rows={4}
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="attachment">Upload Attachment</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isReadOnly}
                  className="flex-1"
                />
                {formData.attachment && (
                  <span className="text-sm text-muted-foreground">
                    {formData.attachment.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!isReadOnly && (
            <>
              <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={handleSubmitQuote} className="gap-2 bg-black hover:bg-black/90">
                <Send className="h-4 w-4" />
                Submit Quote
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
