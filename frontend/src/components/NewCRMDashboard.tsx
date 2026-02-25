"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MessageCircle, AlertTriangle } from "lucide-react";
import { NewCrmFeedback } from "./crm/NewCrmFeedback";
import { IncidentReturnsRequests } from "./incident/IncidentReturnsRequests";

const cards = [
  {
    id: "Incident Requests",
    description: "Track incident requests and current status",
    stats: { total: 42, pending: 9 },
    color: "blue",
    icon: AlertTriangle,
  },
  {
    id: "Feedbacks",
    description: "Monitor feedback submissions and follow-ups",
    stats: { total: 156, pending: 8 },
    color: "green",
    icon: MessageCircle,
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
        <h1 className="mb-2">CRM Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of incident requests and feedback activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isActive = activeCardId === card.id;
          return (
            <Card
              key={card.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isActive
                  ? card.color === "blue"
                    ? "ring-2 ring-offset-2 ring-blue-500 !border-blue-200 !bg-blue-50 dark:!bg-blue-950 dark:!border-blue-800"
                    : "ring-2 ring-offset-2 ring-green-500 !border-green-200 !bg-green-50 dark:!bg-green-950 dark:!border-green-800"
                  : ""
              }`}
              onClick={() =>
                setActiveCardId((prev) => (prev === card.id ? null : card.id))
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      card.color === "blue"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
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

      {activeCardId === "Feedbacks" && (
        <NewCrmFeedback userRole={userRole} />
      )}

      {activeCardId === "Incident Requests" && (
        <IncidentReturnsRequests />
      )}
    </div>
  );
}
