"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
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
  Star,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  User,
} from "lucide-react";
import { chartColors, getTooltipStyle, getAxisStyle } from "../ChartColors";
import { ClientFeedbackModal } from "./modals/ClientFeedbackModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { KpiCards } from "../shared/KpiCards";
import { HealthStatusBadge } from "../shared/HealthStatusBadge";
import { FeedbackStatusBadge } from "../shared/FeedbackStatusBadge";

interface ObjectiveFeedbackProps {
  userRole: "employee" | "manager" | "client";
}

const statusData = [
  { name: "Positive", value: 122, color: "#22c55e" },
  { name: "Neutral", value: 21, color: "#eab308" },
  { name: "Negative", value: 13, color: "#ef4444" },
];

const feedbackByProductData = [
  { product: "Product A", feedback: 56 },
  { product: "Product B", feedback: 47 },
  { product: "Product C", feedback: 31 },
  { product: "Product D", feedback: 22 },
];

const satisfactionTrendData = [
  { month: "Jan", score: 3.8 },
  { month: "Feb", score: 3.9 },
  { month: "Mar", score: 4.0 },
  { month: "Apr", score: 4.1 },
  { month: "May", score: 4.2 },
  { month: "Jun", score: 4.2 },
];

const managerKpiData = [
  { title: "Avg CSAT Score", value: "4.2", change: "+0.3", icon: Star },
  { title: "Low Ratings %", value: "8%", change: "-2%", icon: ThumbsDown, changeTone: "negative" as const },
  { title: "Total Feedback Received", value: "156", change: "+24", icon: CheckCircle2 },
  { title: "Positive Feedback Rate", value: "78%", change: "+5%", icon: ThumbsUp },
];

const clientsOverviewData = [
  {
    id: 1,
    name: "AlMajd Co.",
    type: "Project",
    createdDate: "Sep 20",
    lastInvoice: "SAR 15,500",
    satisfaction: 4.9,
    amount: "SAR 15,500",
    complaints: 1,
    status: "Healthy",
    progress: 25,
  },
  {
    id: 2,
    name: "AlOtayan",
    type: "Distributor",
    createdDate: "Sep 20",
    lastInvoice: "SAR 15,500",
    satisfaction: 2.4,
    complaints: 3,
    status: "At Risk",
    progress: 10,
  },
  {
    id: 3,
    name: "AlTameer",
    type: "Contractor",
    createdDate: "Sep 20",
    lastInvoice: "SAR 15,500",
    satisfaction: 3.8,
    complaints: 1,
    status: "Monitor",
    progress: 5,
  },
];

const recentFeedbackLogs = [
  { id: "FB-001", clientName: "TechCorp Ltd", status: "Resolved", rating: 5, date: "2025-09-20", submittedBy: "Ahmed" },
  { id: "FB-002", clientName: "Arabia Solutions", status: "Resolved", rating: 4, date: "2025-09-19", submittedBy: "Sara" },
  { id: "FB-003", clientName: "GulfCo", status: "Resolved", rating: 2, date: "2025-09-18", submittedBy: "Mohammed " },
  { id: "FB-004", clientName: "Desert Innovations", status: "Pending", rating: 3, date: "2025-09-17", submittedBy: "Fatima" },
  { id: "FB-005", clientName: "Riyadh Trading Co", status: "Resolved", rating: 5, date: "2025-09-16", submittedBy: "Khalid" },
];

export function ObjectiveFeedback({ userRole }: ObjectiveFeedbackProps) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleNewFeedback = () => {
    setSelectedFeedback({
      clientName: "TechCorp Solutions",
      product: "",
      clientType: "VIP",
      date: new Date().toISOString().split("T")[0],
      rating: 0,
      feedbackType: "Positive",
      notes: "",
    });
    setIsEditMode(false);
    setFeedbackModalOpen(true);
  };

  const handleEditFeedback = (feedback: any) => {
    setSelectedFeedback({
      id: feedback.id,
      clientName: feedback.clientName,
      product: "Network Switch",
      clientType: "VIP",
      date: feedback.date,
      rating: feedback.rating,
      feedbackType: feedback.rating >= 4 ? "Positive" : feedback.rating >= 3 ? "Neutral" : "Negative",
      notes: "Sample feedback notes",
    });
    setIsEditMode(true);
    setFeedbackModalOpen(true);
  };

  const getHealthStatus = (status: string) =>
    (["Healthy", "At Risk", "Monitor"].includes(status) ? status : "Monitor") as
      | "Healthy"
      | "At Risk"
      | "Monitor";

  const getFeedbackStatus = (status: string) =>
    (["Resolved", "Pending"].includes(status) ? status : "Pending") as "Resolved" | "Pending";

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview - Client List with Metrics */}
      {userRole !== "client" && (
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientsOverviewData.map((client) => (
                <div key={client.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {client.name} <span className="text-muted-foreground">•</span>{" "}
                          <span className="text-sm text-muted-foreground">{client.type}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {client.createdDate} <span>•</span> {client.lastInvoice}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center min-w-[100px]">
                        <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                        <p className="text-sm font-medium">
                          {client.satisfaction}
                          <span className="text-yellow-400">★</span>
                        </p>
                      </div>
                      <div className="text-center min-w-[100px]">
                        <p className="text-xs text-muted-foreground mb-1">Complaints</p>
                        <p className="text-sm font-medium">{client.complaints}</p>
                      </div>
                      <div className="text-center min-w-[100px]">
                        <p className="text-xs text-muted-foreground mb-1">Statuses</p>
                        <HealthStatusBadge status={getHealthStatus(client.status)} force />
                      </div>
                      <div className="text-center min-w-[120px]">
                        <p className="text-xs text-muted-foreground mb-1">Adjusted Profit</p>
                        <div className="flex items-center gap-2 justify-center">
                          <Progress value={client.progress} className="w-16 h-1.5" />
                          <span className="text-xs font-medium">{client.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Table - Client View Only - BEFORE Alert Banner */}
      {userRole === "client" && (
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientsOverviewData.map((client) => (
                <div key={client.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {client.name} <span className="text-muted-foreground">•</span>{" "}
                          <span className="text-sm text-muted-foreground">{client.type}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {client.createdDate} • {client.lastInvoice}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right min-w-[80px]">
                        <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                        <p className="font-medium">
                          {client.satisfaction}
                          <span className="text-yellow-400">★</span>
                        </p>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-xs text-muted-foreground mb-1">Complaints</p>
                        <p className="font-medium">{client.complaints}</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-muted-foreground mb-1">Statuses</p>
                        <HealthStatusBadge status={getHealthStatus(client.status)} force />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <p className="text-sm">
            Feedback <span className="font-medium">FB-003</span> (Client:{" "}
            <span className="font-medium">GulfCo</span>) has been resolved.
          </p>
        </div>
      </div>

      {/* KPI Cards - Manager Only */}
      {userRole !== "client" && (
        <KpiCards items={managerKpiData} />
      )}

      {/* Charts - Manager Only */}
      {userRole !== "client" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Type Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Feedback by Product */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feedbackByProductData}>
                      <XAxis dataKey="product" {...getAxisStyle()} />
                      <YAxis {...getAxisStyle()} />
                      <Tooltip contentStyle={getTooltipStyle()} />
                      <Bar dataKey="feedback" fill={chartColors.primary} radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Satisfaction Trend - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Trend (CSAT)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={satisfactionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" {...getAxisStyle()} />
                    <YAxis domain={[0, 5]} {...getAxisStyle()} />
                    <Tooltip contentStyle={getTooltipStyle()} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={chartColors.primary}
                      strokeWidth={2}
                      name="CSAT Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Process Status - Client Health Summary */}
      {userRole !== "client" && (
        <Card>
          <CardHeader>
            <CardTitle>Client Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Healthy
                    </span>
                    <span className="text-muted-foreground">3 clients</span>
                  </div>
                  <Progress value={60} className="h-2 [&>div]:bg-green-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      Monitor
                    </span>
                    <span className="text-muted-foreground">1 client</span>
                  </div>
                  <Progress value={20} className="h-2 [&>div]:bg-yellow-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      At Risk
                    </span>
                    <span className="text-muted-foreground">1 client</span>
                  </div>
                  <Progress value={20} className="h-2 [&>div]:bg-red-500" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-semibold mb-1 text-green-600">78%</p>
                  <p className="text-muted-foreground">Positive Feedback Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Feedback Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{userRole === "client" ? "Your Feedback" : "Recent Feedback Logs"}</CardTitle>
            {userRole === "client" && <Button onClick={handleNewFeedback}>New Feedback</Button>}
          </div>
        </CardHeader>
        <CardContent>
          {userRole === "client" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Client</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Satisfaction</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFeedbackLogs.map((feedback) => (
                    <TableRow
                      key={feedback.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleEditFeedback(feedback)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{feedback.clientName}</p>
                            <p className="text-sm text-muted-foreground">
                              {feedback.id} • Project
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created: {feedback.date.split("-")[1]} {feedback.date.split("-")[2]}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="font-medium">SAR {(feedback.rating * 3000).toLocaleString()}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="font-medium">{feedback.rating}.0★</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <FeedbackStatusBadge status={getFeedbackStatus(feedback.status)} force />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedbackLogs.map((feedback) => (
                <div key={feedback.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{feedback.id}</p>
                        <p className="text-sm text-muted-foreground">{feedback.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">{renderStars(feedback.rating)}</div>
                      <FeedbackStatusBadge status={getFeedbackStatus(feedback.status)} force />
                      <p className="text-sm text-muted-foreground">{feedback.date}</p>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Submitted by</p>
                        <p className="text-sm font-medium">{feedback.submittedBy}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Feedback Modal */}
      {feedbackModalOpen && selectedFeedback && (
        <ClientFeedbackModal
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          feedbackData={selectedFeedback}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}
