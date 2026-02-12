// src/data/alerts.ts

import type { AlertTone } from "@/components/shared/AlertBanner";

// ✅ Define types here (or import from AppHeader if needed)
export type AppRole = "manager" | "employee" | "supplier" | "client";
export type AppModule = "procurement" | "crm" | "finance";

/**
 * Alert definition structure
 */
export type AlertDefinition = {
  id: string;
  tone: AlertTone;
  message: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  // Optional: conditions for when to show
  condition?: () => boolean;
};

/**
 * Alerts organized by module → role
 */
export const alertsData: Record<
  AppModule,
  Partial<Record<AppRole, AlertDefinition[]>>
> = {
  // ========================
  // CRM Alerts
  // ========================
  crm: {
    manager: [
      {
        id: "crm-manager-risk-clients",
        tone: "warning",
        message: "3 clients are at risk — review complaints and satisfaction trends.",
        action: {
          label: "Review",
          href: "/crm/at-risk-clients",
        },
      },
      {
        id: "crm-manager-profit-drop",
        tone: "error",
        message: "Client AlOlayan refund reduced profit by 12%",
      },
      {
        id: "crm-manager-satisfaction-up",
        tone: "success",
        message: "Client AlMajd satisfaction improved → profit +3%",
      },
    ],
    employee: [
      {
        id: "crm-employee-pending-followup",
        tone: "info",
        message: "5 clients pending follow-up this week",
        action: {
          label: "View",
          href: "/crm/follow-ups",
        },
      },
    ],
    client: [
      {
        id: "crm-client-return-processed",
        tone: "success",
        message: "Your return request #1234 has been processed",
      },
      {
        id: "crm-client-satisfaction-survey",
        tone: "info",
        message: "We value your feedback — complete satisfaction survey",
        action: {
          label: "Take Survey",
          href: "/survey",
        },
      },
    ],
  },

  // ========================
  // Procurement Alerts
  // ========================
  procurement: {
    manager: [
      {
        id: "proc-manager-reorder",
        tone: "error",
        message: "3 items are below reorder point",
        action: {
          label: "Create PR",
          href: "/procurement/purchase-requests/new",
        },
      },
      {
        id: "proc-manager-expiring",
        tone: "info",
        message: "5 items expiring within 30 days",
        action: {
          label: "Review",
          href: "/procurement/inventory/expiring",
        },
      },
      {
        id: "proc-manager-delayed-pos",
        tone: "warning",
        message: "2 purchase orders delayed by 5+ days",
        action: {
          label: "View Details",
          href: "/procurement/purchase-orders?status=delayed",
        },
      },
      {
        id: "proc-manager-arriving",
        tone: "info",
        message: "8 purchase orders arriving this week",
        action: {
          label: "Track",
          href: "/procurement/purchase-orders?status=arriving",
        },
      },
    ],
    employee: [
      {
        id: "proc-employee-assigned-rfqs",
        tone: "info",
        message: "3 RFQs assigned to you pending review",
        action: {
          label: "Review",
          href: "/procurement/rfqs/assigned",
        },
      },
    ],
    supplier: [
      {
        id: "proc-supplier-new-rfq",
        tone: "info",
        message: "New RFQ #5032 requires quotation by Jan 30",
        action: {
          label: "Submit Quote",
          href: "/rfqs/5032",
        },
      },
      {
        id: "proc-supplier-po-ready",
        tone: "success",
        message: "PO #1289 approved — prepare shipment",
        action: {
          label: "View PO",
          href: "/purchase-orders/1289",
        },
      },
    ],
  },

  // ========================
  // Finance Alerts
  // ========================
  finance: {
    manager: [
      {
        id: "finance-manager-overdue-invoices",
        tone: "error",
        message: "12 invoices overdue by 30+ days — total 245,000 SAR",
        action: {
          label: "Review",
          href: "/finance/invoices?status=overdue",
        },
      },
      {
        id: "finance-manager-pending-approvals",
        tone: "warning",
        message: "8 expense reports pending approval",
        action: {
          label: "Approve",
          href: "/finance/expense-reports/pending",
        },
      },
    ],
    employee: [
      {
        id: "finance-employee-expense-rejected",
        tone: "error",
        message: "Expense report #456 rejected — review comments",
        action: {
          label: "View",
          href: "/finance/expense-reports/456",
        },
      },
    ],
  },
};

/**
 * Get alerts for specific module + role
 */
export function getAlertsForRole(
  module: AppModule,
  role: AppRole
): AlertDefinition[] {
  const moduleAlerts = alertsData[module];
  if (!moduleAlerts) return [];

  const roleAlerts = moduleAlerts[role];
  if (!roleAlerts) return [];

  // Optional: filter by condition
  return roleAlerts.filter((alert) => {
    if (!alert.condition) return true;
    return alert.condition();
  });
}

/**
 * Example: Get alerts with dynamic data from API
 */
export async function getAlertsWithData(
  module: AppModule,
  role: AppRole,
  data?: any // your API data
): Promise<AlertDefinition[]> {
  const baseAlerts = getAlertsForRole(module, role);

  // Example: inject dynamic data into messages
  // if (data?.riskClientsCount) {
  //   baseAlerts[0].message = `${data.riskClientsCount} clients are at risk...`
  // }

  return baseAlerts;
}