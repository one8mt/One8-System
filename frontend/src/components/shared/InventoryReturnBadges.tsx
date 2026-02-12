import { Badge } from '../ui/badge';

export type InventoryReturnType = 'Refund' | 'Missing' | 'Damage' | 'Exchange';
export type InventoryReturnMode = 'Full' | 'Partial';

const RETURN_TYPE_STYLES: Record<InventoryReturnType, string> = {
  Refund: 'bg-blue-50 text-blue-700 border-blue-300',
  Missing: 'bg-orange-50 text-orange-700 border-orange-300',
  Damage: 'bg-red-50 text-red-700 border-red-300',
  Exchange: 'bg-purple-50 text-purple-700 border-purple-300',
};

const RETURN_MODE_STYLES: Record<InventoryReturnMode, string> = {
  Full: 'bg-green-50 text-green-700 border-green-300',
  Partial: 'bg-amber-50 text-amber-700 border-amber-300',
};

interface InventoryReturnTypeBadgeProps {
  type: InventoryReturnType;
}

interface InventoryReturnModeBadgeProps {
  mode: InventoryReturnMode;
}

export function InventoryReturnTypeBadge({ type }: InventoryReturnTypeBadgeProps) {
  return (
    <Badge variant="outline" className={RETURN_TYPE_STYLES[type]}>
      {type}
    </Badge>
  );
}

export function InventoryReturnModeBadge({ mode }: InventoryReturnModeBadgeProps) {
  return (
    <Badge variant="outline" className={RETURN_MODE_STYLES[mode]}>
      {mode}
    </Badge>
  );
}
