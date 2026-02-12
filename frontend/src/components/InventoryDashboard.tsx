import { PurchaseRequest } from './inventory/PurchaseRequest';
import { IssueToProduction } from './inventory/IssueToProduction';
import { ReturnsOverview } from './inventory/ReturnsOverview';
import { InventoryTimeline } from './inventory/InventoryTimeline';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, FileText, Package, TrendingUp, Clock, CheckCircle, RotateCcw } from 'lucide-react';

interface InventoryDashboardProps {
  activeSubsection: string;
  setActiveSubsection: (subsection: string) => void;
  userRole: 'employee' | 'manager';
}

const subsectionData = [
  {
    id: 'Purchase Request',
    title: 'Procurement Operations',
    shortTitle: 'Procurement Operations',
    description: 'Manage purchase requests and received goods',
    icon: FileText,
    stats: { total: 45, pending: 12 },
    color: 'blue'
  },
  {
    id: 'Issue to Production',
    title: 'Production Operations', 
    shortTitle: 'Production Operations',
    description: 'Handle material issuance and stock transfers',
    icon: Package,
    stats: { total: 32, active: 7 },
    color: 'green'
  },
  {
    id: 'Returns',
    title: 'Returns ',
    shortTitle: 'Returns',
    description: 'Track return requests and inventory checks',
    icon: RotateCcw,
    stats: { total: 24, pending: 8 },
    color: 'purple'
  }
];

export function InventoryDashboard({ activeSubsection, setActiveSubsection, userRole }: InventoryDashboardProps) {
  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = isActive ? 'ring-2 ring-offset-2' : 'hover:shadow-md';
    
    switch (color) {
      case 'blue':
        return `${baseClasses} ${isActive ? 'ring-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800' : 'border-border'}`;
      case 'green':
        return `${baseClasses} ${isActive ? 'ring-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' : 'border-border'}`;
      case 'purple':
        return `${baseClasses} ${isActive ? 'ring-purple-500 border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800' : 'border-border'}`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Inventory Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage stock transactions, material receipts, and inventory operations
          </p>
        </div>
        
        {/* {userRole === 'employee' && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Request
          </Button>
        )} */}
      </div>

      {/* Subsection Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subsectionData
          .filter(section => userRole === 'manager' || section.id !== 'Returns')
          .map((section) => {
          const isActive = activeSubsection === section.id;
          const IconComponent = section.icon;
          
          return (
            <Card 
              key={section.id} 
              className={`cursor-pointer transition-all duration-200 ${getColorClasses(section.color, isActive)}`}
              onClick={() => setActiveSubsection(section.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      section.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' :
                      section.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{section.shortTitle}</h3>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  {isActive && (
                    <Badge className="bg-primary text-primary-foreground">Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="font-medium">{section.stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="font-medium">
                      {section.id === 'Purchase Request' ? section.stats.pending : section.id === 'Issue to Production' ? section.stats.active : section.stats.pending}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {section.id === 'Purchase Request' || section.id === 'Returns' ? 'Pending' : 'Active'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inventory Timeline - Manager View Only */}
      {userRole === 'manager' && activeSubsection !== 'Returns' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track material receipts and inspection progress
            </p>
          </CardHeader>
          <CardContent>
            <InventoryTimeline />
          </CardContent>
        </Card>
      )}

      {/* Active Subsection Content */}
      <div className="space-y-6">
        {activeSubsection === 'Purchase Request' && (
          <PurchaseRequest 
            userRole={userRole} 
          />
        )}

        {activeSubsection === 'Issue to Production' && (
          <IssueToProduction 
            userRole={userRole}
          />
        )}

        {activeSubsection === 'Returns' && (
          <ReturnsOverview 
            userRole={userRole}
          />
        )}
      </div>
    </div>
  );
}
