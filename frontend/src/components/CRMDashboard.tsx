"use client";

import { useState } from "react";
import { ObjectiveFeedback } from "./crm/ObjectiveFeedback";
import { ProfitImpact } from "./crm/ProfitImpact";
import { ReturnsOverview } from "./crm/ReturnsOverview";
import { ClientsManagement } from "./crm/ClientsManagement";
import { ClientDetails } from "./crm/ClientDetails";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { MessageCircle, TrendingUp, RefreshCcw, Users } from "lucide-react";

interface CRMDashboardProps {
  activeSubsection: string;
  setActiveSubsection: (subsection: string) => void;
  userRole: "employee" | "manager" | "client";
}

const subsectionData = [
  {
    id: "Objective Feedback",
    title: "Objective Feedback",
    shortTitle: "Objective Feedback",
    description: "Track and analyze client feedback",
    icon: MessageCircle,
    stats: { total: 156, pending: 8 },
    color: "blue",
    managerOnly: false,
    clientTitle: "Client Feedback",
  },
  {
    id: "Profit Impact",
    title: "Profit Impact",
    shortTitle: "Profit",
    description: "Monitor revenue and profit metrics",
    icon: TrendingUp,
    stats: { total: 89, pending: 12 },
    color: "green",
    managerOnly: true,
  },
  {
    id: "Returns",
    title: "Returns",
    shortTitle: "Returns",
    description: "Manage product returns and refunds",
    icon: RefreshCcw,
    stats: { total: 24, pending: 8 },
    color: "purple",
    managerOnly: false,
  },
  {
    id: "Clients",
    title: "Clients",
    shortTitle: "Clients",
    description: "Track all clients and regional accounts",
    icon: Users,
    stats: { total: 247, pending: 0 },
    color: "orange",
    managerOnly: true,
  },
];

export function CRMDashboard({
  activeSubsection,
  setActiveSubsection,
  userRole,
}: CRMDashboardProps) {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Filter subsections based on user role
  const visibleSubsections = subsectionData.filter((section) => {
    if (section.managerOnly && userRole !== "manager") {
      return false;
    }
    return true;
  });

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = isActive ? "ring-2 ring-offset-2" : "hover:shadow-md";

    switch (color) {
      case "blue":
        return `${baseClasses} ${
          isActive
            ? "ring-blue-500 !border-blue-200 !bg-blue-50 dark:!bg-blue-950 dark:!border-blue-800"
            : "border-border"
        }`;
      case "green":
        return `${baseClasses} ${
          isActive
            ? "ring-green-500 !border-green-200 !bg-green-50 dark:!bg-green-950 dark:!border-green-800"
            : "border-border"
        }`;
      case "orange":
        return `${baseClasses} ${
          isActive
            ? "ring-orange-500 !border-orange-200 !bg-orange-50 dark:!bg-orange-950 dark:!border-orange-800"
            : "border-border"
        }`;
      case "purple":
        return `${baseClasses} ${
          isActive
            ? "ring-purple-500 !border-purple-200 !bg-purple-50 dark:!bg-purple-950 dark:!border-purple-800"
            : "border-border"
        }`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">
            {userRole === "client" ? "Client Portal" : "CRM Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "client"
              ? "View and manage your feedback and returns"
              : "Analyze customer satisfaction and track all client feedback to improve quality and service performance."}
          </p>
        </div>
      </div>

      {/* Subsection Navigation Cards - Hide when viewing client details */}
      {!selectedClientId && (
        <div className="flex gap-6 overflow-x-auto px-1 py-2 crm-scrollbar">
          {visibleSubsections.map((section) => {
            const isActive = activeSubsection === section.id;
            const IconComponent = section.icon;

            return (
              <Card
                key={section.id}
                className={`cursor-pointer transition-all duration-200 flex-shrink-0 w-[calc((100%-72px)/3)] min-w-[320px] ${getColorClasses(
                  section.color,
                  isActive
                )}`}
                onClick={() => setActiveSubsection(section.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          section.color === "blue"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                            : section.color === "green"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            : section.color === "orange"
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                            : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {userRole === "client" && section.clientTitle
                            ? section.clientTitle
                            : section.shortTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <Badge className="bg-primary text-primary-foreground">
                        Active
                      </Badge>
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
                      <p className="font-medium">{section.stats.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Active Subsection Content */}
      {activeSubsection === "Objective Feedback" && (
        <ObjectiveFeedback userRole={userRole} />
      )}

      {activeSubsection === "Profit Impact" && userRole === "manager" && (
        <ProfitImpact userRole={userRole} />
      )}

      {activeSubsection === "Returns" && <ReturnsOverview userRole={userRole} />}

      {activeSubsection === "Clients" && userRole === "manager" && (
        <>
          {selectedClientId ? (
            <ClientDetails
              clientId={selectedClientId}
              onBack={() => setSelectedClientId(null)}
            />
          ) : (
            <ClientsManagement
              userRole={userRole}
              onClientSelect={(clientId) => setSelectedClientId(clientId)}
            />
          )}
        </>
      )}
    </div>
  );
}
