import { Badge } from '../ui/badge';

export type HealthStatus = 'Healthy' | 'At Risk' | 'Monitor';

const HEALTH_STYLES = {
  normal: {
    Healthy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'At Risk': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Monitor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  force: {
    Healthy: '!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-200',
    'At Risk': '!bg-red-100 !text-red-800 dark:!bg-red-900 dark:!text-red-200',
    Monitor: '!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-200',
  },
} as const;

interface HealthStatusBadgeProps {
  status: HealthStatus;
  force?: boolean;
}

export function HealthStatusBadge({ status, force = false }: HealthStatusBadgeProps) {
  const classes = force ? HEALTH_STYLES.force : HEALTH_STYLES.normal;
  return <Badge className={classes[status]}>{status}</Badge>;
}
