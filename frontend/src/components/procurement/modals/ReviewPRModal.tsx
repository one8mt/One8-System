import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PRItem {
  itemCode: string;
  itemName: string;
  qty: number;
  for: string;
  priority: string;
  inventory: {
    available: number;
    incoming: number;
    rop: number;
  };
}

interface ReviewPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  prData: {
    id: string;
    title: string;
    requester: string;
    location: string;
    deliveryDate: string;
    notes?: string;
    items: PRItem[];
  };
}

export function ReviewPRModal({ isOpen, onClose, prData }: ReviewPRModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | 'sendback' | null>(null);
  const [comment, setComment] = useState('');

  const handleApprove = () => {
    toast.success(`PR#${prData.id} approved`, {
      description: 'Purchase Request has been approved and moved to RFQ pipeline'
    });
    onClose();
  };

  const handleReject = () => {
    if (!comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    toast.error(`PR#${prData.id} rejected`, {
      description: 'Employee has been notified'
    });
    onClose();
  };

  const handleSendBack = () => {
    if (!comment.trim()) {
      toast.error('Please provide comments for corrections');
      return;
    }
    toast.success(`PR#${prData.id} sent back to employee`, {
      description: 'Employee will be notified to make corrections'
    });
    onClose();
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High</Badge>;
      case 'Low':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Low</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manager Review – Purchase Request</DialogTitle>
          <p className="text-sm text-muted-foreground">{prData.id} - {prData.title}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* PR Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Requester</p>
              <p className="font-medium">{prData.requester}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receiving Location</p>
              <p className="font-medium">{prData.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Required Delivery Date</p>
              <p className="font-medium">{prData.deliveryDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="font-medium">{prData.items.length}</p>
            </div>
          </div>

          {/* Items with Inventory Snapshot */}
          <div>
            <Label className="mb-2 block">Requested Items</Label>
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
                      <th className="px-3 py-2 text-left text-sm">Available</th>
                      <th className="px-3 py-2 text-left text-sm">Incoming</th>
                      <th className="px-3 py-2 text-left text-sm">ROP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prData.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-2 text-sm">{item.itemCode}</td>
                        <td className="px-3 py-2 text-sm">{item.itemName}</td>
                        <td className="px-3 py-2 text-sm font-medium">{item.qty}</td>
                        <td className="px-3 py-2 text-sm">{item.for}</td>
                        <td className="px-3 py-2 text-sm">{getPriorityBadge(item.priority)}</td>
                        <td className="px-3 py-2 text-sm">
                          <span className={item.inventory.available < item.inventory.rop ? 'text-red-600 font-medium' : ''}>
                            {item.inventory.available}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm">{item.inventory.incoming}</td>
                        <td className="px-3 py-2 text-sm text-muted-foreground">{item.inventory.rop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notes */}
          {prData.notes && (
            <div>
              <Label>Employee Notes</Label>
              <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
                {prData.notes}
              </div>
            </div>
          )}

          {/* Action Selection */}
          {!action && (
            <div className="flex gap-3">
              <Button onClick={() => setAction('approve')} className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button onClick={() => setAction('reject')} variant="outline" className="flex-1 gap-2 text-red-600 border-red-600 hover:bg-red-50">
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => setAction('sendback')} variant="outline" className="flex-1 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Send Back to Employee
              </Button>
            </div>
          )}

          {/* Rejection/Send Back Form */}
          {(action === 'reject' || action === 'sendback') && (
            <div className="space-y-4 p-4 border-2 border-dashed rounded-lg">
              <div className="flex items-center justify-between">
                <Label>
                  {action === 'reject' ? 'Reason for Rejection' : 'Comments for Corrections'} <span className="text-red-500">*</span>
                </Label>
                <Button variant="ghost" size="sm" onClick={() => setAction(null)}>
                  Cancel
                </Button>
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={action === 'reject' ? 'Explain why this PR is being rejected...' : 'Specify what corrections are needed...'}
              />
              <Button 
                onClick={action === 'reject' ? handleReject : handleSendBack}
                className={action === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {action === 'reject' ? 'Confirm Rejection' : 'Send Back'}
              </Button>
            </div>
          )}

          {/* Approval Confirmation */}
          {action === 'approve' && (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                    Approve Purchase Request
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                    This PR will be approved and moved to the RFQ pipeline for supplier quotations.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                      Confirm Approval
                    </Button>
                    <Button variant="outline" onClick={() => setAction(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!action && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
