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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, FileText, Clock, CheckCircle, XCircle, Search, Upload, Download, Edit, TrendingUp, Factory, Package, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { TransferStockModal } from './modals/TransferStockModal';
import { IssueToProductionModal } from './modals/IssueToProductionModal';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Progress } from '../ui/progress';
import { KpiCards } from '../shared/KpiCards';
import { InventoryStatusBadge } from '../shared/InventoryStatusBadge';
import { StatusIcon } from '../shared/StatusIcon';
import { InventoryTypeBadge } from '../shared/InventoryTypeBadge';

interface IssueToProductionProps {
  userRole: 'employee' | 'manager';
}

const issueKpiData = [
  { title: 'Total Issues Created', value: '93', change: '+12%', icon: FileText },
  { title: 'Pending Material Requests', value: '8', change: '-8%', icon: Clock },
  { title: 'Production Lines Active', value: '6.2 hrs Avg', change: '+5%', icon: Factory },
  { title: 'Completed Issues', value: '28', change: '+15%', icon: CheckCircle },
];

const transferKpiData = [
  { title: 'Total Transfers Created', value: '67', change: '+14%', icon: FileText },
  { title: 'Pending Transfers', value: '12', change: '+5%', icon: Clock },
  { title: 'Completed Transfers', value: '55', change: '+18%', icon: CheckCircle },
  { title: 'Average Transfer Time', value: '2.8 hrs', change: '-8%', icon: Clock },
];

const managerKpiData = [
  { title: 'Total Items in Stock', value: '1,247', change: '+8%', icon: Package },
  { title: 'Pending Requests', value: '18', change: '+3%', icon: Clock },
  { title: 'Approved Requests This Week', value: '42', change: '+15%', icon: CheckCircle },
  { title: 'Rejected Requests This Week', value: '5', change: '-12%', icon: XCircle },
];

const overviewData = [
  { id: 'RG-001', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 20' },
  { id: 'PR-001', title: 'Office supplies', status: 'pending', created: 'Sep 20' },
  { id: 'ITP-001', title: 'Product D', status: 'rejected', created: 'Sep 20' },
  { id: 'TO-001', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 20' },
];

const issueListData = [
  { id: 'ITP-001', title: 'Product D', status: 'pending', created: 'Sep 20' },
  { id: 'ITP-002', title: 'Product X', status: 'approved', created: 'Sep 21' },
  { id: 'ITP-003', title: 'Product Y', status: 'rejected', created: 'Sep 22' },
  { id: 'ITP-004', title: 'Product B', status: 'approved', created: 'Sep 23' },
];

const transferListData = [
  { id: 'TO-001', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 20' },
  { id: 'TO-002', title: 'Office Furniture Goods', status: 'pending', created: 'Sep 21' },
  { id: 'TO-003', title: 'Office Furniture Goods', status: 'rejected', created: 'Sep 22' },
  { id: 'TO-004', title: 'Office Furniture Goods', status: 'approved', created: 'Sep 23' },
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

// Analytics Chart Data for Manager
const topRequestedItemsData = [
  { name: 'Steel Beams', value: 145 },
  { name: 'Copper Wire', value: 98 },
  { name: 'Plastic Resin', value: 87 },
  { name: 'Paint White', value: 65 },
  { name: 'Others', value: 125 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const stockValueData = [
  { month: 'Jul', value: 285 },
  { month: 'Aug', value: 312 },
  { month: 'Sep', value: 298 },
  { month: 'Oct', value: 335 },
  { month: 'Nov', value: 358 },
];

const issueStatusData = [
  { name: 'In Process', value: 42 },
  { name: 'Completed', value: 68 },
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

export function IssueToProduction({ userRole }: IssueToProductionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('issue-to-production');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

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
              {overviewData.map((item) => (
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
      {userRole === 'employee' && activeTab === 'issue-to-production' && (
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Factory className="h-5 w-5 text-green-600" />
            <p className="text-green-900 dark:text-green-100">
              <span className="font-semibold">7 items</span> needed in production line1
            </p>
          </div>
          <Button 
            size="sm"
            className="gap-2 bg-black text-white hover:bg-black/90"
            onClick={() => setShowIssueModal(true)}
          >
            <Plus className="h-4 w-4" />
            Create Issue
          </Button>
        </div>
      )}

      {userRole === 'employee' && activeTab === 'transfer-stock' && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-900 dark:text-yellow-100">
              You have <span className="font-semibold">2 items</span> need to transfer
            </p>
          </div>
          <Button 
            size="sm"
            className="gap-2 bg-black text-white hover:bg-black/90"
            onClick={() => setShowTransferModal(true)}
          >
            <Plus className="h-4 w-4" />
            Transfer Item
          </Button>
        </div>
      )}

      {/* KPI Cards Section */}
      <div>
        <h3 className="mb-4 text-muted-foreground">A quick overview of today's key inventory alerts</h3>
        <KpiCards
          items={
            userRole === 'manager'
              ? managerKpiData
              : activeTab === 'issue-to-production'
                ? issueKpiData
                : transferKpiData
          }
        />
      </div>

      {/* Tabs Section */}
      {userRole === 'employee' && (
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="issue-to-production" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b px-6 pt-6">
                <TabsList className="h-auto p-0 bg-transparent border-0">
                  <TabsTrigger 
                    value="issue-to-production" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                  >
                    Issue to Production
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transfer-stock" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                  >
                    Transfer Stock
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="issue-to-production" className="p-6 mt-0">
                {/* Total Issues List */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Total Receipts</h3>
                  <p className="text-sm text-muted-foreground mb-4">Track material receipts and inspection progress</p>
                  <div className="space-y-2">
                    {issueListData.map((issue) => (
                      <div key={issue.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={getStatusKey(issue.status)} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{issue.id}</span>
                              <span className="text-muted-foreground">—</span>
                              <span className="text-sm">{issue.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Created: {issue.created}</p>
                          </div>
                        </div>
                          <InventoryStatusBadge status={getStatusKey(issue.status)} />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="transfer-stock" className="p-6 mt-0">
                {/* Transfer Stock List */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Total Receipts</h3>
                  <p className="text-sm text-muted-foreground mb-4">Track material receipts and inspection progress</p>
                  <div className="space-y-2">
                    {transferListData.map((transfer) => (
                      <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={getStatusKey(transfer.status)} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{transfer.id}</span>
                              <span className="text-muted-foreground">—</span>
                              <span className="text-sm">{transfer.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Created: {transfer.created}</p>
                          </div>
                        </div>
                          <InventoryStatusBadge status={getStatusKey(transfer.status)} />
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
                    <Card key={request.id} className="border-2 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{request.itemCode}</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics of ITP and TO</CardTitle>
              <p className="text-sm text-muted-foreground">
                Analysis of production operations and stock transfers
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Requested Items Pie Chart */}
                <div>
                  <h3 className="font-medium mb-4">Top Requested Items</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={topRequestedItemsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topRequestedItemsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Stock Value Line Chart */}
                <div>
                  <h3 className="font-medium mb-4">Total Stock Value</h3>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Issue Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Production Issue Status Overview</CardTitle>
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
                      <span className="text-muted-foreground">42 issues</span>
                    </div>
                    <Progress value={38} className="h-2 [&>div]:bg-yellow-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Completed
                      </span>
                      <span className="text-muted-foreground">68 issues</span>
                    </div>
                    <Progress value={62} className="h-2 [&>div]:bg-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-semibold mb-1 text-green-600">62%</p>
                    <p className="text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </div>
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

      {/* Issue to Production Modal */}
      <IssueToProductionModal isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} />

      {/* Transfer Stock Modal */}
      <TransferStockModal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} />
    </div>
  );
}
