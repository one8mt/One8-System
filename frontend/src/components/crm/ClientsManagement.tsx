"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Users,
  TrendingUp,
  UserCheck,
  Target,
  User,
  AlertTriangle,
} from "lucide-react";
import { chartColors, getTooltipStyle, getAxisStyle } from "../ChartColors";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { KpiCards } from "../shared/KpiCards";
import { CrmStatusBadge } from "../shared/CrmStatusBadge";

interface ClientsManagementProps {
  userRole: "manager" | "client";
  onClientSelect?: (clientId: number) => void;
}

const kpiData = [
  { title: "Total Clients", value: "247", change: "+12", icon: Users },
  { title: "New Clients (This Month)", value: "18", change: "+5", icon: UserCheck },
  { title: "Retention Rate", value: "94%", change: "+2%", icon: Target },
  { title: "Active Clients", value: "231", change: "+8", icon: TrendingUp },
];

const clientTypeData = [
  { name: "Distributor", value: 98, color: "#3b82f6" },
  { name: "Company", value: 124, color: "#8b5cf6" },
  { name: "Individual", value: 25, color: "#ec4899" },
];

const clientsByRegionData = [
  { region: "Riyadh", clients: 89 },
  { region: "Jeddah", clients: 67 },
  { region: "Dammam", clients: 42 },
  { region: "Mecca", clients: 28 },
  { region: "Medina", clients: 21 },
];

const clientGrowthData = [
  { month: "Jan", growth: 3.2 },
  { month: "Feb", growth: 4.1 },
  { month: "Mar", growth: 3.8 },
  { month: "Apr", growth: 5.2 },
  { month: "May", growth: 4.7 },
  { month: "Jun", growth: 6.1 },
];

const clientsData = [
  {
    id: 1,
    name: "TechCorp Solutions.",
    projectId: "FB004",
    logo: "🏢",
    type: "Project",
    tags: ["VIP", "Enterprise"],
    totalRevenue: "SAR 850,000",
    amount: "SAR 15,500",
    created: "Sep 20",
    invoiceDetails: "Invoice: INV-2024-1132 | Type: Damage | Full",
    lastOrder: "2 days ago",
    status: "Resolved",
    statusColor: "green",
    satisfaction: "4.5",
    complaints: "5",
    progress: 25,
    progressLabel: "Adjusted Profit",
  },
  {
    id: 2,
    name: "Metro Items",
    projectId: "RET002",
    logo: "🏗️",
    type: "Distributor",
    tags: ["New"],
    totalRevenue: "SAR 125,000",
    amount: "SAR 1,250.00",
    created: "Sep 20",
    invoiceDetails: "Invoice: INV-2024-1132 | Type: Damage | Full",
    lastOrder: "1 week ago",
    status: "Pending",
    statusColor: "yellow",
    satisfaction: "2.4",
    complaints: "1",
    progress: 65,
    progressLabel: "Return Progress",
  },
  {
    id: 3,
    name: "Building Items",
    projectId: "RET001",
    logo: "🌍",
    type: "Company",
    tags: ["VIP"],
    totalRevenue: "SAR 520,000",
    amount: "SAR 1,254.00",
    created: "Sep 12",
    invoiceDetails: "Invoice: INV-2024-1135 | Type: Exchange | Full",
    lastOrder: "3 days ago",
    status: "Critical",
    statusColor: "red",
    satisfaction: "2.4",
    complaints: "2",
    progress: 80,
    progressLabel: "Return Progress",
  },
  {
    id: 4,
    name: "AlMajd Co.",
    projectId: "FB004",
    logo: "📦",
    type: "Distributor",
    tags: ["Active"],
    totalRevenue: "SAR 320,000",
    amount: "SAR 15,500",
    created: "Sep 20",
    invoiceDetails: "Contractor",
    lastOrder: "5 days ago",
    status: "Monitor",
    statusColor: "yellow",
    satisfaction: "3.8",
    complaints: "1",
    progress: 5,
    progressLabel: "Adjusted Profit",
  },
];

export function ClientsManagement({ userRole, onClientSelect }: ClientsManagementProps) {
  const [notifications] = useState([
    { id: 1, message: "New client SmartBuild added by Ahmed", timestamp: "5 min ago", type: "info" },
  ]);

  const getStatusColor = (color: string) =>
    (["green", "yellow", "red"].includes(color) ? color : "green") as "green" | "yellow" | "red";

  // Manager view
  if (userRole === "manager") {
    return (
      <div className="space-y-6">
        {/* KPI Cards - Matching Procurement/Inventory Design */}
        <KpiCards items={kpiData} />

        {/* Alerts Section - Matching Procurement/Inventory Design */}
        {notifications.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start justify-between">
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <span className="text-xs text-muted-foreground ml-4">{notification.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clients Grid Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientsData.map((client) => (
              <Card
                key={client.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary"
                onClick={() => onClientSelect && onClientSelect(client.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{client.logo}</div>
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2">{client.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {client.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant={tag === "VIP" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Revenue:</span>
                    <span className="font-medium">{client.totalRevenue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Order:</span>
                    <span className="font-medium">{client.lastOrder}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <CrmStatusBadge status={client.status} color={getStatusColor(client.statusColor)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Analytics Charts - Updated Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Client Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={clientTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {clientTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Clients by Region */}
          <Card>
            <CardHeader>
              <CardTitle>Clients by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={clientsByRegionData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" />
                  <XAxis dataKey="region" {...getAxisStyle()} tick={{ fontSize: 11 }} />
                  <YAxis {...getAxisStyle()} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={getTooltipStyle()} />
                  <Bar dataKey="clients" fill={chartColors.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Client Growth Over Time - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Client Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={clientGrowthData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" />
                <XAxis dataKey="month" {...getAxisStyle()} tick={{ fontSize: 11 }} />
                <YAxis {...getAxisStyle()} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={getTooltipStyle()} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke={chartColors.secondary}
                  strokeWidth={2}
                  dot={{ fill: chartColors.secondary, r: 4 }}
                  name="Growth %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Client Portal view - Table format
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Satisfaction</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsData.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onClientSelect && onClientSelect(client.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.projectId} • Project
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created: {client.created} • {client.invoiceDetails}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium">{client.amount}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium">{client.satisfaction}★</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <CrmStatusBadge status={client.status} color={getStatusColor(client.statusColor)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{client.progressLabel}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${client.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium min-w-[35px]">+{client.progress}%</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
