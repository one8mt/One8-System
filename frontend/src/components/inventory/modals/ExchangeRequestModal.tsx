import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Star, Upload } from 'lucide-react';

interface ExchangeRequestModalProps {
  open: boolean;
  onClose: () => void;
  returnData: {
    id: string;
    clientName: string;
    invoiceNumber: string;
    returnType: string;
    returnMode: string;
    rating: number;
  };
}

const itemsData = [
  {
    itemCode: 'ITM-007',
    itemName: 'Office Desk',
    qty: 8,
    replacementItem: 'ITM-008 - Executive Desk',
    priceDifference: '+$320',
  },
  {
    itemCode: 'ITM-009',
    itemName: 'Filing Cabinet',
    qty: 12,
    replacementItem: 'ITM-010 - Metal Cabinet',
    priceDifference: '-$150',
  },
];

export function ExchangeRequestModal({ open, onClose, returnData }: ExchangeRequestModalProps) {
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(returnData.rating);

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= currentRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exchange Request - {returnData.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input value={returnData.clientName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input value={returnData.invoiceNumber} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Return Type</Label>
              <Select value={returnData.returnType} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Refund">Refund</SelectItem>
                  <SelectItem value="Missing">Missing</SelectItem>
                  <SelectItem value="Damage">Damage</SelectItem>
                  <SelectItem value="Exchange">Exchange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Return Mode</Label>
              <Select value={returnData.returnMode} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full">Full</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <Label>Items</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Replacement Item</TableHead>
                    <TableHead>Price Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>
                        <Select defaultValue={item.replacementItem}>
                          <SelectTrigger className="w-56">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ITM-008 - Executive Desk">ITM-008 - Executive Desk</SelectItem>
                            <SelectItem value="ITM-010 - Metal Cabinet">ITM-010 - Metal Cabinet</SelectItem>
                            <SelectItem value="ITM-011 - Modern Desk">ITM-011 - Modern Desk</SelectItem>
                            <SelectItem value="ITM-012 - Wood Cabinet">ITM-012 - Wood Cabinet</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className={`font-medium ${
                        item.priceDifference.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.priceDifference}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Enter notes about the exchange request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStars(rating, true)}
          </div>

          {/* Upload Attachment */}
          <div className="space-y-2">
            <Label>Upload Attachment</Label>
            <Button variant="outline" className="gap-2 w-full">
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Approve Exchange
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
