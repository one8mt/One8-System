import { Badge } from '../ui/badge';

export type RequestStatus = 'Approved' | 'Flagged' | 'Pending';

const STATUS_STYLES = {
  normal: {
    Approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Flagged: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  force: {
    Approved: '!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-200',
    Flagged: '!bg-red-100 !text-red-800 dark:!bg-red-900 dark:!text-red-200',
    Pending: '!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-200',
  },
} as const;

interface RequestStatusBadgeProps {
  status: RequestStatus;
  force?: boolean;
}

export function RequestStatusBadge({ status, force = false }: RequestStatusBadgeProps) {
  const classes = force ? STATUS_STYLES.force : STATUS_STYLES.normal;
  return <Badge className={classes[status]}>{status}</Badge>;
}
