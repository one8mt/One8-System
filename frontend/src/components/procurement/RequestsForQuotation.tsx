import { useState } from 'react';
import { RFQDetailsModal } from './modals/RFQDetailsModal';
import { CreateRFQModal } from './modals/CreateRFQModal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, LabelList } from 'recharts';
import { Plus, MessageSquare, TrendingDown, Award, Clock, Send, RotateCcw, Users, Mail, FileText } from 'lucide-react';
import { AddRFQForm } from './forms/AddRFQForm';
import { chartColors, getTooltipStyle, getAxisStyle } from '../ChartColors';
import { InventoryBadge } from '../InventoryBadge';
import { NotificationBanner } from '../NotificationBanner';
import { KpiCards } from '../shared/KpiCards';
import { ProcurementStatusBadge } from '../shared/ProcurementStatusBadge';
import { ChartCard } from '../shared/ChartCard';
import { RecentListCard } from '../shared/RecentListCard';

interface RequestsForQuotationProps {
  userRole: 'employee' | 'manager';
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
}

const supplierData = [
  { supplier: 'Supplier A', quotations: 12500 },
  { supplier: 'Supplier B', quotations: 13200 },
  { supplier: 'Supplier C', quotations: 11800 },
  { supplier: 'Supplier D', quotations: 14100 },
];

const priceComparisonData = [
  { month: 'Jan', bestPrice: 8500, avgPrice: 12000 },
  { month: 'Feb', bestPrice: 9200, avgPrice: 12500 },
  { month: 'Mar', bestPrice: 8800, avgPrice: 11800 },
  { month: 'Apr', bestPrice: 9500, avgPrice: 13200 },
  { month: 'May', bestPrice: 8200, avgPrice: 11500 },
  { month: 'Jun', bestPrice: 8900, avgPrice: 12200 },
];

// Employee View KPIs
const employeeKpiData = [
  { title: 'RFQs I Sent', value: '24', change: '+18%', icon: Send },
  { title: 'RFQs Returned by Manager', value: '3', change: '-12%', icon: RotateCcw },
  { title: 'Supplier Selection Pending', value: '8', change: '+5%', icon: Users },
  { title: 'Sent RFQs (Manager Handling Responses)', value: '19', change: '+22%', icon: Mail },
];

// Manager View KPIs
const managerKpiData = [
  { title: 'Total RFQs Sent', value: '32', change: '+14%', icon: FileText },
  { title: 'Quotations Received', value: '87', change: '+20%', icon: MessageSquare },
  { title: 'Best Price Supplier', value: 'Supplier C', change: '12% savings', icon: Award, changeTone: 'positive' as const },
  { title: 'Avg. Response Time', value: '3.5 days', change: '-10%', icon: Clock },
];

const recentRFQs = [
  { 
    id: 'RFQ-2025-001', 
    title: 'IT Equipment Package', 
    quotations: 4, 
    bestPrice: 'SAR 38,500', 
    status: 'active', 
    date: '2025-09-24',
    inventory: { available: 120, incoming: 50, rop: 80 }
  },
  { 
    id: 'RFQ-2025-002', 
    title: 'Office Furniture Set', 
    quotations: 6, 
    bestPrice: 'SAR 15,200', 
    status: 'completed', 
    date: '2025-09-23',
    inventory: { available: 45, incoming: 20, rop: 50 }
  },
  { 
    id: 'RFQ-2025-003', 
    title: 'Maintenance Services', 
    quotations: 3, 
    bestPrice: 'SAR 2,800', 
    status: 'active', 
    date: '2025-09-22',
    inventory: { available: 15, incoming: 30, rop: 40 }
  },
  { 
    id: 'RFQ-2025-004', 
    title: 'Software Licensing', 
    quotations: 2, 
    bestPrice: 'SAR 28,900', 
    status: 'pending', 
    date: '2025-09-21',
    inventory: { available: 8, incoming: 0, rop: 25 }
  },
];

export function RequestsForQuotation({ userRole, showAddForm, setShowAddForm }: RequestsForQuotationProps) {
  const [selectedRFQ, setSelectedRFQ] = useState<{ id: string; title: string } | null>(null);
  const [showCreateRFQModal, setShowCreateRFQModal] = useState(false);
  const [prefilledRFQData, setPrefilledRFQData] = useState<any>(null);

  const toStatusKey = (status: string) =>
    (['completed', 'active', 'pending'].includes(status) ? status : 'pending') as
      | 'completed'
      | 'active'
      | 'pending';

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <NotificationBanner userRole={userRole} section="rfq" />
      
      {/* RFQ Details Modal */}
      {selectedRFQ && (
        <RFQDetailsModal
          isOpen={!!selectedRFQ}
          onClose={() => setSelectedRFQ(null)}
          rfqId={selectedRFQ.id}
          rfqTitle={selectedRFQ.title}
        />
      )}

      {/* Create RFQ Modal */}
      {showCreateRFQModal && (
        <CreateRFQModal
          isOpen={showCreateRFQModal}
          onClose={() => setShowCreateRFQModal(false)}
          prefilledData={prefilledRFQData}
        />
      )}

      {/* KPI Cards */}
      <KpiCards items={userRole === 'manager' ? managerKpiData : employeeKpiData} />

      {/* Charts - Manager Only */}
      {userRole === 'manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Quotations by Supplier">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierData}>
                  <XAxis 
                    dataKey="supplier" 
                    {...getAxisStyle()}
                  />
                  <YAxis 
                    domain={[0, 16000]}
                    {...getAxisStyle()}
                  />
                  <Tooltip 
                    contentStyle={getTooltipStyle()}
                  />
                  <Bar 
                    dataKey="quotations" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList 
                      dataKey="quotations" 
                      position="top" 
                      style={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Price Comparison Trend">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceComparisonData}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value.toLocaleString()}`, name === 'bestPrice' ? 'Best Price' : 'Average Price']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bestPrice" 
                    stroke={chartColors.primary} 
                    strokeWidth={3}
                    name="Best Price"
                    dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgPrice" 
                    stroke={chartColors.tertiary} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Average Price"
                    dot={{ fill: chartColors.tertiary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Process Status - Manager Only */}
      {userRole === 'manager' && (
        <Card>
          <CardHeader>
            <CardTitle>RFQ Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    In Process
                  </span>
                  <span className="text-muted-foreground">7 RFQs</span>
                </div>
                <Progress value={22} className="h-2 [&>div]:bg-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    Awaiting Quotes
                  </span>
                  <span className="text-muted-foreground">12 RFQs</span>
                </div>
                <Progress value={37} className="h-2 [&>div]:bg-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Completed
                  </span>
                  <span className="text-muted-foreground">13 RFQs</span>
                </div>
                <Progress value={41} className="h-2 [&>div]:bg-green-500" />
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-semibold mb-1 text-green-600">68%</p>
                <p className="text-muted-foreground">Quote Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent RFQs */}
      <RecentListCard
        title={userRole === 'manager' ? 'Recent RFQs' : 'My RFQ Requests'}
        action={
          userRole === 'employee' ? (
            <Button onClick={() => setShowCreateRFQModal(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          ) : null
        }
      >
          {userRole === 'employee' && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">RFQ Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={() => setShowCreateRFQModal(true)} 
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send New RFQ
                </Button>
                <Button variant="outline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Track Responses
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {recentRFQs.map((rfq) => (
              <div key={rfq.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{rfq.id}</p>
                      <p className="text-sm text-muted-foreground">{rfq.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {userRole === 'manager' && (
                      <>
                        <div className="text-center">
                          <p className="text-sm font-medium">{rfq.quotations}</p>
                          <p className="text-xs text-muted-foreground">Quotes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{rfq.bestPrice}</p>
                          <p className="text-xs text-muted-foreground">Best Price</p>
                        </div>
                      </>
                    )}
                    <ProcurementStatusBadge status={toStatusKey(rfq.status)} />
                    <p className="text-sm text-muted-foreground">{rfq.date}</p>
                    {userRole === 'manager' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-3"
                        onClick={() => setSelectedRFQ({ id: rfq.id, title: rfq.title })}
                      >
                        View Details
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-3"
                        onClick={() => {
                          setPrefilledRFQData({
                            rfqId: rfq.id,
                            title: rfq.title,
                            date: rfq.date
                          });
                          setShowCreateRFQModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
                {/* Inventory Snapshot */}
                <div className="flex items-center gap-2 ml-8 mt-2">
                  <span className="text-xs text-muted-foreground">Inventory:</span>
                  <InventoryBadge 
                    available={rfq.inventory.available}
                    incoming={rfq.inventory.incoming}
                    rop={rfq.inventory.rop}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
      </RecentListCard>

      {/* Add RFQ Form */}
      {showAddForm && (
        <AddRFQForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
