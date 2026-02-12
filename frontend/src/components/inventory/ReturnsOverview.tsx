import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Package, CheckCircle, Clock, AlertTriangle, Star, UserCircle } from 'lucide-react';
import { RefundRequestModal } from './modals/RefundRequestModal';
import { MissingRequestModal } from './modals/MissingRequestModal';
import { DamagedRequestModal } from './modals/DamagedRequestModal';
import { ExchangeRequestModal } from './modals/ExchangeRequestModal';
import { KpiCards } from '../shared/KpiCards';
import { InventoryStatusBadge } from '../shared/InventoryStatusBadge';
import { InventoryReturnModeBadge, InventoryReturnTypeBadge } from '../shared/InventoryReturnBadges';

interface ReturnsOverviewProps {
  userRole: 'employee' | 'manager';
}

const kpiData = [
  { title: 'Items Received Today', value: '24', change: '+12%', icon: Package },
  { title: 'Pending Inventory Checks', value: '8%', change: '-8%', icon: Clock },
  { title: 'Items Marked as Damaged', value: '70', change: '+5%', icon: AlertTriangle },
  { title: 'Items Moved to Available Stock', value: '28 Avg', change: '+15%', icon: CheckCircle },
];

const returnsRequestsData = [
  {
    id: 'RET-001',
    clientName: 'Global Retail Group',
    created: 'Sep 20',
    invoiceNumber: 'INV-2024-1145',
    returnType: 'Refund',
    returnMode: 'Full',
    amount: 'SAR 12,450',
    rating: 4,
    status: 'Pending',
    progress: 45,
  },
  {
    id: 'RET-002',
    clientName: 'Tech Solutions Inc',
    created: 'Sep 19',
    invoiceNumber: 'INV-2024-1144',
    returnType: 'Missing',
    returnMode: 'Partial',
    amount: 'SAR 8,920',
    rating: 3,
    status: 'Approved',
    progress: 100,
  },
  {
    id: 'RET-003',
    clientName: 'Manufacturing Co Ltd',
    created: 'Sep 18',
    invoiceNumber: 'INV-2024-1143',
    returnType: 'Damage',
    returnMode: 'Partial',
    amount: 'SAR 5,670',
    rating: 2,
    status: 'Flagged',
    progress: 30,
  },
  {
    id: 'RET-004',
    clientName: 'Office Supplies Plus',
    created: 'Sep 17',
    invoiceNumber: 'INV-2024-1142',
    returnType: 'Exchange',
    returnMode: 'Full',
    amount: 'SAR 15,230',
    rating: 5,
    status: 'Approved',
    progress: 85,
  },
  {
    id: 'RET-005',
    clientName: 'Wholesale Distributors',
    created: 'Sep 16',
    invoiceNumber: 'INV-2024-1141',
    returnType: 'Refund',
    returnMode: 'Partial',
    amount: 'SAR 3,450',
    rating: 4,
    status: 'Pending',
    progress: 60,
  },
  {
    id: 'RET-006',
    clientName: 'ABC Corporation',
    created: 'Sep 15',
    invoiceNumber: 'INV-2024-1140',
    returnType: 'Refund',
    returnMode: 'Full',
    amount: 'SAR 7,890',
    rating: 3,
    status: 'Approved',
    progress: 90,
  },
  {
    id: 'RET-007',
    clientName: 'TechMart LLC',
    created: 'Sep 14',
    invoiceNumber: 'INV-2024-1139',
    returnType: 'Missing',
    returnMode: 'Partial',
    amount: 'SAR 4,560',
    rating: 2,
    status: 'Flagged',
    progress: 25,
  },
  {
    id: 'RET-008',
    clientName: 'Global Retail Group',
    created: 'Sep 13',
    invoiceNumber: 'INV-2024-1138',
    returnType: 'Refund',
    returnMode: 'Full',
    amount: 'SAR 9,320',
    rating: 5,
    status: 'Pending',
    progress: 55,
  },
  {
    id: 'RET-009',
    clientName: 'Supply Chain Inc',
    created: 'Sep 12',
    invoiceNumber: 'INV-2024-1137',
    returnType: 'Damage',
    returnMode: 'Partial',
    amount: 'SAR 6,780',
    rating: 3,
    status: 'Pending',
    progress: 40,
  },
  {
    id: 'RET-010',
    clientName: 'Eastern Traders',
    created: 'Sep 11',
    invoiceNumber: 'INV-2024-1136',
    returnType: 'Exchange',
    returnMode: 'Full',
    amount: 'SAR 11,450',
    rating: 4,
    status: 'Approved',
    progress: 75,
  },
  {
    id: 'RET-011',
    clientName: 'Metro Supplies',
    created: 'Sep 10',
    invoiceNumber: 'INV-2024-1135',
    returnType: 'Missing',
    returnMode: 'Partial',
    amount: 'SAR 5,230',
    rating: 2,
    status: 'Pending',
    progress: 35,
  },
  {
    id: 'RET-012',
    clientName: 'Global Retail Group',
    created: 'Sep 9',
    invoiceNumber: 'INV-2024-1134',
    returnType: 'Refund',
    returnMode: 'Partial',
    amount: 'SAR 8,120',
    rating: 4,
    status: 'Approved',
    progress: 95,
  },
  {
    id: 'RET-013',
    clientName: 'Pacific Wholesale',
    created: 'Sep 8',
    invoiceNumber: 'INV-2024-1133',
    returnType: 'Exchange',
    returnMode: 'Full',
    amount: 'SAR 13,670',
    rating: 5,
    status: 'Pending',
    progress: 65,
  },
  {
    id: 'RET-014',
    clientName: 'Northern Distributors',
    created: 'Sep 7',
    invoiceNumber: 'INV-2024-1132',
    returnType: 'Missing',
    returnMode: 'Partial',
    amount: 'SAR 3,890',
    rating: 3,
    status: 'Approved',
    progress: 80,
  },
  {
    id: 'RET-015',
    clientName: 'Global Retail Group',
    created: 'Sep 6',
    invoiceNumber: 'INV-2024-1131',
    returnType: 'Refund',
    returnMode: 'Full',
    amount: 'SAR 10,560',
    rating: 4,
    status: 'Pending',
    progress: 50,
  },
];

export function ReturnsOverview({ userRole }: ReturnsOverviewProps) {
  const [selectedReturn, setSelectedReturn] = useState<typeof returnsRequestsData[0] | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [showDamagedModal, setShowDamagedModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  const returnTypeStyles: Record<
    'Refund' | 'Missing' | 'Damaged' | 'Exchange',
    { badge: string; label: string; card: string }
  > = {
    Refund: {
      badge: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800/70',
      label: 'text-green-700 dark:text-green-300',
      card: 'border-green-200/70 bg-green-50/30 dark:border-green-800/70 dark:bg-green-950/20'
    },
    Missing: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/70',
      label: 'text-blue-700 dark:text-blue-300',
      card: 'border-blue-200/70 bg-blue-50/30 dark:border-blue-800/70 dark:bg-blue-950/20'
    },
    Damaged: {
      badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/70',
      label: 'text-red-700 dark:text-red-300',
      card: 'border-red-200/70 bg-red-50/30 dark:border-red-800/70 dark:bg-red-950/20'
    },
    Exchange: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700',
      label: 'text-amber-800 dark:text-amber-200',
      card: 'border-amber-300/70 bg-amber-50/40 dark:border-amber-700 dark:bg-amber-900/30'
    }
  };

  // Only show for managers
  if (userRole !== 'manager') {
    return null;
  }

  const getStatusKey = (status: string) =>
    (status === 'Approved' ? 'approved' : status === 'Flagged' ? 'flagged' : 'pending') as
      | 'approved'
      | 'flagged'
      | 'pending';

  const getReturnTypeKey = (type: string) =>
    (['Refund', 'Missing', 'Damage', 'Exchange'].includes(type) ? type : 'Refund') as
      | 'Refund'
      | 'Missing'
      | 'Damage'
      | 'Exchange';

  const getReturnModeKey = (mode: string) =>
    (['Full', 'Partial'].includes(mode) ? mode : 'Full') as 'Full' | 'Partial';

  const handleRowClick = (returnRequest: typeof returnsRequestsData[0]) => {
    setSelectedReturn(returnRequest);
    
    switch (returnRequest.returnType) {
      case 'Refund':
        setShowRefundModal(true);
        break;
      case 'Missing':
        setShowMissingModal(true);
        break;
      case 'Damage':
        setShowDamagedModal(true);
        break;
      case 'Exchange':
        setShowExchangeModal(true);
        break;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  // Group returns by type
  const refundReturns = returnsRequestsData.filter(r => r.returnType === 'Refund');
  const missingReturns = returnsRequestsData.filter(r => r.returnType === 'Missing');
  const damagedReturns = returnsRequestsData.filter(r => r.returnType === 'Damage');
  const exchangeReturns = returnsRequestsData.filter(r => r.returnType === 'Exchange');

  const handleCardClick = (returnRequest: typeof returnsRequestsData[0]) => {
    setSelectedReturn(returnRequest);
    
    switch (returnRequest.returnType) {
      case 'Refund':
        setShowRefundModal(true);
        break;
      case 'Missing':
        setShowMissingModal(true);
        break;
      case 'Damage':
        setShowDamagedModal(true);
        break;
      case 'Exchange':
        setShowExchangeModal(true);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Returns Requests Section */}
      <Card>
        <CardHeader>
          <CardTitle>Returns Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track all your return requests
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Refund Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Refund.label}`}>Refund</h4>
                <Badge variant="outline" className={returnTypeStyles.Refund.badge}>
                  {refundReturns.length}
                </Badge>
              </div>
              {refundReturns.map((returnRequest) => (
                <div
                  key={returnRequest.id}
                  className={`p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer space-y-2 ${returnTypeStyles.Refund.card}`}
                  onClick={() => handleCardClick(returnRequest)}
                >
                  <p className="font-medium">{returnRequest.id}</p>
                  <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                  <p className="text-sm">From: {returnRequest.clientName}</p>
                  <p className="text-xs text-muted-foreground">Created: {returnRequest.created}</p>
                </div>
              ))}
            </div>

            {/* Missing Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Missing.label}`}>Missing</h4>
                <Badge variant="outline" className={returnTypeStyles.Missing.badge}>
                  {missingReturns.length}
                </Badge>
              </div>
              {missingReturns.map((returnRequest) => (
                <div
                  key={returnRequest.id}
                  className={`p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer space-y-2 ${returnTypeStyles.Missing.card}`}
                  onClick={() => handleCardClick(returnRequest)}
                >
                  <p className="font-medium">{returnRequest.id}</p>
                  <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                  <p className="text-sm">From: {returnRequest.clientName}</p>
                  <p className="text-xs text-muted-foreground">Created: {returnRequest.created}</p>
                </div>
              ))}
            </div>

            {/* Damaged Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Damaged.label}`}>Damaged</h4>
                <Badge variant="outline" className={returnTypeStyles.Damaged.badge}>
                  {damagedReturns.length}
                </Badge>
              </div>
              {damagedReturns.map((returnRequest) => (
                <div
                  key={returnRequest.id}
                  className={`p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer space-y-2 ${returnTypeStyles.Damaged.card}`}
                  onClick={() => handleCardClick(returnRequest)}
                >
                  <p className="font-medium">{returnRequest.id}</p>
                  <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                  <p className="text-sm">From: {returnRequest.clientName}</p>
                  <p className="text-xs text-muted-foreground">Created: {returnRequest.created}</p>
                </div>
              ))}
            </div>

            {/* Exchange Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Exchange.label}`}>Exchange</h4>
                <Badge variant="outline" className={returnTypeStyles.Exchange.badge}>
                  {exchangeReturns.length}
                </Badge>
              </div>
              {exchangeReturns.map((returnRequest) => (
                <div
                  key={returnRequest.id}
                  className={`p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer space-y-2 ${returnTypeStyles.Exchange.card}`}
                  onClick={() => handleCardClick(returnRequest)}
                >
                  <p className="font-medium">{returnRequest.id}</p>
                  <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">Created: {returnRequest.created}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Banner */}
      <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <p className="text-red-900 dark:text-red-100">
          Client GulfCo submitted 3 refund requests this week
        </p>
      </div>

      {/* KPI Cards Section */}
      <div>
        <h3 className="mb-4 text-muted-foreground">A quick overview of today's key inventory alerts</h3>
        <KpiCards items={kpiData} />
      </div>

      {/* Returns Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Returns Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete list of all return requests with detailed information
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-scroll">
              <table className="w-full">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Request ID</th>
                    <th className="text-left p-3 font-medium">Client Name</th>
                    <th className="text-left p-3 font-medium">Invoice Number</th>
                    <th className="text-left p-3 font-medium">Return Type</th>
                    <th className="text-left p-3 font-medium">Return Mode</th>
                    <th className="text-left p-3 font-medium">Amount</th>
                    <th className="text-left p-3 font-medium">Client Rating</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {returnsRequestsData.map((returnRequest) => (
                    <tr
                      key={returnRequest.id}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(returnRequest)}
                    >
                      <td className="p-3">{returnRequest.id}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          {returnRequest.clientName}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{returnRequest.invoiceNumber}</td>
                      <td className="p-3"><InventoryReturnTypeBadge type={getReturnTypeKey(returnRequest.returnType)} /></td>
                      <td className="p-3"><InventoryReturnModeBadge mode={getReturnModeKey(returnRequest.returnMode)} /></td>
                      <td className="p-3 font-medium">{returnRequest.amount}</td>
                      <td className="p-3">{renderStars(returnRequest.rating)}</td>
                      <td className="p-3"><InventoryStatusBadge status={getStatusKey(returnRequest.status)} /></td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={returnRequest.progress} className="w-20" />
                          <span className="text-sm text-muted-foreground">{returnRequest.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedReturn && (
        <>
          <RefundRequestModal
            open={showRefundModal}
            onClose={() => {
              setShowRefundModal(false);
              setSelectedReturn(null);
            }}
            returnData={selectedReturn}
          />
          <MissingRequestModal
            open={showMissingModal}
            onClose={() => {
              setShowMissingModal(false);
              setSelectedReturn(null);
            }}
            returnData={selectedReturn}
          />
          <DamagedRequestModal
            open={showDamagedModal}
            onClose={() => {
              setShowDamagedModal(false);
              setSelectedReturn(null);
            }}
            returnData={selectedReturn}
          />
          <ExchangeRequestModal
            open={showExchangeModal}
            onClose={() => {
              setShowExchangeModal(false);
              setSelectedReturn(null);
            }}
            returnData={selectedReturn}
          />
        </>
      )}
    </div>
  );
}
