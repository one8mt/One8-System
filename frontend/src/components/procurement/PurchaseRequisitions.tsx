import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, FileText, Clock, CheckCircle, XCircle, Inbox, FileEdit, UserCheck, AlertCircle } from 'lucide-react';
import { AddPRForm } from './forms/AddPRForm';
import { chartColors, getTooltipStyle, getAxisStyle } from '../ChartColors';
import { InventoryBadge } from '../InventoryBadge';
import { NotificationBanner } from '../NotificationBanner';
import { CriticalStockModal, CriticalStockItem } from './modals/CriticalStockModal';
import { CreatePRModal } from './modals/CreatePRModal';
import { ReviewPRModal } from './modals/ReviewPRModal';
import { KpiCards } from '../shared/KpiCards';
import { ProcurementStatusBadge } from '../shared/ProcurementStatusBadge';
import { StatusIcon } from '../shared/StatusIcon';
import { ChartCard } from '../shared/ChartCard';
import { RecentListCard } from '../shared/RecentListCard';

interface PurchaseRequisitionsProps {
  userRole: 'employee' | 'manager';
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
}

const statusData = [
  { name: 'Pending', value: 12, color: '#eab308' },
  { name: 'Approved', value: 28, color: '#22c55e' },
  { name: 'Rejected', value: 5, color: '#ef4444' },
];

const monthlyData = [
  { month: 'Jan', requisitions: 15 },
  { month: 'Feb', requisitions: 22 },
  { month: 'Mar', requisitions: 18 },
  { month: 'Apr', requisitions: 25 },
  { month: 'May', requisitions: 31 },
  { month: 'Jun', requisitions: 28 },
];

// Employee View KPIs
const employeeKpiData = [
  { title: 'Incoming PRs from Inventory', value: '12', change: '+8%', icon: Inbox },
  { title: 'My Draft PRs', value: '5', change: '-3%', icon: FileEdit },
  { title: 'PRs Awaiting Manager Approval', value: '18', change: '+15%', icon: UserCheck },
  { title: 'Urgent Manual PRs Created', value: '7', change: '+22%', icon: AlertCircle },
];

// Manager View KPIs
const managerKpiData = [
  { title: 'Total Requisitions', value: '45', change: '+12%', icon: FileText },
  { title: 'Avg. Approval Time', value: '2.3 days', change: '-8%', icon: Clock },
  { title: 'Approval Rate', value: '84%', change: '+5%', icon: CheckCircle },
  { title: 'This Month', value: '28', change: '+15%', icon: FileText },
];

const recentRequests = [
  { 
    id: 'PR-2025-001', 
    title: 'Office Supplies', 
    amount: 'SAR 2,450', 
    status: 'pending', 
    date: '2025-09-24',
    inventory: { available: 35, incoming: 20, rop: 50 }
  },
  { 
    id: 'PR-2025-002', 
    title: 'Software License', 
    amount: 'SAR 12,000', 
    status: 'approved', 
    date: '2025-09-23',
    inventory: { available: 180, incoming: 0, rop: 100 }
  },
  { 
    id: 'PR-2025-003', 
    title: 'Equipment Repair', 
    amount: 'SAR 850', 
    status: 'approved', 
    date: '2025-09-22',
    inventory: { available: 5, incoming: 15, rop: 20 }
  },
  { 
    id: 'PR-2025-004', 
    title: 'Marketing Materials', 
    amount: 'SAR 3,200', 
    status: 'rejected', 
    date: '2025-09-21',
    inventory: { available: 75, incoming: 25, rop: 60 }
  },
];

export function PurchaseRequisitions({ userRole, showAddForm, setShowAddForm }: PurchaseRequisitionsProps) {
  const [showCriticalStockModal, setShowCriticalStockModal] = useState(false);
  const [showCreatePRModal, setShowCreatePRModal] = useState(false);
  const [createPRMode, setCreatePRMode] = useState<'inventory' | 'manual'>('manual');
  const [selectedCriticalItem, setSelectedCriticalItem] = useState<CriticalStockItem | null>(null);
  const [showReviewPRModal, setShowReviewPRModal] = useState(false);
  const [selectedPR, setSelectedPR] = useState<any>(null);

  const handleCreatePRFromInventory = (itemData: CriticalStockItem) => {
    setSelectedCriticalItem(itemData);
    setCreatePRMode('inventory');
    setShowCreatePRModal(true);
  };

  const handleCreateManualPR = () => {
    setSelectedCriticalItem(null);
    setCreatePRMode('manual');
    setShowCreatePRModal(true);
  };

  const handleViewDetails = (request: any) => {
    if (userRole === 'employee') {
      // For employees, open CreatePRModal with prefilled data and manager notes
      setSelectedPR({
        title: request.title,
        requester: 'John Doe',
        location: 'Main Warehouse',
        date: request.date,
        managerNotes: 'Please revise the quantity and resubmit. The requested amount exceeds budget allocation for this quarter.',
        items: [
          {
            id: '1',
            itemCode: request.id,
            itemName: request.title,
            qty: 100,
            for: 'Production Line A',
            priority: 'High'
          }
        ]
      });
      setCreatePRMode('manual');
      setShowCreatePRModal(true);
    } else {
      // For managers, open ReviewPRModal
      setSelectedPR({
        id: request.id,
        title: request.title,
        requester: 'John Doe',
        location: 'Main Warehouse',
        deliveryDate: '2025-10-15',
        notes: 'Urgent requirement for production line',
        items: [
          {
            itemCode: 'ITM-001',
            itemName: 'Office Supplies',
            qty: 100,
            for: 'Production Line A',
            priority: 'High',
            inventory: request.inventory
          }
        ]
      });
      setShowReviewPRModal(true);
    }
  };

  const getStatusKey = (status: string) =>
    (['approved', 'rejected', 'pending'].includes(status) ? status : 'pending') as
      | 'approved'
      | 'rejected'
      | 'pending';

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <NotificationBanner 
        userRole={userRole} 
        onCreatePR={() => setShowCriticalStockModal(true)}
        section="pr"
      />
      
      {/* Critical Stock Modal */}
      <CriticalStockModal 
        isOpen={showCriticalStockModal}
        onClose={() => setShowCriticalStockModal(false)}
        onCreatePR={handleCreatePRFromInventory}
      />

      {/* KPI Cards */}
      <KpiCards items={userRole === 'manager' ? managerKpiData : employeeKpiData} />

      {/* Charts - Manager Only */}
      {userRole === 'manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Requisitions by Status">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Monthly Trend">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis 
                    dataKey="month" 
                    {...getAxisStyle()}
                  />
                  <YAxis 
                    {...getAxisStyle()}
                  />
                  <Tooltip 
                    contentStyle={getTooltipStyle()}
                  />
                  <Bar 
                    dataKey="requisitions" 
                    fill={chartColors.primary} 
                    radius={4} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Process Status - Manager Only */}
      {userRole === 'manager' && (
        <Card>
          <CardHeader>
            <CardTitle>Process Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      In Process
                    </span>
                    <span className="text-muted-foreground">12 requisitions</span>
                  </div>
                  <Progress value={27} className="h-2 [&>div]:bg-yellow-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Completed
                    </span>
                    <span className="text-muted-foreground">33 requisitions</span>
                  </div>
                  <Progress value={73} className="h-2 [&>div]:bg-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-semibold mb-1 text-green-600">73%</p>
                  <p className="text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Requests */}
      <RecentListCard
        title={userRole === 'manager' ? 'Recent Requests' : 'My Purchase Requests'}
        action={
          userRole === 'employee' ? (
            <Button onClick={handleCreateManualPR} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          ) : null
        }
      >
          {userRole === 'employee' && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={handleCreateManualPR} 
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4" />
                  Create New PR
                </Button>
                <Button variant="outline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  View Pending
                </Button>
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  View Approved
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div key={request.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={getStatusKey(request.status)} />
                    <div>
                      <p className="font-medium">{request.id}</p>
                      <p className="text-sm text-muted-foreground">{request.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{request.amount}</p>
                    <ProcurementStatusBadge status={getStatusKey(request.status)} />
                    <p className="text-sm text-muted-foreground">{request.date}</p>
                    {userRole === 'manager' && request.status === 'pending' && (
                      <div className="flex gap-1">
                        {/* <Button size="sm" variant="outline" className="h-8 px-2 text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleViewDetails(request)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleViewDetails(request)}>
                          Reject
                        </Button> */}
                      </div>
                    )}
                    <Button size="sm" variant="outline" className="h-8 px-3" onClick={() => handleViewDetails(request)}>
                      View Details
                    </Button>
                  </div>
                </div>
                {/* Inventory Snapshot */}
                <div className="flex items-center gap-2 ml-8 mt-2">
                  <span className="text-xs text-muted-foreground">Inventory:</span>
                  <InventoryBadge 
                    available={request.inventory.available}
                    incoming={request.inventory.incoming}
                    rop={request.inventory.rop}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
      </RecentListCard>

      {/* Add PR Form */}
      {showAddForm && (
        <AddPRForm onClose={() => setShowAddForm(false)} />
      )}

      {/* Create PR Modal */}
      <CreatePRModal 
        isOpen={showCreatePRModal}
        onClose={() => {
          setShowCreatePRModal(false);
          setSelectedPR(null);
        }}
        mode={createPRMode}
        prefillData={
          createPRMode === 'inventory' && selectedCriticalItem ? {
            title: 'Critical Stock Replenishment',
            requester: 'Inventory System',
            location: selectedCriticalItem.warehouse,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: [{
              id: '1',
              itemCode: selectedCriticalItem.id,
              itemName: selectedCriticalItem.name,
              qty: selectedCriticalItem.suggestedQty,
              for: '',
              priority: 'Medium'
            }]
          } : userRole === 'employee' && selectedPR ? selectedPR : undefined
        }
      />

      {/* Review PR Modal */}
      {showReviewPRModal && selectedPR && (
        <ReviewPRModal 
          isOpen={showReviewPRModal}
          onClose={() => {
            setShowReviewPRModal(false);
            setSelectedPR(null);
          }}
          prData={selectedPR}
        />
      )}
    </div>
  );
}
