import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, Package, Clock, XCircle, TrendingDown } from 'lucide-react';

interface NotificationBannerProps {
  userRole: 'employee' | 'manager';
  onCreatePR?: () => void;
  onViewDelays?: () => void;
  section?: 'pr' | 'rfq' | 'po';
}

export function NotificationBanner({ userRole, onCreatePR, onViewDelays, section }: NotificationBannerProps) {
  // Employee-only notifications
  const employeeNotifications = [
    {
      type: 'critical',
      title: 'Critical Stock Alert',
      description: '3 items are below reorder point',
      icon: AlertTriangle,
      action: 'Create PR',
      actionHandler: onCreatePR,
      sections: ['pr'] // Only show in PR section
    },
    {
      type: 'info',
      title: 'RFQ Request from PR',
      description: 'You have an RFQ request coming from the PR that needs to choose suppliers',
      icon: Package,
      action: 'Choose Suppliers',
      actionHandler: () => {},
      sections: ['rfq'] // Only show in RFQ section
    },
    {
      type: 'warning',
      title: 'Revision Needed',
      description: 'Revision needed for RFQ-2025-003, the request came back from the manager because it needs to be modified',
      icon: TrendingDown,
      action: 'Edit RFQ',
      actionHandler: () => {},
      sections: ['rfq'] // Only show in RFQ section
    },
    {
      type: 'info',
      title: 'Returned PR Request',
      description: 'Manager returned the PR Request because there are notes',
      icon: TrendingDown,
      action: 'Review',
      actionHandler: () => {},
      sections: ['pr'] // Show in PR and PO sections
    }
  ];

  // Manager-only notifications
  const managerNotifications = [
    {
      type: 'warning',
      title: 'Supplier Delay',
      description: '2 purchase orders delayed by 5+ days',
      icon: Clock,
      action: 'View Details',
      actionHandler: onViewDelays,
      sections: ['po'] // Only show in PO section
    }
  ];

  // Shared notifications
  const sharedNotifications = [
    {
      type: 'info',
      title: 'Incoming Goods',
      description: userRole === 'manager' 
        ? '8 purchase orders arriving this week' 
        : '2 of your orders arriving this week',
      icon: Package,
      action: 'Track',
      actionHandler: () => {}
    }
  ];

  // Filter notifications by section
  const filteredEmployeeNotifications = employeeNotifications.filter(
    n => !section || n.sections?.includes(section)
  );

  const filteredManagerNotifications = managerNotifications.filter(
    n => !section || n.sections?.includes(section)
  );

  const allNotifications = userRole === 'manager' 
    ? [...filteredManagerNotifications, ...sharedNotifications]
    : [...filteredEmployeeNotifications, ...sharedNotifications];

  const getAlertVariant = (type: string): 'default' | 'destructive' => {
    return type === 'critical' ? 'destructive' : 'default';
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 dark:border-red-800';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950';
      case 'info':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950';
      default:
        return '';
    }
  };

  if (allNotifications.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {allNotifications.slice(0, 2).map((notification, index) => {
        const Icon = notification.icon;
        
        // Determine colors based on notification type
        const bgColor = notification.type === 'critical' 
          ? 'bg-red-50 dark:bg-red-950' 
          : notification.type === 'warning'
          ? 'bg-yellow-50 dark:bg-yellow-950'
          : 'bg-blue-50 dark:bg-blue-950';
          
        const borderColor = notification.type === 'critical'
          ? 'border-red-200 dark:border-red-800'
          : notification.type === 'warning'
          ? 'border-yellow-200 dark:border-yellow-800'
          : 'border-blue-200 dark:border-blue-800';
          
        const iconColor = notification.type === 'critical'
          ? 'text-red-600'
          : notification.type === 'warning'
          ? 'text-yellow-600'
          : 'text-blue-600';
          
        const textColor = notification.type === 'critical'
          ? 'text-red-900 dark:text-red-100'
          : notification.type === 'warning'
          ? 'text-yellow-900 dark:text-yellow-100'
          : 'text-blue-900 dark:text-blue-100';
        
        return (
          <div 
            key={index} 
            className={`p-4 ${bgColor} rounded-lg border ${borderColor} flex justify-between items-center`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <p className={textColor}>
                {notification.description}
              </p>
            </div>
            {notification.action && (
              <Button 
                size="sm" 
                variant={notification.type === 'critical' ? 'default' : 'outline'}
                onClick={notification.actionHandler}
                className="gap-2"
              >
                {notification.action}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
