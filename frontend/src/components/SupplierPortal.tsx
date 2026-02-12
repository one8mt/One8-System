import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MessageCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { SupplierRFQResponseModal } from './supplier/SupplierRFQResponseModal';

// Mock supplier data
const supplierData = {
  name: 'TechCorp Supplies Ltd',
  logo: '🏭',
  email: 'contact@techcorpsupplies.com',
  phone: '+966 50 987 6543',
  location: 'Riyadh, Saudi Arabia',
  memberSince: 'June 2022',
};

// Mock alerts data
const supplierAlerts = [
  {
    id: 1,
    type: 'new',
    icon: AlertCircle,
    title: 'New RFQ Received',
    description: 'RFQ-2025-005 - Network Infrastructure - Action required',
    variant: 'default' as const,
  },
  {
    id: 2,
    type: 'revision',
    icon: TrendingUp,
    title: 'Revision Requested',
    description: 'RFQ-2025-002 - Please update pricing and delivery timeline',
    variant: 'default' as const,
  },
];

// Mock RFQ data
const rfqData = [
  {
    id: 'RFQ-2025-005',
    category: 'Network Infrastructure',
    deliveryLocation: 'Riyadh Office',
    deadline: '2025-01-15',
    status: 'New',
    statusColor: 'blue' as const,
    items: [
      { code: 'NET-001', name: 'Network Switches', qty: 10 },
      { code: 'NET-002', name: 'Cat6 Cables (100m)', qty: 50 },
    ],
    requirements: 'All equipment must be certified and include 2-year warranty',
    terms: 'Net 30 payment terms',
  },
  {
    id: 'RFQ-2025-004',
    category: 'Office Supplies',
    deliveryLocation: 'Jeddah Branch',
    deadline: '2025-01-10',
    status: 'Awaiting Response',
    statusColor: 'yellow' as const,
    items: [
      { code: 'OFF-012', name: 'Office Chairs', qty: 25 },
      { code: 'OFF-013', name: 'Desks', qty: 25 },
    ],
    requirements: 'Ergonomic design required',
    terms: 'Net 45 payment terms',
  },
  {
    id: 'RFQ-2025-002',
    category: 'IT Equipment',
    deliveryLocation: 'Dammam Office',
    deadline: '2024-12-28',
    status: 'Revision Requested',
    statusColor: 'orange' as const,
    items: [
      { code: 'IT-045', name: 'Laptops - Dell XPS', qty: 15 },
      { code: 'IT-046', name: 'Docking Stations', qty: 15 },
    ],
    requirements: 'Latest generation processors required',
    terms: 'Net 30 payment terms',
  },
  {
    id: 'RFQ-2025-001',
    category: 'Security Systems',
    deliveryLocation: 'Riyadh HQ',
    deadline: '2024-12-20',
    status: 'Quote Submitted',
    statusColor: 'green' as const,
    items: [
      { code: 'SEC-021', name: 'CCTV Cameras', qty: 20 },
      { code: 'SEC-022', name: 'NVR System', qty: 2 },
    ],
    requirements: '4K resolution minimum',
    terms: 'Net 30 payment terms',
  },
];

export function SupplierPortal() {
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleViewRFQ = (rfqId: string) => {
    setSelectedRFQ(rfqId);
    setIsModalOpen(true);
  };

  const getStatusBadgeClass = (color: string) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    };
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
  };

  // Filter RFQs based on active tab
  const filteredRFQs = activeTab === 'all' 
    ? rfqData 
    : rfqData.filter(rfq => rfq.status.toLowerCase().replace(' ', '-') === activeTab);

  const selectedRFQData = rfqData.find(rfq => rfq.id === selectedRFQ);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Supplier Information Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-6xl">{supplierData.logo}</div>
              <div>
                <h1 className="text-2xl mb-2">{supplierData.name}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{supplierData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{supplierData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{supplierData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member Since: {supplierData.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Alerts Section - Using system alert design */}
      {supplierAlerts.length > 0 && (
        <div className="space-y-3">
          {supplierAlerts.map((alert) => {
            const IconComponent = alert.icon;
            const bgColor = 'bg-blue-50 dark:bg-blue-950';
            const borderColor = 'border-blue-200 dark:border-blue-800';
            const iconColor = 'text-blue-600';
            const textColor = 'text-blue-900 dark:text-blue-100';
            
            return (
              <div 
                key={alert.id} 
                className={`p-4 ${bgColor} rounded-lg border ${borderColor} flex justify-between items-center`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${iconColor}`} />
                  <p className={textColor}>
                    {alert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RFQ List Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Request for Quotations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Tabs Navigation */}
          <div className="border-b px-6 pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto p-0 bg-transparent border-0">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="new" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                >
                  New
                </TabsTrigger>
                <TabsTrigger 
                  value="awaiting-response" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                >
                  Awaiting Response
                </TabsTrigger>
                <TabsTrigger 
                  value="revision-requested" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                >
                  Revision Requested
                </TabsTrigger>
                <TabsTrigger 
                  value="quote-submitted" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                >
                  Quote Submitted
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFQ ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Delivery Location</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRFQs.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="font-medium">{rfq.id}</TableCell>
                    <TableCell>{rfq.category}</TableCell>
                    <TableCell>{rfq.deliveryLocation}</TableCell>
                    <TableCell>{rfq.deadline}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClass(rfq.statusColor)}>
                        {rfq.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => handleViewRFQ(rfq.id)}
                        variant={rfq.status === 'New' || rfq.status === 'Awaiting Response' ? 'default' : 'outline'}
                      >
                        {rfq.status === 'Quote Submitted' ? 'View' : 'Respond'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* RFQ Response Modal */}
      {selectedRFQData && (
        <SupplierRFQResponseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRFQ(null);
          }}
          rfqData={selectedRFQData}
        />
      )}
    </div>
  );
}
