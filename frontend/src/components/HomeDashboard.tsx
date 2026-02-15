import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { KpiCards } from './shared/KpiCards';
import { chartColors, getTooltipStyle, getAxisStyle } from './ChartColors';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Pie, 
  Cell, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';

interface HomeDashboardProps {
  userRole: 'employee' | 'manager';
}

export function HomeDashboard({ userRole }: HomeDashboardProps) {
  // Mock data for dashboard overview
  const overviewStats = [
    {
      title: 'Total Orders',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Total Spend',
      value: '$1.2M',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Suppliers',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Cost Savings',
      value: '$84K',
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const recentActivity = [
    { type: 'PR', id: 'PR-2024-0156', status: 'Approved', amount: '$12,500', time: '2 hours ago' },
    { type: 'RFQ', id: 'RFQ-2024-0089', status: 'Pending', amount: '$8,200', time: '4 hours ago' },
    { type: 'PO', id: 'PO-2024-0234', status: 'Completed', amount: '$15,800', time: '6 hours ago' },
    { type: 'PR', id: 'PR-2024-0157', status: 'Rejected', amount: '$3,400', time: '8 hours ago' },
    { type: 'RFQ', id: 'RFQ-2024-0090', status: 'Approved', amount: '$9,600', time: '1 day ago' }
  ];

  const monthlySpend = [
    { month: 'Jan', amount: 95000 },
    { month: 'Feb', amount: 87000 },
    { month: 'Mar', amount: 105000 },
    { month: 'Apr', amount: 92000 },
    { month: 'May', amount: 110000 },
    { month: 'Jun', amount: 120000 }
  ];

  const statusDistribution = [
    { name: 'Completed', value: 45, color: chartColors.secondary },
    { name: 'In Progress', value: 30, color: chartColors.primary },
    { name: 'Pending', value: 15, color: chartColors.tertiary },
    { name: 'Rejected', value: 10, color: chartColors.quaternary }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2">
          Welcome back, {userRole === 'manager' ? 'Manager' : 'Ahmed'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your procurement processes today.
        </p>
      </div>

      {/* Overview Stats */}
      <KpiCards
        items={overviewStats.map((stat) => ({
          title: stat.title,
          value: stat.value,
          change: stat.change,
          icon: stat.icon,
          changeTone: stat.change.startsWith("+") ? "positive" : stat.change.startsWith("-") ? "negative" : "neutral",
        }))}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spend Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spend Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySpend}>
                  <XAxis 
                    dataKey="month" 
                    {...getAxisStyle()}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    {...getAxisStyle()}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Spend Amount']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={getTooltipStyle()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Process Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={getTooltipStyle()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{activity.type}</Badge>
                    <span className="font-medium">{activity.id}</span>
                  </div>
                  <Badge className={getStatusColor(activity.status)} variant="secondary">
                    {activity.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="font-medium">{activity.amount}</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="p-6 h-auto flex flex-col items-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Create Purchase Requisition</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex flex-col items-center space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Request For Quotation</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex flex-col items-center space-y-2">
              <CheckCircle className="h-6 w-6" />
              <span>Create Purchase Order</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
