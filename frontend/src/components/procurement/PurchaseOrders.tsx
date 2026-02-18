import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, ShoppingCart, Package, TrendingUp, DollarSign, AlertTriangle, ClipboardList, Truck, CheckSquare } from 'lucide-react';
import { AddPOForm } from './forms/AddPOForm';
import { InventoryBadge } from '../InventoryBadge';
import { NotificationBanner } from '../NotificationBanner';
import { SupplierDelayModal } from './modals/SupplierDelayModal';
import { PODetailsModal } from './modals/PODetailsModal';
import { KpiCards } from '../shared/KpiCards';
import { ProcurementStatusBadge } from '../shared/ProcurementStatusBadge';
import { ChartCard } from '../shared/ChartCard';
import { RecentListCard } from '../shared/RecentListCard';
import { DonutChart } from '../shared/DonutChart';

interface PurchaseOrdersProps {
  userRole: 'employee' | 'manager';
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
}

const monthlyOrderData = [
  { month: 'Jan', orders: 18, value: 125000 },
  { month: 'Feb', orders: 22, value: 148000 },
  { month: 'Mar', orders: 25, value: 167000 },
  { month: 'Apr', orders: 28, value: 195000 },
  { month: 'May', orders: 31, value: 210000 },
  { month: 'Jun', orders: 29, value: 198000 },
];

const statusDistribution = [
  { name: 'Active', value: 15, color: '#3b82f6' },
  { name: 'Delivered', value: 42, color: '#22c55e' },
  { name: 'Cancelled', value: 3, color: '#ef4444' },
];

// Employee View KPIs
const employeeKpiData = [
  { title: 'My Active Orders', value: '15', change: '+8%', icon: ClipboardList },
  { title: 'Orders In Transit', value: '9', change: '+12%', icon: Truck },
  { title: 'Delivered Orders (This Month)', value: '42', change: '+18%', icon: CheckSquare },
  { title: 'Orders with Issues', value: '4', change: '-15%', icon: AlertTriangle },
];

// Manager View KPIs
const managerKpiData = [
  { title: 'Total Orders', value: '60', change: '+10%', icon: ShoppingCart },
  { title: 'Active Orders', value: '15', change: '+8%', icon: Package },
  { title: 'Delivered Orders', value: '42', change: '+18%', icon: CheckSquare },
  { title: 'Total Value', value: 'SAR 1.2M', change: '+22%', icon: DollarSign },
];

const recentOrders = [
  { 
    id: 'PO-2025-001', 
    title: 'IT Equipment Package', 
    supplier: 'TechCorp Ltd', 
    amount: 'SAR 42,800', 
    status: 'active', 
    date: '2025-09-24',
    inventory: { available: 25, incoming: 100, rop: 50 }
  },
  { 
    id: 'PO-2025-002', 
    title: 'Office Furniture', 
    supplier: 'Office Plus', 
    amount: 'SAR 15,200', 
    status: 'qa-hold', 
    date: '2025-09-20',
    inventory: { available: 85, incoming: 0, rop: 60 }
  },
  { 
    id: 'PO-2025-003', 
    title: 'Marketing Materials', 
    supplier: 'Print Solutions', 
    amount: 'SAR 3,200', 
    status: 'delivered', 
    date: '2025-09-18',
    inventory: { available: 200, incoming: 0, rop: 100 }
  },
  { 
    id: 'PO-2025-004', 
    title: 'Software Licenses', 
    supplier: 'SoftCorp', 
    amount: 'SAR 28,900', 
    status: 'cancelled', 
    date: '2025-09-15',
    inventory: { available: 12, incoming: 0, rop: 25 }
  },
];

export function PurchaseOrders({ userRole, showAddForm, setShowAddForm }: PurchaseOrdersProps) {
  const [showSupplierDelayModal, setShowSupplierDelayModal] = useState(false);
  const [showPODetailsModal, setShowPODetailsModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);

  const handleTrackOrder = (order: any) => {
    setSelectedPO({
      id: order.id,
      title: order.title,
      supplier: order.supplier,
      status: order.status,
      totalValue: order.amount,
      orderDate: order.date,
      expectedDelivery: '2025-10-01',
      items: [
        {
          itemName: 'Laptop - Dell XPS 15',
          orderedQty: 10,
          receivedQty: 7,
          remainingQty: 3,
          status: 'Partial Delivery' as const
        },
        {
          itemName: 'Monitor - 27" 4K',
          orderedQty: 20,
          receivedQty: 20,
          remainingQty: 0,
          status: 'Delivered' as const
        },
        {
          itemName: 'Keyboard - Mechanical',
          orderedQty: 15,
          receivedQty: 0,
          remainingQty: 15,
          status: 'In Transit' as const
        }
      ],
      paymentTerms: userRole === 'manager' ? 'Net 30' : undefined,
      invoiceStatus: userRole === 'manager' ? 'Pending' : undefined,
      onTimeStatus: userRole === 'manager' ? (order.status === 'delivered' ? 'On Time' as const : 'Delayed' as const) : undefined
    });
    setShowPODetailsModal(true);
  };

  const toStatusKey = (status: string) =>
    (['active', 'delivered', 'cancelled', 'qa-hold'].includes(status)
      ? status
      : 'active') as 'active' | 'delivered' | 'cancelled' | 'qa-hold';

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <NotificationBanner 
        userRole={userRole}
        onViewDelays={() => setShowSupplierDelayModal(true)}
        section="po"
      />
      
      {/* Supplier Delay Modal */}
      <SupplierDelayModal 
        isOpen={showSupplierDelayModal}
        onClose={() => setShowSupplierDelayModal(false)}
      />

      {/* KPI Cards */}
      <KpiCards items={userRole === 'manager' ? managerKpiData : employeeKpiData} />

      {/* Charts - Manager Only */}
      {userRole === 'manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Orders & Value by Month">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyOrderData}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} label={{ value: 'Value', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }} 
                     tick={{ fill: 'hsl(var(--muted-foreground))' }}
                     axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'orders' ? `${value} orders` : `${value.toLocaleString()}`,
                      name === 'orders' ? 'Orders Count' : 'Total Value'
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Order Status Distribution">
            <DonutChart
              data={statusDistribution}
              className="h-64"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              tooltipProps={{
                formatter: (value, name) => [`${value} orders`, name],
              }}
            />
            <div className="flex justify-center mt-4 space-x-4">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* Process Status - Manager Only */}
      {userRole === 'manager' && (
        <Card>
          <CardHeader>
            <CardTitle>Process Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Active Orders
                  </span>
                  <span className="text-muted-foreground">15 orders</span>
                </div>
                <Progress value={25} className="h-2 [&>div]:bg-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    In Transit
                  </span>
                  <span className="text-muted-foreground">8 orders</span>
                </div>
                <Progress value={13} className="h-2 [&>div]:bg-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Delivered
                  </span>
                  <span className="text-muted-foreground">42 orders</span>
                </div>
                <Progress value={70} className="h-2 [&>div]:bg-green-500" />
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-3xl font-semibold mb-1 text-green-600">95%</p>
                <p className="text-muted-foreground">On-Time Delivery Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold mb-1 text-blue-600">SAR 198K</p>
                <p className="text-muted-foreground">Current Month Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Purchase Orders */}
      <RecentListCard
        title={userRole === 'manager' ? 'Recent Purchase Orders' : 'My Purchase Orders'}
        action={
          userRole === 'employee' ? (
            <Button onClick={() => setShowAddForm(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          ) : null
        }
      >
          {userRole === 'employee' && (
            <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Order Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={() => setShowAddForm(true)} 
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Create New PO
                </Button>
                <Button variant="outline" className="gap-2">
                  <Package className="h-4 w-4" />
                  Track Delivery
                </Button>
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View History
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {userRole === 'manager' && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{order.supplier}</p>
                        <p className="text-xs text-muted-foreground">Supplier</p>
                      </div>
                    )}
                    <p className="font-medium">{order.amount}</p>
                    <ProcurementStatusBadge status={toStatusKey(order.status)} />
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                    <Button size="sm" variant="outline" className="h-8 px-3" onClick={() => handleTrackOrder(order)}>
                      {userRole === 'manager' ? 'Review & Actions' : 'View Details'}
                    </Button>
                  </div>
                </div>
                {/* Inventory Snapshot */}
                <div className="flex items-center gap-2 ml-8 mt-2">
                  <span className="text-xs text-muted-foreground">Inventory:</span>
                  <InventoryBadge 
                    available={order.inventory.available}
                    incoming={order.inventory.incoming}
                    rop={order.inventory.rop}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
      </RecentListCard>

      {/* Add PO Form */}
      {showAddForm && (
        <AddPOForm onClose={() => setShowAddForm(false)} />
      )}

      {/* PO Details Modal */}
      {showPODetailsModal && selectedPO && (
        <PODetailsModal 
          isOpen={showPODetailsModal}
          onClose={() => {
            setShowPODetailsModal(false);
            setSelectedPO(null);
          }}
          userRole={userRole}
          poData={selectedPO}
        />
      )}
    </div>
  );
}
