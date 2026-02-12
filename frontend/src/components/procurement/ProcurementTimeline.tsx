import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  FileText, 
  MessageSquare, 
  ShoppingCart, 
  CheckCircle,
  Clock,
  Package,
  TruckIcon,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const timelineData = [
  {
    id: 'RFQ-001',
    title: 'Office Furniture Request',
    amount: 'SAR 15,500',
    progress: 50,
    createdDate: '2025-09-20',
    status: 'in-progress',
    currentStage: 'RFQ',
    deliveryStatus: null
  },
  {
    id: 'RFQ-002',
    title: 'IT Equipment Procurement',
    amount: 'SAR 42,800',
    progress: 75,
    createdDate: '2025-09-18',
    status: 'in-progress',
    currentStage: 'PO Created',
    deliveryStatus: 'partial'
  },
  {
    id: 'PO-003',
    title: 'Marketing Materials',
    amount: 'SAR 8,200',
    progress: 100,
    createdDate: '2025-09-15',
    status: 'completed',
    currentStage: 'Completed',
    deliveryStatus: null
  },
  {
    id: 'RFQ-004',
    title: 'Software Licenses',
    amount: 'SAR 28,900',
    progress: 60,
    createdDate: '2025-09-22',
    status: 'qa-hold',
    currentStage: 'QA Hold',
    deliveryStatus: 'qa-hold'
  },
  {
    id: 'RFQ-005',
    title: 'Maintenance Services',
    amount: 'SAR 5,600',
    progress: 80,
    createdDate: '2025-09-21',
    status: 'delayed',
    currentStage: 'PO',
    deliveryStatus: null
  }
];

const getStageIcon = (stage: string) => {
  switch (stage) {
    case 'PR':
      return <FileText className="h-4 w-4" />;
    case 'RFQ':
      return <MessageSquare className="h-4 w-4" />;
    case 'PO':
    case 'PO Created':
      return <ShoppingCart className="h-4 w-4" />;
    case 'Partial Delivery':
      return <Package className="h-4 w-4" />;
    case 'Completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'QA Hold':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string, stage: string, deliveryStatus: string | null) => {
  if (stage === 'Completed') {
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
      <CheckCircle className="h-3 w-3 mr-1" />
      Completed
    </Badge>;
  }
  
  switch (status) {
    case 'in-progress':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
    case 'delayed':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Delayed
      </Badge>;
    case 'qa-hold':
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
        <XCircle className="h-3 w-3 mr-1" />
        QA Hold
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getDeliveryStatusBadge = (deliveryStatus: string | null) => {
  switch (deliveryStatus) {
    case 'partial':
      return <Badge variant="outline" className="text-yellow-700 border-yellow-700 flex items-center gap-1">
        <Package className="h-3 w-3" />
        Partial
      </Badge>;
    case 'complete':
      return <Badge variant="outline" className="text-green-700 border-green-700 flex items-center gap-1">
        <TruckIcon className="h-3 w-3" />
        Complete
      </Badge>;
    case 'delayed':
      return <Badge variant="outline" className="text-orange-700 border-orange-700 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Delayed
      </Badge>;
    default:
      return null;
  }
};

export function ProcurementTimeline() {
  return (
    <div className="space-y-3">
      {timelineData.map((item) => (
        <Card key={item.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Request Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                  {getStageIcon(item.currentStage)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{item.id}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Created: {new Date(item.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>{item.amount}</span>
                  </div>
                </div>
              </div>

              {/* Right Section - Status and Progress */}
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="flex justify-end items-center mb-1">
                    <span className="text-xs font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status, item.currentStage, item.deliveryStatus)}
                  {getDeliveryStatusBadge(item.deliveryStatus)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
