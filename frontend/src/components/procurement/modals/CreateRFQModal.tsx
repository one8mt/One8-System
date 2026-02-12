import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface RFQItem {
  itemCode: string;
  itemName: string;
  qty: string | number;
}

interface CreateRFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: {
    rfqId: string;
    title: string;
    date: string;
  } | null;
}

// Mock items data for prefilled view
const mockItems: RFQItem[] = [
  { itemCode: 'RM-001', itemName: 'Steel Rod', qty: 20 },
  { itemCode: 'RM-104', itemName: 'Copper Wire', qty: 100 },
  { itemCode: 'PR-1', itemName: 'High', qty: 'M8 Bilon' },
];

// Simplified supplier list
const suppliers = [
  { id: 'SUP-A', name: 'Supplier A', email: 'a@suppply.com)' },
  { id: 'SUP-B', name: 'Supplier B', email: 'b@suppply.com)' },
  { id: 'SUP-C', name: 'Supplier C', email: 'c@suppply.com)' },
];

export function CreateRFQModal({ isOpen, onClose, prefilledData }: CreateRFQModalProps) {
  const [rfqTitle, setRfqTitle] = useState(prefilledData?.rfqId || 'PR_2025_0045');
  const [category, setCategory] = useState('Electrical');
  const [quoteDeadline, setQuoteDeadline] = useState('2025-10-05');
  const [budgetRange, setBudgetRange] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Main Warehouse');
  const [termsConditions, setTermsConditions] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(['SUP-A']);

  const toggleSupplier = (supplierId: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSaveDraft = () => {
    toast.success('RFQ saved as draft', {
      description: 'You can continue editing later'
    });
    onClose();
  };

  const handleSendRFQ = () => {
    if (selectedSuppliers.length === 0) {
      toast.error('Please select at least one supplier');
      return;
    }

    toast.success(`RFQ sent to ${selectedSuppliers.length} supplier(s)`, {
      description: 'Suppliers will receive email notifications'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-xl">
            New Request for Quotation {prefilledData && '(Auto-Generated from PR)'}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold mb-3">Basic Information</h4>
            <table className="w-full max-w-md border-collapse border">
              <tbody>
                <tr className="border">
                  <td className="border px-4 py-2.5 bg-muted/30 font-medium w-40">RFQ Title</td>
                  <td className="border px-4 py-2.5">
                    <input
                      type="text"
                      value={rfqTitle}
                      onChange={(e) => setRfqTitle(e.target.value)}
                      className="w-full bg-transparent border-none outline-none"
                      readOnly={!!prefilledData}
                    />
                  </td>
                </tr>
                <tr className="border">
                  <td className="border px-4 py-2.5 bg-muted/30 font-medium">Category</td>
                  <td className="border px-4 py-2.5">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-transparent border-none outline-none"
                      readOnly={!!prefilledData}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Items Summary - only show when prefilledData exists */}
          {prefilledData && (
            <div>
              <h4 className="font-semibold mb-1">Items Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">(read-only)</p>
              <table className="w-full max-w-md border-collapse border">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="border px-4 py-2 text-left font-medium">Item Code</th>
                    <th className="border px-4 py-2 text-left font-medium">Item Name</th>
                    <th className="border px-4 py-2 text-left font-medium">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {mockItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{item.itemCode}</td>
                      <td className="border px-4 py-2">{item.itemName}</td>
                      <td className="border px-4 py-2">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Requirements & Terms and Select Suppliers - Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Requirements & Terms */}
            <div>
              <h4 className="font-semibold mb-3">Requirements & Terms</h4>
              <div className="space-y-4">
                <table className="border-collapse border">
                  <tbody>
                    <tr className="border">
                      <td className="border px-4 py-2.5 bg-muted/30 font-medium w-40">Quote Deadline</td>
                      <td className="border px-4 py-2.5">
                        <input
                          type="date"
                          value={quoteDeadline}
                          onChange={(e) => setQuoteDeadline(e.target.value)}
                          className="w-full bg-transparent border-none outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border">
                      <td className="border px-4 py-2.5 bg-muted/30 font-medium">Budget Range</td>
                      <td className="border px-4 py-2.5">
                        <input
                          type="text"
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          placeholder=""
                          className="w-full bg-transparent border-none outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border">
                      <td className="border px-4 py-2.5 bg-muted/30 font-medium">Delivery Location</td>
                      <td className="border px-4 py-2.5">
                        <input
                          type="text"
                          value={deliveryLocation}
                          onChange={(e) => setDeliveryLocation(e.target.value)}
                          className="w-full bg-transparent border-none outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border">
                      <td className="border px-4 py-2.5 bg-muted/30 font-medium align-top">Terms & Conditions</td>
                      <td className="border px-4 py-2.5">
                        <textarea
                          value={termsConditions}
                          onChange={(e) => setTermsConditions(e.target.value)}
                          className="w-full bg-transparent border-none outline-none resize-none"
                          rows={3}
                          placeholder=""
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Select Suppliers */}
            <div>
              <h4 className="font-semibold mb-3">Select Suppliers</h4>
              <div className="space-y-3">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center gap-3">
                    <Checkbox
                      id={supplier.id}
                      checked={selectedSuppliers.includes(supplier.id)}
                      onCheckedChange={() => toggleSupplier(supplier.id)}
                    />
                    <label
                      htmlFor={supplier.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">{supplier.email}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button onClick={handleSendRFQ}>
            Send RFQ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
