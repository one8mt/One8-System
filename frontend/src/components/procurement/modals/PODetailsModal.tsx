import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { X, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface POItem {
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  remainingQty: number;
  status: 'In Transit' | 'Partial Delivery' | 'Delivered' | 'QA Hold';
}

interface PODetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'employee' | 'manager';
  poData: {
    id: string;
    title: string;
    supplier: string;
    status: 'active' | 'delivered' | 'cancelled' | 'qa-hold';
    totalValue: string;
    orderDate: string;
    expectedDelivery: string;
    items: POItem[];
    paymentTerms?: string;
    invoiceStatus?: string;
    onTimeStatus?: 'On Time' | 'Delayed';
  };
}

export function PODetailsModal({ isOpen, onClose, userRole, poData }: PODetailsModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Delivered</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Cancelled</Badge>;
      case 'qa-hold':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">QA Hold</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Pending</Badge>;
    }
  };

  const getItemStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Delivered</Badge>;
      case 'In Transit':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Transit</Badge>;
      case 'Partial Delivery':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Partial Delivery</Badge>;
      case 'QA Hold':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">QA Hold</Badge>;
      default:
        return null;
    }
  };

  const handleMarkAsDelivered = () => {
    toast.success('Purchase order marked as delivered', {
      description: 'The PO status has been updated successfully'
    });
  };

  const handleCancelOrder = () => {
    toast.success('Purchase order cancelled', {
      description: 'The order has been cancelled and supplier notified'
    });
  };

  const handleUpdateDeliveryNote = () => {
    toast.success('Delivery note updated', {
      description: 'The delivery information has been updated successfully'
    });
  };

  const handleLogIssue = () => {
    toast.success('Issue logged', {
      description: 'The issue has been reported to the procurement team'
    });
  };

  const handleResolveAndClose = () => {
    toast.success('QA Hold resolved', {
      description: 'The quality issue has been resolved and order closed'
    });
  };

  const handleRequestFollowUp = () => {
    toast.success('Follow-up requested', {
      description: 'A follow-up request has been sent to the supplier'
    });
  };

  const handleApproveFinalDelivery = () => {
    toast.success('Final delivery approved', {
      description: 'The purchase order has been successfully approved'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* PO Header Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold">
                {poData.status === 'cancelled' ? 'PO-2025-004' : poData.status === 'delivered' ? 'PO-2025-003' : 'PO-2025-002'}
              </span>
              <span className="text-muted-foreground">•</span>
              <span>
                {poData.status === 'cancelled' ? 'Software Licenses' : poData.status === 'delivered' ? 'Marketing Materials' : 'Office Furniture'}
              </span>
              <span className="text-muted-foreground">•</span>
              {getStatusBadge(poData.status)}
            </div>
            <div className="font-semibold">
              {poData.status === 'cancelled' ? 'SAR 28,900' : poData.status === 'delivered' ? 'SAR 3,200' : 'SAR 15,200'}
            </div>
          </div>

          {/* Supplier Name */}
          <div className="text-sm text-muted-foreground">
            Supplier: <span className="font-medium text-foreground">
              {poData.status === 'cancelled' ? 'SoftCorp' : poData.status === 'delivered' ? 'Print Solutions' : 'Office Plus'}
            </span>
          </div>
          {/* Order Summary Section */}
          <div>
            <h4 className="font-semibold mb-3">Order Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Total Value</p>
                <p className="font-medium">
                  {poData.status === 'cancelled' ? 'SAR 28,900' : poData.status === 'delivered' ? 'SAR 3,200' : 'SAR 15,200'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Order Date</p>
                <p className="font-medium">
                  {poData.status === 'cancelled' ? '2025-09-15' : poData.status === 'delivered' ? '2025-09-18' : '2025-09-01'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Delivery Window</p>
                <p className="font-medium">
                  {poData.status === 'cancelled' || poData.status === 'delivered' ? '—' : '2025-09-18 – 2025-09-22'}
                </p>
              </div>
            </div>
          </div>

          {/* Items Ordered Table Section */}
          <div>
            <h4 className="font-semibold mb-3">Items Ordered</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Item Name</th>
                    <th className="px-4 py-3 text-center font-medium">Ordered Qty</th>
                    <th className="px-4 py-3 text-center font-medium">Received Qty</th>
                    <th className="px-4 py-3 text-center font-medium">Remaining</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {poData.status === 'cancelled' ? (
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3">Software License</td>
                      <td className="px-4 py-3 text-center">10</td>
                      <td className="px-4 py-3 text-center">0</td>
                      <td className="px-4 py-3 text-center">10</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Cancelled</Badge>
                      </td>
                    </tr>
                  ) : poData.status === 'delivered' ? (
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3">Marketing Materials</td>
                      <td className="px-4 py-3 text-center">10</td>
                      <td className="px-4 py-3 text-center">10</td>
                      <td className="px-4 py-3 text-center">0</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Delivered</Badge>
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3">Laptops</td>
                        <td className="px-4 py-3 text-center">20</td>
                        <td className="px-4 py-3 text-center">0</td>
                        <td className="px-4 py-3 text-center">20</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Transit</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3">Monitors</td>
                        <td className="px-4 py-3 text-center">10</td>
                        <td className="px-4 py-3 text-center">10</td>
                        <td className="px-4 py-3 text-center">0</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Delivered</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3">Keyboards & Mice</td>
                        <td className="px-4 py-3 text-center">30</td>
                        <td className="px-4 py-3 text-center">10</td>
                        <td className="px-4 py-3 text-center">20</td>
                        <td className="px-4 py-3">
                          <Badge className={poData.status === 'qa-hold' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}>
                            {poData.status === 'qa-hold' ? 'QA Hold' : 'Partial Delivery'}
                          </Badge>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Timeline Section */}
          <div>
            <h4 className="font-semibold mb-3">Delivery Timeline</h4>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">
                  {poData.status === 'cancelled' ? '2025-09-15' : poData.status === 'delivered' ? '2025-09-18' : '2025-09-20'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {poData.status === 'cancelled' ? 'Order Cancelled' : poData.status === 'delivered' ? 'Delivered' : poData.status === 'qa-hold' ? 'QA Hold' : 'Partial Delivery'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes / Issues Section - Employee View Only */}
          {userRole === 'employee' && (
            <div>
              <h4 className="font-semibold mb-3">Notes / Issues</h4>
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">No issues reported.</p>
              </div>
            </div>
          )}

          {/* Notes Section - Manager View for QA Hold */}
          {userRole === 'manager' && poData.status === 'qa-hold' && (
            <div>
              <h4 className="font-semibold mb-3">Notes</h4>
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-sm">QA team reported quality issues for one of the delivered items.</p>
              </div>
            </div>
          )}

          {/* Notes / Cancellation Reason - Manager View for Cancelled Status */}
          {userRole === 'manager' && poData.status === 'cancelled' && (
            <div>
              <h4 className="font-semibold mb-3">Notes / Cancellation Reason</h4>
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-sm">Order was cancelled by manager.</p>
              </div>
            </div>
          )}

          {/* Notes / Issues - Manager View for Delivered Status */}
          {userRole === 'manager' && poData.status === 'delivered' && (
            <div>
              <h4 className="font-semibold mb-3">Notes / Issues</h4>
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">No issues.</p>
              </div>
            </div>
          )}

          {/* Action Buttons - Employee View */}
          {userRole === 'employee' && (
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleLogIssue} className="border-red-600 text-red-600 hover:bg-red-50">
                Log Issue
              </Button>
              <Button onClick={handleUpdateDeliveryNote} className="bg-black hover:bg-black/90">
                Update Delivery Note
              </Button>
            </div>
          )}

          {/* Action Buttons - Manager View for Active Status */}
          {userRole === 'manager' && poData.status === 'active' && (
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleCancelOrder} className="border-red-600 text-red-600 hover:bg-red-50">
                Cancel Order
              </Button>
              <Button onClick={handleMarkAsDelivered} className="bg-black hover:bg-black/90">
                Mark as Delivered
              </Button>
            </div>
          )}

          {/* Action Buttons - Manager View for QA Hold Status */}
          {userRole === 'manager' && poData.status === 'qa-hold' && (
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleRequestFollowUp}>
                Request Follow-up
              </Button>
              <Button onClick={handleResolveAndClose} className="bg-black hover:bg-black/90">
                Resolve & Close
              </Button>
            </div>
          )}

          {/* Action Buttons - Manager View for Delivered Status */}
          {userRole === 'manager' && poData.status === 'delivered' && (
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleRequestFollowUp}>
                Request Follow-up
              </Button>
              <Button onClick={handleApproveFinalDelivery} className="bg-black hover:bg-black/90">
                Approve Final Delivery
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
