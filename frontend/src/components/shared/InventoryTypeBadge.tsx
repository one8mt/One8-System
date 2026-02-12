import { Badge } from '../ui/badge';

export type InventoryItemType = 'Raw' | 'Semi' | 'Installation';

const TYPE_STYLES: Record<InventoryItemType, string> = {
  Raw: 'bg-orange-50 text-orange-700 border-orange-300',
  Semi: 'bg-blue-50 text-blue-700 border-blue-300',
  Installation: 'bg-purple-50 text-purple-700 border-purple-300',
};

interface InventoryTypeBadgeProps {
  type: InventoryItemType;
}

export function InventoryTypeBadge({ type }: InventoryTypeBadgeProps) {
  return (
    <Badge variant="outline" className={TYPE_STYLES[type]}>
      {type}
    </Badge>
  );
}
