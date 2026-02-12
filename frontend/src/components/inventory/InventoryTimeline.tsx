import { Card, CardContent } from '../ui/card';
import { 
  FileText, 
  Package
} from 'lucide-react';
import { InventoryStatusBadge } from '../shared/InventoryStatusBadge';

const timelineData = [
  {
    id: 'PR-001',
    title: 'Office supplies',
    status: 'pending',
  },
  {
    id: 'RG-001',
    title: 'Office Furniture Goods',
    status: 'approved',
  },
  {
    id: 'ITP-001',
    title: 'Product D',
    status: 'rejected',
  },
  {
    id: 'TO-001',
    title: 'Office Furniture Goods',
    status: 'approved',
  }
];

const getStageIcon = (id: string) => {
  if (id.startsWith('PR')) {
    return <FileText className="h-4 w-4" />;
  }
  return <Package className="h-4 w-4" />;
};

const getStatusKey = (status: string) =>
  (['approved', 'rejected', 'pending'].includes(status) ? status : 'pending') as
    | 'approved'
    | 'rejected'
    | 'pending';

export function InventoryTimeline() {
  return (
    <div className="space-y-3">
      {timelineData.map((item) => (
        <Card key={item.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Request Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                  {getStageIcon(item.id)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{item.id}</span>
                    <span className="text-muted-foreground">—</span>
                    <span className="text-sm">{item.title}</span>
                  </div>
                </div>
              </div>

              {/* Right Section - Status */}
              <div className="flex items-center gap-4">
                <InventoryStatusBadge status={getStatusKey(item.status)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
