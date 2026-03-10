"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { IncidentKanban } from "./IncidentKanban";
import { ProjectLifeCycle } from "./ProjectLifeCycle";
import { Progress } from "../ui/progress";
import { DonutChart } from "../shared/DonutChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

// Incident Chart Data
const returnsByProductData = [
  { name: "Product A", value: 80, color: "#22c55e" },
  { name: "Product B", value: 30, color: "#ef4444" },
  { name: "Product C", value: 60, color: "#eab308" },
  { name: "Product D", value: 45, color: "#3b82f6" },
];

const refundReturns = Array(15).fill(0);
const exchangeReturns = Array(5).fill(0);
const damagedReturns = Array(8).fill(0);
const missingReturns = Array(3).fill(0);

const initialCards = [
  {
    id: "Project Life Cycle",
    description: "Manage project lifecycle stages and invoices",
    stats: { total: 0, pending: 0 },
    color: "purple",
    icon: RefreshCw,
  },
  {
    id: "Incident Requests",
    description: "Track incident requests and current status",
    stats: { total: 0, pending: 0 },
    color: "blue",
    icon: AlertTriangle,
  },
];

interface NewCRMDashboardProps {
  userRole: "employee" | "manager" | "client";
  incidentNotificationCount: number;
  incidentNotification: {
    invoiceNumber: string;
    itemsWithIncidents: number;
    submittedAt: string;
  } | null;
}

export function NewCRMDashboard({
  userRole,
  incidentNotificationCount,
  incidentNotification,
}: NewCRMDashboardProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [cards, setCards] = useState(initialCards);

  const [projectStats, setProjectStats] = useState({ total: 0, pending: 0, completed: 0, rejected: 0 });
  const [incidentStats, setIncidentStats] = useState({ total: 0, pending: 0, types: { Refund: 0, Exchange: 0, Damaged: 0, Missing: 0 } });

  useEffect(() => {
    // Fetch Projects
    fetch("http://127.0.0.1:8000/api/projects/")
      .then((res) => res.json())
      .then((data: any[]) => {
        let projectPendingCount = 0;
        let projectCompletedCount = 0;
        let projectRejectedCount = 0;

        let phasePending = 0;
        let phaseCompleted = 0;
        let phaseRejected = 0;

        data.forEach((p: any) => {
          const projectStages = p.stages || [];
          const groupedStages: Record<number, any[]> = {};
          projectStages.forEach((s: any) => {
            const phaseNum = s.phase_number || 1;
            if (!groupedStages[phaseNum]) groupedStages[phaseNum] = [];
            groupedStages[phaseNum].push(s);
          });

          const phaseKeys = Object.keys(groupedStages).map(Number).sort((a, b) => a - b);

          if (phaseKeys.length === 0) {
            projectPendingCount++;
            phasePending++;
          } else {
            const latestKey = phaseKeys[phaseKeys.length - 1];
            const latestPhase = groupedStages[latestKey];
            const lastStageInLatest = latestPhase[latestPhase.length - 1];
            const hasRejectedInLatest = latestPhase.some((s: any) => s.status === 'rejected');

            if (hasRejectedInLatest) projectRejectedCount++;
            else if (lastStageInLatest.status === 'completed') projectCompletedCount++;
            else projectPendingCount++;

            phaseKeys.forEach((key) => {
              const phase = groupedStages[key];
              const lastStage = phase[phase.length - 1];
              const hasRejected = phase.some((s: any) => s.status === 'rejected');

              if (hasRejected) phaseRejected++;
              else if (lastStage.status === 'completed') phaseCompleted++;
              else phasePending++;
            });
          }
        });

        const projectTotal = data.length;
        setProjectStats({
          total: projectTotal,
          pending: projectPendingCount,
          completed: projectCompletedCount,
          rejected: projectRejectedCount,
        });

        setCards((prev) =>
          prev.map((c) =>
            c.id === "Project Life Cycle"
              ? { ...c, stats: { total: projectTotal, pending: projectPendingCount } }
              : c
          )
        );

        (window as any).__CRM_PHASE_DISTRIBUTION__ = [
          { name: "Done", value: phaseCompleted, color: "#22c55e" },
          { name: "In Progress", value: phasePending, color: "#eab308" },
          { name: "Rejected", value: phaseRejected, color: "#ef4444" },
        ];
      })
      .catch((err) => console.error("Error fetching projects:", err));

    // Fetch Incidents
    fetch("http://127.0.0.1:8000/api/incidents/")
      .then((res) => res.json())
      .then((data: any[]) => {
        const total = data.length;
        const pending = data.filter((i: any) => i.status === "Pending").length;

        const types = { Refund: 0, Exchange: 0, Damaged: 0, Missing: 0 };
        data.forEach((incident: any) => {
          (incident.items || []).forEach((item: any) => {
            const type = item.incident_type as keyof typeof types;
            if (types[type] !== undefined) {
              types[type]++;
            }
          });
        });

        setIncidentStats({ total, pending, types });

        setCards((prev) =>
          prev.map((c) =>
            c.id === "Incident Requests"
              ? { ...c, stats: { total: total, pending: pending } }
              : c
          )
        );
      })
      .catch((err) => console.error("Error fetching incidents:", err));
  }, []);
  const incidentMeta = incidentNotification
    ? `${incidentNotification.invoiceNumber} · ${incidentNotification.itemsWithIncidents} item${incidentNotification.itemsWithIncidents === 1 ? "" : "s"}`
    : "";

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      {incidentNotificationCount > 0 && incidentNotification && (
        <button
          type="button"
          onClick={() => {
            setActiveCardId("Incident Requests");
            setTimeout(() => {
              const target = document.getElementById("incident-returns-requests");
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 0);
          }}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium">
                Incident request submitted • {incidentMeta}
              </p>
            </div>
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              View
            </span>
          </div>
        </button>
      )}

      <div>
        <h1 className="mb-2 text-2xl font-bold">CRM Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of incident requests and project lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isActive = activeCardId === card.id;
          return (
            <Card
              key={card.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isActive
                ? card.color === "blue"
                  ? "ring-2 ring-offset-2 ring-blue-500 !border-blue-200 !bg-blue-50 dark:!bg-blue-950 dark:!border-blue-800"
                  : "ring-2 ring-offset-2 ring-purple-500 !border-purple-200 !bg-purple-50 dark:!bg-purple-950 dark:!border-purple-800"
                : ""
                }`}
              onClick={() =>
                setActiveCardId((prev) => (prev === card.id ? null : card.id))
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${card.color === "blue"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                      : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                      }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{card.id}</h3>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="font-medium">{card.stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="font-medium">{card.stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeCardId === "Incident Requests" && (
        <IncidentKanban />
      )}

      {activeCardId === "Project Life Cycle" && (
        <ProjectLifeCycle />
      )}

      {activeCardId === null && (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Return Types</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { name: "Refund", value: incidentStats.types.Refund, color: "#22c55e" },
                    { name: "Exchange", value: incidentStats.types.Exchange, color: "#eab308" },
                    { name: "Damaged", value: incidentStats.types.Damaged, color: "#ef4444" },
                    { name: "Missing", value: incidentStats.types.Missing, color: "#3b82f6" },
                  ]}
                  className="h-64"
                  outerRadius={90}
                />
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                    <span>Refund</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                    <span>Exchange</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                    <span>Damaged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                    <span>Missing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Returns by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={returnsByProductData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={false} />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-lg">
                                <p className="text-sm font-medium">{payload[0].payload.name}</p>
                                <p className="text-sm text-muted-foreground">{payload[0].value} returns</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {returnsByProductData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Lifecycle Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        In Process
                      </span>
                      <span className="text-muted-foreground">{projectStats.pending} projects</span>
                    </div>
                    <Progress value={projectStats.total > 0 ? (projectStats.pending / projectStats.total) * 100 : 0} className="h-2 [&>div]:bg-yellow-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Completed
                      </span>
                      <span className="text-muted-foreground">{projectStats.completed} projects</span>
                    </div>
                    <Progress value={projectStats.total > 0 ? (projectStats.completed / projectStats.total) * 100 : 0} className="h-2 [&>div]:bg-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-semibold mb-1 text-green-600">
                      {projectStats.total > 0 ? Math.round((projectStats.completed / projectStats.total) * 100) : 0}%
                    </p>
                    <p className="text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
