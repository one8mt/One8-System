import { useState } from 'react';
import { PurchaseRequisitions } from './procurement/PurchaseRequisitions';
import { RequestsForQuotation } from './procurement/RequestsForQuotation';
import { PurchaseOrders } from './procurement/PurchaseOrders';
import { ProcurementTimeline } from './procurement/ProcurementTimeline';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, FileText, MessageSquare, ShoppingCart, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface ProcurementDashboardProps {
  activeSubsection: string;
  setActiveSubsection: (subsection: string) => void;
  userRole: 'employee' | 'manager';
}

const subsectionData = [
  {
    id: 'Purchase Requisitions',
    title: 'Purchase Requisitions',
    shortTitle: 'PR',
    description: 'Create and manage purchase requests',
    icon: FileText,
    stats: { total: 45, pending: 12, approved: 28, rejected: 5 },
    color: 'blue'
  },
  {
    id: 'Requests for Quotation',
    title: 'Requests for Quotation', 
    shortTitle: 'RFQ',
    description: 'Send RFQs and compare supplier quotes',
    icon: MessageSquare,
    stats: { total: 32, active: 7, completed: 21, pending: 4 },
    color: 'green'
  },
  {
    id: 'Purchase Orders',
    title: 'Purchase Orders',
    shortTitle: 'PO',
    description: 'Manage purchase orders and deliveries',
    icon: ShoppingCart,
    stats: { total: 60, active: 15, delivered: 42, cancelled: 3 },
    color: 'purple'
  }
];

export function ProcurementDashboard({ activeSubsection, setActiveSubsection, userRole }: ProcurementDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);

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
          <h1 className="mb-2">Procurement Dashboard</h1>
          <p className="text-muted-foreground">
            {userRole === 'manager' 
              ? 'Monitor and manage procurement processes across your organization' 
              : 'Track your procurement requests and submit new ones'
            }
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
        {subsectionData.map((section) => {
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
                      {section.id === 'Purchase Requisitions' ? section.stats.pending :
                       section.id === 'Requests for Quotation' ? section.stats.active :
                       section.stats.active}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {section.id === 'Purchase Requisitions' ? 'Pending' :
                       section.id === 'Requests for Quotation' ? 'Active' :
                       'Active'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Procurement Timeline - Manager View Only */}
      {userRole === 'manager' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Procurement Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track all procurement requests through their lifecycle stages
            </p>
          </CardHeader>
          <CardContent>
            <ProcurementTimeline />
          </CardContent>
        </Card>
      )}

      {/* Active Subsection Content */}
      <div className="space-y-6">
        {activeSubsection === 'Purchase Requisitions' && (
          <PurchaseRequisitions 
            userRole={userRole} 
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        )}

        {activeSubsection === 'Requests for Quotation' && (
          <RequestsForQuotation 
            userRole={userRole}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        )}

        {activeSubsection === 'Purchase Orders' && (
          <PurchaseOrders 
            userRole={userRole}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        )}
      </div>
    </div>
  );
}
