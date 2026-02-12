import { Badge } from './ui/badge';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

interface InventoryBadgeProps {
  available: number;
  incoming: number;
  rop: number; // Reorder Point
  size?: 'sm' | 'md';
}

export function InventoryBadge({ available, incoming, rop, size = 'md' }: InventoryBadgeProps) {
  const getStockStatus = () => {
    if (available >= rop * 1.5) return 'sufficient';
    if (available >= rop) return 'low';
    return 'critical';
  };

  const status = getStockStatus();
  
  const statusConfig = {
    sufficient: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Package },
    low: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: TrendingUp },
    critical: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: AlertTriangle }
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-1.5 ${size === 'sm' ? 'flex-wrap' : 'flex-row'}`}>
      <Badge className={`${config.color} ${textSize} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        <span>Avl: {available}</span>
      </Badge>
      {incoming > 0 && (
        <Badge variant="outline" className={`${textSize}`}>
          Inc: {incoming}
        </Badge>
      )}
      <Badge variant="outline" className={`${textSize}`}>
        ROP: {rop}
      </Badge>
    </div>
  );
}
