import { Badge } from '../ui/badge';

export type StatusColor = 'green' | 'yellow' | 'red' | 'blue';

const COLOR_CLASSES: Record<StatusColor, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
};

interface CrmStatusBadgeProps {
  status: string;
  color: StatusColor;
}

export function CrmStatusBadge({ status, color }: CrmStatusBadgeProps) {
  return (
    <Badge variant="outline" className={COLOR_CLASSES[color] || 'bg-gray-100 text-gray-700'}>
      {status}
    </Badge>
  );
}
