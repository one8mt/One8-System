import { Card, CardContent } from '../ui/card';

export type KpiItem = {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  changeTone?: 'positive' | 'negative' | 'neutral';
};

interface KpiCardsProps {
  items: KpiItem[];
  className?: string;
  size?: 'default' | 'compact';
}

export function KpiCards({ items, className, size = 'default' }: KpiCardsProps) {
  const contentPadding = size === 'compact' ? 'p-4' : 'p-6';
  const titleClass = size === 'compact' ? 'text-xs text-muted-foreground' : 'text-muted-foreground mb-1';
  const valueClass = size === 'compact' ? 'text-xl font-semibold' : 'text-2xl font-semibold';
  const iconSizeClass = size === 'compact' ? 'h-4 w-4' : 'h-8 w-8';
  const gridClass =
    className ?? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4';

  return (
    <div className={gridClass}>
      {items.map((kpi, index) => {
        const changeTone =
          kpi.changeTone ??
          (kpi.change.includes('+') ? 'positive' : kpi.change.includes('-') ? 'negative' : 'neutral');

        const cardToneClass =
          changeTone === 'positive'
            ? '!border-green-200 !bg-green-50/60 dark:!border-green-800/70 dark:!bg-green-950/40'
            : changeTone === 'negative'
              ? '!border-red-200 !bg-red-50/60 dark:!border-red-800/70 dark:!bg-red-950/40'
              : undefined;

        const textToneClass =
          changeTone === 'positive'
            ? 'text-green-600 dark:text-green-400'
            : changeTone === 'negative'
              ? 'text-red-600 dark:text-red-400'
              : 'text-muted-foreground';

        return (
        <Card
          key={index}
          className={cardToneClass}
        >
          <CardContent className={contentPadding}>
            <div className="flex items-center justify-between">
              <div>
                <p className={titleClass}>{kpi.title}</p>
                <p className={valueClass}>{kpi.value}</p>
                <p className={`text-sm ${textToneClass}`}>
                  {kpi.change} from last month
                </p>
              </div>
              <kpi.icon className={`${iconSizeClass} ${textToneClass}`} />
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}
