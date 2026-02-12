import { Badge } from '../ui/badge';

export type InventoryStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

const STATUS_STYLES: Record<InventoryStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  flagged: {
    label: 'Flagged',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

interface InventoryStatusBadgeProps {
  status: InventoryStatus;
}

export function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
  const config = STATUS_STYLES[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
