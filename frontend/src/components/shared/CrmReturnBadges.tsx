import { Badge } from '../ui/badge';

export type CrmReturnType = 'Refund' | 'Missing' | 'Damage' | 'Exchange';
export type CrmReturnMode = 'Full' | 'Partial';

const RETURN_TYPE_STYLES: Record<CrmReturnType, string> = {
  Refund:
    'rounded-full px-3 py-1 text-sm font-semibold bg-white text-blue-700 border-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.15)] dark:bg-white dark:text-blue-700 dark:border-blue-400',
  Missing:
    'rounded-full px-3 py-1 text-sm font-semibold bg-white text-orange-700 border-orange-400 shadow-[0_0_0_1px_rgba(249,115,22,0.15)] dark:bg-white dark:text-orange-700 dark:border-orange-400',
  Damage:
    'rounded-full px-3 py-1 text-sm font-semibold bg-white text-red-700 border-red-400 shadow-[0_0_0_1px_rgba(239,68,68,0.15)] dark:bg-white dark:text-red-700 dark:border-red-400',
  Exchange:
    'rounded-full px-3 py-1 text-sm font-semibold bg-white text-purple-700 border-purple-400 shadow-[0_0_0_1px_rgba(168,85,247,0.15)] dark:bg-white dark:text-purple-700 dark:border-purple-400',
};

const RETURN_MODE_STYLES: Record<CrmReturnMode, string> = {
  Full:
    'rounded-full px-3 py-1 text-sm font-semibold bg-white text-emerald-700 border-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] dark:bg-white dark:text-emerald-700 dark:border-emerald-400',
  Partial:
    'rounded-full px-3 py-1 text-sm font-semibold bg-white text-amber-700 border-amber-400 shadow-[0_0_0_1px_rgba(245,158,11,0.15)] dark:bg-white dark:text-amber-700 dark:border-amber-400',
};

interface CrmReturnTypeBadgeProps {
  type: CrmReturnType;
}

interface CrmReturnModeBadgeProps {
  mode: CrmReturnMode;
}

export function CrmReturnTypeBadge({ type }: CrmReturnTypeBadgeProps) {
  return (
    <Badge variant="outline" className={RETURN_TYPE_STYLES[type]}>
      {type}
    </Badge>
  );
}

export function CrmReturnModeBadge({ mode }: CrmReturnModeBadgeProps) {
  return (
    <Badge variant="outline" className={RETURN_MODE_STYLES[mode]}>
      {mode}
    </Badge>
  );
}
