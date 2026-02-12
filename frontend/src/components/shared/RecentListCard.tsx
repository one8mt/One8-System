import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface RecentListCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function RecentListCard({ title, action, children }: RecentListCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
