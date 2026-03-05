import { Badge } from '../ui/badge';

export type RequestStatus = 'Approved' | 'Flagged' | 'Pending' | 'New';

const STATUS_STYLES = {
    normal: {
        Approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Flagged: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        New: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    force: {
        Approved: '!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-200',
        Flagged: '!bg-red-100 !text-red-800 dark:!bg-red-900 dark:!text-red-200',
        Pending: '!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-200',
        New: '!bg-blue-100 !text-blue-800 dark:!bg-blue-900 dark:!text-blue-200',
    },
} as const;

interface NewCrmStatusBadgeProps {
    status: RequestStatus;
    force?: boolean;
}

export function NewCrmStatusBadge({ status, force = false }: NewCrmStatusBadgeProps) {
    const styles = force ? STATUS_STYLES.force : STATUS_STYLES.normal;
    const styleClass = styles[status] || styles.Pending;

    return (
        <Badge variant="secondary" className={`${styleClass} font-medium`}>
            {status}
        </Badge>
    );
}
