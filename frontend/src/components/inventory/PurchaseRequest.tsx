import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Plus, FileText, Clock, CheckCircle, XCircle, Search, Upload, Download, Edit, TrendingUp, AlertTriangle, Package, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { CreatePRModal } from './modals/CreatePRModal';
import { ReceiveGoodsModal } from './modals/ReceiveGoodsModal';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { KpiCards } from '../shared/KpiCards';
import { InventoryStatusBadge } from '../shared/InventoryStatusBadge';
import { StatusIcon } from '../shared/StatusIcon';
import { InventoryTypeBadge } from '../shared/InventoryTypeBadge';

interface PurchaseRequestProps {
  userRole: 'employee' | 'manager';
}

const purchaseRequestKpiData = [
  { title: 'Total Requests Created', value: '93', change: '+12%', icon: FileText },
  { title: 'Low Stock Alerts Triggered', value: '8', change: '-8%', icon: AlertTriangle },
  { title: 'Average Approval Time', value: '6.2 hrs Avg', change: '+5%', icon: Clock },
  { title: 'Approved Requests', value: '28', change: '+15%', icon: CheckCircle },
];

const receiveGoodsKpiData = [
  { title: 'Total Goods Received', value: '156', change: '+18%', icon: Package },
  { title: 'Items Passed QA', value: '142', change: '+12%', icon: CheckCircle },
  { title: 'Items Rejected QA', value: '14', change: '-5%', icon: XCircle },
  { title: 'Average Receiving Time', value: '3.4 hrs', change: '-6%', icon: Clock },
];

const managerKpiData = [
  { title: 'Total Items in Stock', value: '1,247', change: '+8%', icon: Package },
  { title: 'Pending Requests', value: '18', change: '+3%', icon: Clock },
  { title: 'Approved Requests This Week', value: '42', change: '+15%', icon: CheckCircle },
  { title: 'Rejected Requests This Week', value: '5', change: '-12%', icon: XCircle },
];

const receiptsListData = [
  { id: 'PR-001', title: 'Office supplies', status: 'pending', created: 'Sep 20' },
  { id: 'PR-002', title: 'Office supplies', status: 'approved', created: 'Sep 21' },
  { id: 'PR-003', title: 'Office supplies', status: 'rejected', created: 'Sep 22' },
  { id: 'PO-004', title: 'Office supplies', status: 'approved', created: 'Sep 23' },
];

const receiveGoodsListData = [
  { id: 'RG-001', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 20' },
  { id: 'RG-002', title: 'Office Furniture Goods', status: 'pending', created: 'Sep 21' },
  { id: 'RG-003', title: 'Office Furniture Goods', status: 'rejected', created: 'Sep 22' },
  { id: 'RG-004', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 23' },
];

const inventoryData = [
  { 
    itemCode: 'ITM-001', 
    itemName: 'Laptop Dell XPS', 
    type: 'Installation', 
    unit: 'PCS',
    currentStock: 45,
    location: 'Warehouse A',
    supplier: 'Tech Suppliers Inc.',
    batchNo: 'BATCH-2025-001',
    project: 'Project Alpha',
    reorderPoint: 20
  },
  { 
    itemCode: 'ITM-002', 
    itemName: 'Office Chair', 
    type: 'Semi', 
    unit: 'PCS',
    currentStock: 120,
    location: 'Warehouse B',
    supplier: 'Furniture Co.',
    batchNo: 'BATCH-2025-002',
    project: 'HQ Renovation',
    reorderPoint: 50
  },
  { 
    itemCode: 'ITM-003', 
    itemName: 'Steel Beams', 
    type: 'Raw', 
    unit: 'MT',
    currentStock: 8,
    location: 'Warehouse C',
    supplier: 'Metal Works Ltd.',
    batchNo: 'BATCH-2025-003',
    project: 'Site B',
    reorderPoint: 15
  },
  { 
    itemCode: 'ITM-004', 
    itemName: 'Paint - White', 
    type: 'Raw', 
    unit: 'LTR',
    currentStock: 350,
    location: 'Warehouse A',
    supplier: 'Paint Masters',
    batchNo: 'BATCH-2025-004',
    project: 'Project Beta',
    reorderPoint: 100
  },
  { 
    itemCode: 'ITM-005', 
    itemName: 'Monitor 24"', 
    type: 'Installation', 
    unit: 'PCS',
    currentStock: 65,
    location: 'Warehouse B',
    supplier: 'Tech Suppliers Inc.',
    batchNo: 'BATCH-2025-005',
    project: 'Office Setup',
    reorderPoint: 30
  },
];

// Manager Requests & Approvals Data
const operationRequests = [
  { id: 'PR-024', itemCode: 'ITM-089', title: 'Office supplies', from: 'Sarah Chen', created: 'Nov 15, 2025' },
  { id: 'RG-018', itemCode: 'ITM-102', title: 'Raw materials', from: 'Mike Johnson', created: 'Nov 14, 2025' },
  { id: 'ITP-012', itemCode: 'ITM-045', title: 'Production parts', from: 'Emily Davis', created: 'Nov 13, 2025' },
];

const approvedRequests = [
  { id: 'PR-022', itemCode: 'ITM-067', title: 'IT Equipment', from: 'John Smith', created: 'Nov 14, 2025' },
  { id: 'RG-016', itemCode: 'ITM-089', title: 'Furniture order', from: 'Lisa Wang', created: 'Nov 13, 2025' },
  { id: 'TO-008', itemCode: 'ITM-034', title: 'Materials transfer', from: 'David Lee', created: 'Nov 12, 2025' },
];

const rejectedRequests = [
  { id: 'PR-021', itemCode: 'ITM-056', title: 'Office supplies', from: 'Anna Brown', created: 'Nov 13, 2025' },
  { id: 'ITP-011', itemCode: 'ITM-078', title: 'Production materials', from: 'Tom Wilson', created: 'Nov 11, 2025' },
];

// Analytics Chart Data
const reorderPointData = [
  { item: 'Steel Beams', quantity: 8, reorderPoint: 15 },
  { item: 'Plastic Resin', quantity: 22, reorderPoint: 50 },
  { item: 'Copper Wire', quantity: 35, reorderPoint: 60 },
  { item: 'Paint White', quantity: 85, reorderPoint: 100 },
  { item: 'Bolts M8', quantity: 145, reorderPoint: 200 },
];

const prVsGrnData = [
  { month: 'Jul', pr: 42, grn: 38 },
  { month: 'Aug', pr: 38, grn: 35 },
  { month: 'Sep', pr: 45, grn: 42 },
  { month: 'Oct', pr: 52, grn: 48 },
  { month: 'Nov', pr: 48, grn: 45 },
];

const stockValueData = [
  { month: 'Jul', value: 285 },
  { month: 'Aug', value: 312 },
  { month: 'Sep', value: 298 },
  { month: 'Oct', value: 335 },
  { month: 'Nov', value: 358 },
];

export function PurchaseRequest({ userRole }: PurchaseRequestProps) {
  const [showCreatePRModal, setShowCreatePRModal] = useState(false);
  const [showReceiveGoodsModal, setShowReceiveGoodsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('purchase-request');

  const getStatusKey = (status: string) =>
    (['approved', 'rejected', 'pending'].includes(status) ? status : 'pending') as
      | 'approved'
      | 'rejected'
      | 'pending';

  return (
    <div className="space-y-6">
      {/* Employee View - Overview Section */}
      {userRole === 'employee' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track material receipts and inspection progress
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { id: 'RG-001', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 20' },
                { id: 'PR-001', title: 'Office supplies', status: 'pending', created: 'Sep 20' },
                { id: 'ITP-001', title: 'Product D', status: 'rejected', created: 'Sep 20' },
                { id: 'TO-001', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 20' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={getStatusKey(item.status)} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.id}</span>
                        <span className="text-muted-foreground">—</span>
                        <span className="text-sm">{item.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Created: {item.created}</p>
                    </div>
                  </div>
                  <InventoryStatusBadge status={getStatusKey(item.status)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Banners - EMPLOYEE ONLY */}
      {userRole === 'employee' && (
        <div className="space-y-3">
          {/* PR / Reorder Point Alert */}
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-900 dark:text-red-100">
                You have <span className="font-semibold">5 items</span> below reorder point
              </p>
            </div>
            <Button 
              onClick={() => setShowCreatePRModal(true)} 
              size="sm"
              className="gap-2 bg-black text-white hover:bg-black/90"
            >
              <Plus className="h-4 w-4" />
              Create PR
            </Button>
          </div>

          {/* GRN Alert */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-900 dark:text-yellow-100">
                You have <span className="font-semibold">3 items</span> need to make GRN
              </p>
            </div>
            <Button 
              onClick={() => setShowReceiveGoodsModal(true)} 
              size="sm"
              className="gap-2 bg-black text-white hover:bg-black/90"
            >
              <Plus className="h-4 w-4" />
              Add GRN
            </Button>
          </div>
        </div>
      )}

      {/* KPI Cards Section */}
      <div>
        <h3 className="mb-4 text-muted-foreground">A quick overview of today's key inventory alerts</h3>
        <KpiCards
          items={
            userRole === 'manager'
              ? managerKpiData
              : activeTab === 'purchase-request'
                ? purchaseRequestKpiData
                : receiveGoodsKpiData
          }
        />
      </div>

      {/* Tabs Section */}
      {userRole === 'employee' && (
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="purchase-request" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b px-6 pt-6">
                <TabsList className="h-auto p-0 bg-transparent border-0">
                  <TabsTrigger 
                    value="purchase-request" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                  >
                    Purchase Request
                  </TabsTrigger>
                  <TabsTrigger 
                    value="receive-goods" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                  >
                    Receive Goods
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="purchase-request" className="p-6 mt-0">
                {/* Total Receipts List */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Total Receipts List</h3>
                  <div className="space-y-2">
                    {receiptsListData.map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={getStatusKey(receipt.status)} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{receipt.id}</span>
                              <span className="text-muted-foreground">—</span>
                              <span className="text-sm">{receipt.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Created: {receipt.created}</p>
                          </div>
                        </div>
                        <InventoryStatusBadge status={getStatusKey(receipt.status)} />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="receive-goods" className="p-6 mt-0">
                {/* Receive Goods List */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Total Receipts List</h3>
                  <div className="space-y-2">
                    {receiveGoodsListData.map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={getStatusKey(receipt.status)} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{receipt.id}</span>
                              <span className="text-muted-foreground">—</span>
                              <span className="text-sm">{receipt.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Created: {receipt.created}</p>
                          </div>
                        </div>
                        <InventoryStatusBadge status={getStatusKey(receipt.status)} />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Requests & Approvals Section - Manager Only */}
      {userRole === 'manager' && (
        <Card>
          <CardHeader>
            <CardTitle>Requests & Approvals</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track all operation requests and their approval status
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Operation Column */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Operation</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {operationRequests.map((request) => (
                    <Card key={request.id} className="border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 transition-colors">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{request.itemCode}</span>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
                          >
                            {request.id}
                          </Badge>
                        </div>
                        <p className="text-sm">{request.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>From: {request.from}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.created}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Approved Column */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Approved</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {approvedRequests.map((request) => (
                    <Card key={request.id} className="border-2 border-green-200 dark:border-green-800 hover:border-green-400 transition-colors">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{request.itemCode}</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            {request.id}
                          </Badge>
                        </div>
                        <p className="text-sm">{request.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>From: {request.from}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.created}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Rejected Column */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Rejected</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {rejectedRequests.map((request) => (
                    <Card key={request.id} className="border-2 border-red-200 dark:border-red-800 hover:border-red-400 transition-colors">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{request.itemCode}</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            {request.id}
                          </Badge>
                        </div>
                        <p className="text-sm">{request.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>From: {request.from}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.created}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Section - Manager Only */}
      {userRole === 'manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items Below Reorder Point Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Items Below Reorder Point</CardTitle>
              <p className="text-sm text-muted-foreground">
                Critical stock levels requiring attention
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reorderPointData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="item" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#ef4444" name="Current Stock" />
                  <Bar dataKey="reorderPoint" fill="#f97316" name="Reorder Point" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Total Stock Value Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Total Stock Value</CardTitle>
              <p className="text-sm text-muted-foreground">
                Inventory value trend over time (in thousands)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Value (K)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* PR vs GRN Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>PR vs GRN Trend</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comparison of Purchase Requests and Goods Received Notes
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prVsGrnData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pr" fill="#3b82f6" name="Purchase Requests" />
                  <Bar dataKey="grn" fill="#10b981" name="Goods Received" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory Overview Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory Overview</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search items..." 
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Batch No</TableHead>
                  <TableHead>Project / Site</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Track Progress</TableHead>
                  <TableHead>Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item.itemCode}>
                    <TableCell className="font-medium">{item.itemCode}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Select defaultValue={item.type}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Raw">
                              <InventoryTypeBadge type="Raw" />
                            </SelectItem>
                            <SelectItem value="Semi">
                              <InventoryTypeBadge type="Semi" />
                            </SelectItem>
                            <SelectItem value="Installation">
                              <InventoryTypeBadge type="Installation" />
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={item.unit}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="pcs">pcs</SelectItem>
                          <SelectItem value="LTR">LTR</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        defaultValue={item.currentStock}
                        className={`w-[100px] ${item.currentStock < item.reorderPoint ? 'text-red-600 font-medium' : ''}`}
                      />
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.batchNo}</TableCell>
                    <TableCell>{item.project}</TableCell>
                    <TableCell className="text-center">{item.reorderPoint}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm">
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to 5 of 5 entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create PR Modal */}
      <CreatePRModal 
        isOpen={showCreatePRModal}
        onClose={() => setShowCreatePRModal(false)}
      />

      {/* Receive Goods Modal */}
      <ReceiveGoodsModal 
        isOpen={showReceiveGoodsModal}
        onClose={() => setShowReceiveGoodsModal(false)}
      />
    </div>
  );
}
