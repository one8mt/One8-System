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

interface CreatePRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const itemsData = [
  {
    itemCode: 'ITM-001',
    itemName: 'Laptop Dell XPS',
    qty: 5,
    for: 'Production Line A',
    priority: 'high'
  },
  {
    itemCode: 'ITM-002',
    itemName: 'Office Chair',
    qty: 10,
    for: 'Production Line B',
    priority: 'medium'
  },
  {
    itemCode: 'ITM-003',
    itemName: 'Steel Beams',
    qty: 20,
    for: 'Production Line C',
    priority: 'low'
  },
];

export function CreatePRModal({ isOpen, onClose }: CreatePRModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    requester: '',
    receivingLocation: '',
    deliveryDate: '',
    notes: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto p-8 rounded-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Purchase Request</DialogTitle>
            <span className="text-sm text-muted-foreground font-normal">PO-2025-001</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requester">Requester</Label>
              <Input
                id="requester"
                placeholder="Enter requester name"
                value={formData.requester}
                onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivingLocation">Receiving Location</Label>
              <Select value={formData.receivingLocation} onValueChange={(value) => setFormData({ ...formData, receivingLocation: value })}>
                <SelectTrigger id="receivingLocation">
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
              <Label htmlFor="deliveryDate">Required Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>
          </div>

          {/* Items Requested Table */}
          <div className="space-y-2">
            <Label>Items Requested</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>For</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={item.qty}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{item.for}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`} />
                          <span className="text-sm capitalize">{item.priority}</span>
                        </div>
                      </TableCell>
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
              placeholder="Add any additional notes or instructions..."
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
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
