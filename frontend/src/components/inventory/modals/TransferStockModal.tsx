import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
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

interface TransferStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const itemsData = [
  {
    itemCode: 'ITM-001',
    itemName: 'Laptop Dell XPS',
    currentStock: 45,
    transferQty: 10,
    uom: 'pcs',
  },
  {
    itemCode: 'ITM-003',
    itemName: 'Steel Beams',
    currentStock: 8,
    transferQty: 5,
    uom: 'MT',
  },
];

export function TransferStockModal({ isOpen, onClose }: TransferStockModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    fromLocation: '',
    toLocation: '',
    transferDate: '',
    notes: ''
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto p-8 rounded-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Transfer Stock</DialogTitle>
            <span className="text-sm text-muted-foreground font-normal">TO-2025-001</span>
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
                  <SelectItem value="warehouse-transfer">Warehouse Transfer</SelectItem>
                  <SelectItem value="inter-department">Inter-Department Transfer</SelectItem>
                  <SelectItem value="site-transfer">Site Transfer</SelectItem>
                  <SelectItem value="project-allocation">Project Allocation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferDate">Transfer Date</Label>
              <Input
                id="transferDate"
                type="date"
                value={formData.transferDate}
                onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromLocation">From Location</Label>
              <Select value={formData.fromLocation} onValueChange={(value) => setFormData({ ...formData, fromLocation: value })}>
                <SelectTrigger id="fromLocation">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                  <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                  <SelectItem value="main-office">Main Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toLocation">To Location</Label>
              <Select value={formData.toLocation} onValueChange={(value) => setFormData({ ...formData, toLocation: value })}>
                <SelectTrigger id="toLocation">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                  <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                  <SelectItem value="main-office">Main Office</SelectItem>
                  <SelectItem value="site-b">Site B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items to Transfer Table */}
          <div className="space-y-2">
            <Label>Items to Transfer</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Transfer Qty</TableHead>
                    <TableHead>UoM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={item.transferQty}
                          className="w-20"
                          max={item.currentStock}
                        />
                      </TableCell>
                      <TableCell>{item.uom}</TableCell>
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
              placeholder="Add any notes about the transfer..."
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
              Submit Transfer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
