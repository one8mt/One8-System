import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Upload } from 'lucide-react';

interface ReceiveGoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const itemsData = [
  {
    itemCode: 'RM-110',
    itemName: 'Plastic Granules',
    orderedQty: 30,
    receivedQty: 20,
    uom: 'pcs',
    qa: 'pending'
  },
  {
    itemCode: 'RM-398',
    itemName: 'Plastic',
    orderedQty: 40,
    receivedQty: 10,
    uom: 'kg',
    qa: 'passed'
  },
  {
    itemCode: 'RM-398',
    itemName: 'Plastic',
    orderedQty: 40,
    receivedQty: 10,
    uom: 'pcs',
    qa: 'rejected'
  },
];

export function ReceiveGoodsModal({ isOpen, onClose }: ReceiveGoodsModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    supplierName: '',
    receivingLocation: '',
    dateTimeReceived: '',
    notes: ''
  });

  const getQABadge = (qa: string) => {
    switch (qa) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Passed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Reject</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto p-8 rounded-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Receive Goods Note</DialogTitle>
            <span className="text-sm text-muted-foreground font-normal">RG-2025-001</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                <SelectTrigger id="title">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office-supplies">Office Supplies Order</SelectItem>
                  <SelectItem value="it-equipment">IT Equipment Order</SelectItem>
                  <SelectItem value="furniture">Furniture Order</SelectItem>
                  <SelectItem value="materials">Raw Materials Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name</Label>
              <Input
                id="supplierName"
                placeholder="Enter supplier name"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivingLocation">Receiving Location</Label>
              <Select value={formData.receivingLocation} onValueChange={(value) => setFormData({ ...formData, receivingLocation: value })}>
                <SelectTrigger id="receivingLocation">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rm-wh">RM-WH</SelectItem>
                  <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                  <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                  <SelectItem value="main-office">Main Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTimeReceived">Date / Time Received</Label>
              <Input
                id="dateTimeReceived"
                type="datetime-local"
                value={formData.dateTimeReceived}
                onChange={(e) => setFormData({ ...formData, dateTimeReceived: e.target.value })}
              />
            </div>
          </div>

          {/* Items Received Table */}
          <div className="space-y-2">
            <Label>Items Received</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Ordered Qty</TableHead>
                    <TableHead>Received Qty</TableHead>
                    <TableHead>UoM</TableHead>
                    <TableHead>QA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.orderedQty}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={item.receivedQty}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell>{getQABadge(item.qa)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about the received goods..."
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Upload Attachment */}
          <div className="space-y-2">
            <Label>Upload Attachment</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, XLS (max. 10MB)
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <Button className="w-full md:w-auto px-8">
              Post GRN
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
