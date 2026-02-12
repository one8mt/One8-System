import { CheckCircle, Clock, XCircle } from 'lucide-react';

export type ApprovalStatus = 'approved' | 'rejected' | 'pending';

interface StatusIconProps {
  status: ApprovalStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
}
