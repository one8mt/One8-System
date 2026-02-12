import { Badge } from '../ui/badge';

export type ProcurementStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'completed'
  | 'delivered'
  | 'cancelled'
  | 'qa-hold';

const STATUS_STYLES: Record<ProcurementStatus, { label: string; className: string }> = {
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
  active: {
    label: 'Active',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  'qa-hold': {
    label: 'QA Hold',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
};

interface ProcurementStatusBadgeProps {
  status: ProcurementStatus;
}

export function ProcurementStatusBadge({ status }: ProcurementStatusBadgeProps) {
  const config = STATUS_STYLES[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
