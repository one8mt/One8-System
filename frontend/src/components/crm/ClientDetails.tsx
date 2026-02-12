"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  DollarSign,
  ShoppingCart,
  Clock,
  RefreshCcw,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CrmStatusBadge } from "../shared/CrmStatusBadge";

interface ClientDetailsProps {
  clientId: number;
  onBack: () => void;
}

// Mock client data
const clientData = {
  1: {
    name: "TechCorp Solutions",
    logo: "🏢",
    email: "contact@techcorp.sa",
    phone: "+966 50 123 4567",
    location: "Riyadh, Saudi Arabia",
    memberSince: "Jan 2023",
    tags: ["VIP", "Enterprise"],
    totalRevenue: "SAR 850,000",
    totalOrders: "156",
    avgOrderValue: "SAR 5,450",
    lastOrderDate: "2 days ago",
    contactPerson: "Ahmed Alsaad",
    contactEmail: "ahmed@techcorp.sa",
    contactPhone: "+966 50 123 4567",
    paymentTerms: "Net 30",
    creditLimit: "SAR 100,000",
    address: "123 King Fahd Road, Al Olaya District, Riyadh 12211, Saudi Arabia",
  },
  2: {
    name: "CAMCO",
    logo: "🏗️",
    email: "info@smartbuild.sa",
    phone: "+966 50 234 5678",
    location: "Jeddah, Saudi Arabia",
    memberSince: "Mar 2024",
    tags: ["New"],
    totalRevenue: "SAR 125,000",
    totalOrders: "24",
    avgOrderValue: "SAR 5,200",
    lastOrderDate: "1 week ago",
    contactPerson: "Sara Mohammed",
    contactEmail: "sara@smartbuild.sa",
    contactPhone: "+966 50 234 5678",
    paymentTerms: "Net 15",
    creditLimit: "SAR 50,000",
    address: "456 Madinah Road, Al Hamra District, Jeddah 21442, Saudi Arabia",
  },
};

const activityTimelineData = [
  {
    id: 1,
    type: "feedback",
    icon: MessageCircle,
    title: "Positive Feedback – Network Switch",
    description: "Client provided excellent rating for product quality",
    status: "Resolved",
    statusColor: "green",
    date: "2 days ago",
  },
  {
    id: 2,
    type: "exchange",
    icon: RefreshCcw,
    title: "Exchange Request – Network Switch",
    description: "Requested exchange for different model",
    status: "Approved",
    statusColor: "blue",
    date: "5 days ago",
  },
  {
    id: 3,
    type: "order",
    icon: ShoppingCart,
    title: "New Order Placed",
    description: "Order #PO-2547 for SAR 45,000",
    status: "Completed",
    statusColor: "green",
    date: "1 week ago",
  },
  {
    id: 4,
    type: "feedback",
    icon: MessageCircle,
    title: "Product Inquiry",
    description: "Asked about bulk pricing for routers",
    status: "Pending",
    statusColor: "yellow",
    date: "2 weeks ago",
  },
];

const invoicesData = [
  { id: "INV-2547", date: "2024-12-05", dueDate: "2024-12-20", amount: "SAR 45,000", status: "Paid" },
  { id: "INV-2489", date: "2024-11-28", dueDate: "2024-12-13", amount: "SAR 32,500", status: "Paid" },
  { id: "INV-2401", date: "2024-11-15", dueDate: "2024-11-30", amount: "SAR 28,900", status: "Overdue" },
  { id: "INV-2325", date: "2024-11-02", dueDate: "2024-11-17", amount: "SAR 51,200", status: "Paid" },
];

export function ClientDetails({ clientId, onBack }: ClientDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Get client data or use fallback
  const client = clientData[clientId as keyof typeof clientData] || clientData[1];

  const getStatusColor = (color: string) =>
    (["green", "yellow", "red", "blue"].includes(color) ? color : "green") as
      | "green"
      | "yellow"
      | "red"
      | "blue";

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Button>

      {/* Client Header - No Card */}
      <div className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{client.logo}</div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl">{client.name}</h1>
                <div className="flex gap-2">
                  {client.tags.map((tag, idx) => (
                    <Badge key={idx} variant={tag === "VIP" ? "default" : "secondary"}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{client.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member Since: {client.memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="whatsapp" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Contact Information and Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
                  <p className="font-medium">{client.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{client.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{client.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Terms</p>
                  <p className="font-medium">{client.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credit Limit</p>
                  <p className="font-medium">{client.creditLimit}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{client.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="!bg-green-50 !border-green-200 dark:!bg-green-950 dark:!border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-semibold">{client.totalRevenue}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="!bg-blue-50 !border-blue-200 dark:!bg-blue-950 dark:!border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-2xl font-semibold">{client.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="!bg-yellow-50 !border-yellow-200 dark:!bg-yellow-950 dark:!border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                    <p className="text-2xl font-semibold">{client.avgOrderValue}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="!bg-purple-50 !border-purple-200 dark:!bg-purple-950 dark:!border-purple-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Order Date</p>
                    <p className="text-2xl font-semibold">{client.lastOrderDate}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityTimelineData.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium mb-1">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <CrmStatusBadge status={activity.status} color={getStatusColor(activity.statusColor)} />
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-sm text-muted-foreground">
                        {activity.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === "Paid" ? "success" : "destructive"}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
