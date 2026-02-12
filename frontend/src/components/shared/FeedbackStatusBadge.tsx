import { Badge } from '../ui/badge';

export type FeedbackStatus = 'Resolved' | 'Pending';

const FEEDBACK_STYLES = {
  normal: {
    Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  force: {
    Resolved: '!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-200',
    Pending: '!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-200',
  },
} as const;

interface FeedbackStatusBadgeProps {
  status: FeedbackStatus;
  force?: boolean;
}

export function FeedbackStatusBadge({ status, force = false }: FeedbackStatusBadgeProps) {
  const classes = force ? FEEDBACK_STYLES.force : FEEDBACK_STYLES.normal;
  return <Badge className={classes[status]}>{status}</Badge>;
}
