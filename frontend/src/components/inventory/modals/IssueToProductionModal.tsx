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

interface IssueToProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const itemsData = [
  {
    itemCode: 'ITM-001',
    itemName: 'Laptop Dell XPS',
    availableQty: 45,
    issueQty: 7,
    productionLine: 'Line 1',
  },
  {
    itemCode: 'ITM-003',
    itemName: 'Steel Beams',
    availableQty: 8,
    issueQty: 5,
    productionLine: 'Line 1',
  },
];

export function IssueToProductionModal({ isOpen, onClose }: IssueToProductionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    productionLine: '',
    requestedBy: '',
    issueDate: '',
    notes: ''
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto p-8 rounded-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Issue to Production</DialogTitle>
            <span className="text-sm text-muted-foreground font-normal">ITP-2025-001</span>
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
                  <SelectItem value="production-issue">Production Line Issue</SelectItem>
                  <SelectItem value="assembly-materials">Assembly Materials</SelectItem>
                  <SelectItem value="maintenance-parts">Maintenance Parts</SelectItem>
                  <SelectItem value="testing-materials">Testing Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productionLine">Production Line</Label>
              <Select value={formData.productionLine} onValueChange={(value) => setFormData({ ...formData, productionLine: value })}>
                <SelectTrigger id="productionLine">
                  <SelectValue placeholder="Select line" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line-1">Production Line 1</SelectItem>
                  <SelectItem value="line-2">Production Line 2</SelectItem>
                  <SelectItem value="line-3">Production Line 3</SelectItem>
                  <SelectItem value="assembly">Assembly Line</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                placeholder="Enter requester name"
                value={formData.requestedBy}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>
          </div>

          {/* Items to Issue Table */}
          <div className="space-y-2">
            <Label>Items to Issue</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Available Qty</TableHead>
                    <TableHead>Issue Qty</TableHead>
                    <TableHead>Production Line</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.availableQty}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={item.issueQty}
                          className="w-20"
                          max={item.availableQty}
                        />
                      </TableCell>
                      <TableCell>{item.productionLine}</TableCell>
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
              placeholder="Add any notes about the issue..."
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
              Create Issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
