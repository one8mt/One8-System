"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Star,
  Clock,
  User,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { chartColors, getTooltipStyle, getAxisStyle } from "../ChartColors";
import { HealthStatusBadge } from "../shared/HealthStatusBadge";
import { KpiCards } from "../shared/KpiCards";

interface ProfitImpactProps {
  userRole: "employee" | "manager";
}

const clientsOverviewData = [
  {
    id: 1,
    name: "AlMajd Co.",
    type: "Project",
    createdDate: "Sep 20",
    lastInvoice: "SAR 15,500",
    satisfaction: 4.9,
    complaints: 1,
    status: "Healthy",
    profitChange: 25,
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
    profitChange: 10,
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
    profitChange: 5,
  },
];

const profitKpiData = [
  { title: "Total Adjusted Profit", value: "SAR 1.2M", change: "+18%", trend: "up", icon: DollarSign },
  { title: "Profit Lost Due to Returns", value: "SAR 45K", change: "-8%", trend: "down", icon: TrendingDown },
  { title: "Average CSAT", value: "4.2", change: "+0.3", trend: "up", icon: Star },
  { title: "Active Profit Alerts", value: "12", change: "+3", trend: "up", icon: AlertTriangle },
];

const profitAlerts = [
  { id: 1, message: "Client AlOlayan refund reduced profit by 12%", severity: "high", icon: "🔴" },
  { id: 2, message: "Mix B product profitability dropped below margin threshold", severity: "medium", icon: "⚠️" },
  { id: 3, message: "Client AlMajd satisfaction improved → profit +3%", severity: "low", icon: "🟢" },
];

const scatterData = [
  { satisfaction: 4.9, profit: 25, client: "AlMajd Co.", color: "#22c55e", region: "Central", category: "Project" },
  { satisfaction: 4.5, profit: 22, client: "TechCorp Ltd", color: "#22c55e", region: "Eastern", category: "Technology" },
  { satisfaction: 4.2, profit: 18, client: "Arabia Solutions", color: "#22c55e", region: "Western", category: "Services" },
  { satisfaction: 3.8, profit: 15, client: "AlTameer", color: "#eab308", region: "Central", category: "Construction" },
  { satisfaction: 3.5, profit: 12, client: "GulfCo", color: "#eab308", region: "Eastern", category: "Trading" },
  { satisfaction: 3.0, profit: 8, client: "Desert Innovations", color: "#eab308", region: "Northern", category: "Innovation" },
  { satisfaction: 2.4, profit: 10, client: "AlOtayan", color: "#ef4444", region: "Western", category: "Distribution" },
  { satisfaction: 2.1, profit: 5, client: "Riyadh Trading", color: "#ef4444", region: "Central", category: "Trading" },
  { satisfaction: 1.8, profit: 3, client: "City Ventures", color: "#ef4444", region: "Eastern", category: "Real Estate" },
];

const thresholds = {
  satisfaction: 3.5,
  profit: 12,
};

const classifyClient = (satisfaction: number, profit: number) => {
  const highSat = satisfaction >= thresholds.satisfaction;
  const highProfit = profit >= thresholds.profit;

  if (highSat && highProfit) {
    return {
      category: "Top Performer",
      recommendation: "Maintain excellence through regular engagement and loyalty programs",
    };
  } else if (highSat && !highProfit) {
    return {
      category: "Growth Opportunity",
      recommendation: "Upsell premium services or increase volume to boost profitability",
    };
  } else if (!highSat && highProfit) {
    return {
      category: "Risk Zone",
      recommendation: "Immediate action required - improve service quality to prevent churn",
    };
  } else {
    return {
      category: "Critical",
      recommendation: "Priority intervention - address issues and consider relationship review",
    };
  }
};

const miniKpis = [
  { title: "Profit Margin after Returns", value: "32%", change: "+2%", icon: DollarSign },
  { title: "Return Rate %", value: "8%", change: "-1%", icon: TrendingDown },
  { title: "Net Profit Adjusted", value: "SAR 980K", change: "+12%", icon: TrendingUp },
  { title: "Avg CSAT vs Profit", value: "4.2", change: "+0.5", icon: Star },
  { title: "Avg Resolution Time", value: "2.3 days", change: "-0.5", icon: Clock },
];

const recentProfitUpdates = [
  { id: 1, date: "Nov 15, 2025", client: "AlMajd Co.", product: "Mix A", change: "+3%", reason: "Improved Feedback", trend: "up" },
  { id: 2, date: "Nov 14, 2025", client: "AlOtayan", product: "Product B", change: "-12%", reason: "Refund Issued", trend: "down" },
  { id: 3, date: "Nov 13, 2025", client: "TechCorp Ltd", product: "Service Package", change: "+5%", reason: "Issue Resolved", trend: "up" },
  { id: 4, date: "Nov 12, 2025", client: "GulfCo", product: "Mix C", change: "-2%", reason: "Delayed Delivery", trend: "down" },
  { id: 5, date: "Nov 11, 2025", client: "Arabia Solutions", product: "Product A", change: "+8%", reason: "Positive Review", trend: "up" },
];

export function ProfitImpact({ userRole }: ProfitImpactProps) {
  const getHealthStatus = (status: string) =>
    (["Healthy", "At Risk", "Monitor"].includes(status) ? status : "Monitor") as
      | "Healthy"
      | "At Risk"
      | "Monitor";

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
      default:
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
    }
  };

  const [showTrendline, setShowTrendline] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const filteredData = scatterData.filter((item) => {
    if (selectedRegion !== "all" && item.region !== selectedRegion) return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    return true;
  });

  const calculateTrendline = () => {
    if (!showTrendline || filteredData.length < 2) return null;

    const n = filteredData.length;
    const sumX = filteredData.reduce((sum, d) => sum + d.satisfaction, 0);
    const sumY = filteredData.reduce((sum, d) => sum + d.profit, 0);
    const sumXY = filteredData.reduce((sum, d) => sum + d.satisfaction * d.profit, 0);
    const sumXX = filteredData.reduce((sum, d) => sum + d.satisfaction * d.satisfaction, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return [
      { satisfaction: 0, profit: intercept },
      { satisfaction: 5, profit: slope * 5 + intercept },
    ];
  };

  const trendlineData = calculateTrendline();

  return (
    <div className="space-y-6">
      {/* Main Overview Table - REUSED from Objective Feedback */}
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
                      <HealthStatusBadge status={getHealthStatus(client.status)} />
                    </div>
                    <div className="text-center min-w-[120px]">
                      <p className="text-xs text-muted-foreground mb-1">Adjusted Profit</p>
                      <div className="space-y-1">
                        <Progress value={client.profitChange} className="h-2 [&>div]:bg-green-500" />
                        <p className="text-sm font-medium">+{client.profitChange}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profit KPI Cards */}
      <KpiCards
        items={profitKpiData.map((kpi) => ({
          title: kpi.title,
          value: kpi.value,
          change: kpi.change,
          icon: kpi.icon,
          changeTone: kpi.trend === "up" ? "positive" : "negative",
        }))}
      />

      {/* Notifications Section - Profit Alerts */}
      <div className="space-y-3">
        {profitAlerts.map((alert) => (
          <div key={alert.id} className={`border rounded-lg p-4 ${getAlertStyle(alert.severity)}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">{alert.icon}</span>
              <p className="text-sm">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scatter Chart - Profit vs Satisfaction */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profit vs Satisfaction</CardTitle>
              <p className="text-sm text-muted-foreground">
                Relationship between customer satisfaction and adjusted profit percentage
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-background"
              >
                <option value="all">All Time</option>
                <option value="q4">Q4 2025</option>
                <option value="q3">Q3 2025</option>
                <option value="q2">Q2 2025</option>
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-background"
              >
                <option value="all">All Regions</option>
                <option value="Central">Central</option>
                <option value="Eastern">Eastern</option>
                <option value="Western">Western</option>
                <option value="Northern">Northern</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-background"
              >
                <option value="all">All Categories</option>
                <option value="Project">Project</option>
                <option value="Technology">Technology</option>
                <option value="Services">Services</option>
                <option value="Construction">Construction</option>
                <option value="Trading">Trading</option>
                <option value="Distribution">Distribution</option>
              </select>

              <Button
                variant={showTrendline ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTrendline(!showTrendline)}
              >
                Trendline
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="satisfaction"
                  name="Satisfaction"
                  domain={[0, 5]}
                  {...getAxisStyle()}
                  label={{ value: "Satisfaction Score", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="profit"
                  name="Profit %"
                  {...getAxisStyle()}
                  label={{ value: "Adjusted Profit (%)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={getTooltipStyle()}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const classification = classifyClient(data.satisfaction, data.profit);

                      if (userRole === "manager") {
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
                            <p className="font-medium mb-1">{data.client}</p>
                            <p className="text-sm text-muted-foreground">Satisfaction: {data.satisfaction}</p>
                            <p className="text-sm text-muted-foreground">Profit: +{data.profit}%</p>
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-sm font-medium">
                                Classification: {classification.category}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                💡 {classification.recommendation}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{data.client}</p>
                          <p className="text-sm text-muted-foreground">Satisfaction: {data.satisfaction}</p>
                          <p className="text-sm text-muted-foreground">Profit: +{data.profit}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={filteredData} fill={chartColors.primary}>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>

                <ReferenceLine x={thresholds.satisfaction} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" opacity={0.5} />
                <ReferenceLine y={thresholds.profit} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" opacity={0.5} />

                {showTrendline && trendlineData && (
                  <Scatter data={trendlineData} line={{ stroke: "hsl(var(--primary))", strokeWidth: 2 }} shape={() => null} />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mini KPIs Row */}
      <KpiCards
        items={miniKpis.map((kpi) => ({
          title: kpi.title,
          value: kpi.value,
          change: kpi.change,
          icon: kpi.icon,
          changeTone: kpi.change.startsWith("+") ? "positive" : kpi.change.startsWith("-") ? "negative" : "neutral",
        }))}
        size="compact"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
      />

      {/* Recent Profit Updates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Profit Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 pb-3 border-b mb-3">
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="text-sm text-muted-foreground">Client</div>
            <div className="text-sm text-muted-foreground">Product</div>
            <div className="text-sm text-muted-foreground">Change</div>
            <div className="text-sm text-muted-foreground">Reason</div>
          </div>

          <div className="space-y-3">
            {recentProfitUpdates.map((update) => (
              <div key={update.id} className="grid grid-cols-5 gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-sm font-medium">{update.date}</div>
                <div className="text-sm font-medium">{update.client}</div>
                <div className="text-sm font-medium">{update.product}</div>
                <div className="flex items-center gap-1">
                  {update.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <p className={`text-sm font-medium ${update.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {update.change}
                  </p>
                </div>
                <div className="text-sm font-medium">{update.reason}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
