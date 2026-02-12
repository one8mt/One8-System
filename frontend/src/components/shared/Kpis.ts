// src/data/kpis.ts

import type { KpiTrend, KpiIconType } from "@/components/shared/KpiCard";

// Types
export type AppRole = "manager" | "employee" | "supplier" | "client";
export type AppModule = "procurement" | "crm" | "finance";

/**
 * KPI definition structure
 */
export type KpiDefinition = {
  id: string;
  title: string;
  value: string | number;
  comparison?: string;
  trend?: KpiTrend;
  iconType?: KpiIconType; // Reference to icon component
  href?: string; // Optional drill-down link
};

/**
 * KPIs organized by module → role
 */
export const kpisData: Record<
  AppModule,
  Partial<Record<AppRole, KpiDefinition[]>>
> = {
  // ========================
  // CRM KPIs
  // ========================
  crm: {
    manager: [
      // Clients Module
      {
        id: "crm-total-clients",
        title: "Total Clients",
        value: "247",
        comparison: "+12 from last month",
        trend: "positive",
        iconType: "users",
        href: "/crm/clients",
      },
      {
        id: "crm-new-clients",
        title: "New Clients (This Month)",
        value: "18",
        comparison: "+5 from last month",
        trend: "positive",
        iconType: "userPlus",
      },
      {
        id: "crm-retention-rate",
        title: "Retention Rate",
        value: "94%",
        comparison: "+2% from last month",
        trend: "positive",
        iconType: "target",
      },
      {
        id: "crm-active-clients",
        title: "Active Clients",
        value: "231",
        comparison: "+8 from last month",
        trend: "positive",
        iconType: "trendingUp",
      },

      // Returns Module
      {
        id: "crm-items-received",
        title: "Items Received Today",
        value: "24",
        comparison: "+12% from last month",
        trend: "positive",
        iconType: "package",
      },
      {
        id: "crm-pending-checks",
        title: "Pending Inventory Checks",
        value: "8%",
        comparison: "-8% from last month",
        trend: "negative",
        iconType: "clock",
      },
      {
        id: "crm-damaged-items",
        title: "Items Marked as Damaged",
        value: "70",
        comparison: "+5% from last month",
        trend: "positive",
        iconType: "alert",
      },
      {
        id: "crm-available-stock",
        title: "Items Moved to Available Stock",
        value: "28 Avg",
        comparison: "+15% from last month",
        trend: "positive",
        iconType: "checkCircle",
      },

      // Profit Module
      {
        id: "crm-total-profit",
        title: "Total Adjusted Profit",
        value: "SAR 1.2M",
        comparison: "↗ +18% from last month",
        trend: "positive",
        iconType: "dollar",
      },
      {
        id: "crm-profit-lost",
        title: "Profit Lost Due to Returns",
        value: "SAR 45K",
        comparison: "↘ -8% from last month",
        trend: "negative",
        iconType: "trendingDown",
      },
      {
        id: "crm-avg-csat",
        title: "Average CSAT",
        value: "4.2",
        comparison: "↗ +0.3 from last month",
        trend: "positive",
        iconType: "star",
      },
      {
        id: "crm-profit-alerts",
        title: "Active Profit Alerts",
        value: "12",
        comparison: "↗ +3 from last month",
        trend: "positive",
        iconType: "alert",
      },

      // Feedback Module
      {
        id: "crm-csat-score",
        title: "Avg CSAT Score",
        value: "4.2",
        comparison: "+0.3 from last month",
        trend: "positive",
        iconType: "star",
      },
      {
        id: "crm-low-ratings",
        title: "Low Ratings %",
        value: "8%",
        comparison: "-2% from last month",
        trend: "negative",
        iconType: "thumbsDown",
      },
      {
        id: "crm-total-feedback",
        title: "Total Feedback Received",
        value: "156",
        comparison: "+24 from last month",
        trend: "positive",
        iconType: "checkCircle",
      },
      {
        id: "crm-positive-feedback",
        title: "Positive Feedback Rate",
        value: "78%",
        comparison: "+5% from last month",
        trend: "positive",
        iconType: "thumbsUp",
      },
    ],

    client: [
      // Client-specific KPIs (if any)
    ],
  },

  // ========================
  // PROCUREMENT KPIs
  // ========================
  procurement: {
    manager: [
      // Purchase Orders (PO)
      {
        id: "proc-total-orders",
        title: "Total Orders",
        value: "60",
        comparison: "+10% from last month",
        trend: "positive",
        iconType: "shoppingCart",
      },
      {
        id: "proc-active-orders",
        title: "Active Orders",
        value: "15",
        comparison: "+8% from last month",
        trend: "positive",
        iconType: "package",
      },
      {
        id: "proc-delivered-orders",
        title: "Delivered Orders",
        value: "42",
        comparison: "+18% from last month",
        trend: "positive",
        iconType: "checkCircle",
      },
      {
        id: "proc-total-value",
        title: "Total Value",
        value: "SAR 1.2M",
        comparison: "+22% from last month",
        trend: "positive",
        iconType: "dollar",
      },

      // Purchase Requisitions (PR)
      {
        id: "proc-total-requisitions",
        title: "Total Requisitions",
        value: "45",
        comparison: "+12% from last month",
        trend: "positive",
        iconType: "document",
      },
      {
        id: "proc-avg-approval-time",
        title: "Avg. Approval Time",
        value: "2.3 days",
        comparison: "-8% from last month",
        trend: "negative",
        iconType: "clock",
      },
      {
        id: "proc-approval-rate",
        title: "Approval Rate",
        value: "84%",
        comparison: "+5% from last month",
        trend: "positive",
        iconType: "checkCircle",
      },
      {
        id: "proc-this-month",
        title: "This Month",
        value: "28",
        comparison: "+15% from last month",
        trend: "positive",
        iconType: "document",
      },

      // RFQ
      {
        id: "proc-total-rfqs",
        title: "Total RFQs Sent",
        value: "32",
        comparison: "+14% from last month",
        trend: "positive",
        iconType: "document",
      },
      {
        id: "proc-quotations-received",
        title: "Quotations Received",
        value: "87",
        comparison: "+20% from last month",
        trend: "positive",
        iconType: "mail",
      },
      {
        id: "proc-best-supplier",
        title: "Best Price Supplier",
        value: "Supplier C",
        comparison: "12% savings from last month",
        trend: "positive",
        iconType: "award",
      },
      {
        id: "proc-avg-response-time",
        title: "Avg. Response Time",
        value: "3.5 days",
        comparison: "-10% from last month",
        trend: "negative",
        iconType: "clock",
      },
    ],

    employee: [
      // PO Employee
      {
        id: "proc-emp-active-orders",
        title: "My Active Orders",
        value: "15",
        comparison: "+8% from last month",
        trend: "positive",
        iconType: "clipboard",
      },
      {
        id: "proc-emp-in-transit",
        title: "Orders In Transit",
        value: "9",
        comparison: "+12% from last month",
        trend: "positive",
        iconType: "truck",
      },
      {
        id: "proc-emp-delivered",
        title: "Delivered Orders (This Month)",
        value: "42",
        comparison: "+18% from last month",
        trend: "positive",
        iconType: "checkCircle",
      },
      {
        id: "proc-emp-issues",
        title: "Orders with Issues",
        value: "4",
        comparison: "-15% from last month",
        trend: "negative",
        iconType: "alert",
      },

      // PR Employee
      {
        id: "proc-emp-incoming-prs",
        title: "Incoming PRs from Inventory",
        value: "12",
        comparison: "+8% from last month",
        trend: "positive",
        iconType: "mail",
      },
      {
        id: "proc-emp-draft-prs",
        title: "My Draft PRs",
        value: "5",
        comparison: "-3% from last month",
        trend: "negative",
        iconType: "document",
      },
      {
        id: "proc-emp-awaiting-approval",
        title: "PRs Awaiting Manager Approval",
        value: "18",
        comparison: "+15% from last month",
        trend: "positive",
        iconType: "user",
      },
      {
        id: "proc-emp-urgent-prs",
        title: "Urgent Manual PRs Created",
        value: "7",
        comparison: "+22% from last month",
        trend: "positive",
        iconType: "alert",
      },

      // RFQ Employee
      {
        id: "proc-emp-rfqs-sent",
        title: "RFQs I Sent",
        value: "24",
        comparison: "+18% from last month",
        trend: "positive",
        iconType: "send",
      },
      {
        id: "proc-emp-rfqs-returned",
        title: "RFQs Returned by Manager",
        value: "3",
        comparison: "-12% from last month",
        trend: "negative",
        iconType: "rotate",
      },
      {
        id: "proc-emp-supplier-pending",
        title: "Supplier Selection Pending",
        value: "8",
        comparison: "+5% from last month",
        trend: "positive",
        iconType: "users",
      },
      {
        id: "proc-emp-rfqs-manager-handling",
        title: "Sent RFQs (Manager Handling Responses)",
        value: "19",
        comparison: "+22% from last month",
        trend: "positive",
        iconType: "mail",
      },
    ],

    supplier: [
      // Supplier-specific KPIs (if any)
    ],
  },

  // ========================
  // FINANCE KPIs
  // ========================
  finance: {
    manager: [
      // Example Finance KPIs
      {
        id: "finance-revenue",
        title: "Total Revenue",
        value: "SAR 5.2M",
        comparison: "+15% from last month",
        trend: "positive",
        iconType: "dollar",
      },
      {
        id: "finance-expenses",
        title: "Total Expenses",
        value: "SAR 3.8M",
        comparison: "+8% from last month",
        trend: "positive",
        iconType: "trendingDown",
      },
      {
        id: "finance-profit-margin",
        title: "Profit Margin",
        value: "27%",
        comparison: "+3% from last month",
        trend: "positive",
        iconType: "target",
      },
      {
        id: "finance-pending-invoices",
        title: "Pending Invoices",
        value: "23",
        comparison: "-5 from last month",
        trend: "negative",
        iconType: "document",
      },
    ],

    employee: [
      // Finance employee KPIs
    ],
  },
};

/**
 * Get KPIs for specific module + role
 */
export function getKpisForRole(
  module: AppModule,
  role: AppRole
): KpiDefinition[] {
  const moduleKpis = kpisData[module];
  if (!moduleKpis) return [];

  const roleKpis = moduleKpis[role];
  if (!roleKpis) return [];

  return roleKpis;
}

/**
 * Get KPIs by specific IDs (for custom layouts)
 */
export function getKpisByIds(
  module: AppModule,
  role: AppRole,
  ids: string[]
): KpiDefinition[] {
  const allKpis = getKpisForRole(module, role);
  return allKpis.filter((kpi) => ids.includes(kpi.id));
}

/**
 * Example: Get KPIs with dynamic data from API
 */
export async function getKpisWithData(
  module: AppModule,
  role: AppRole,
  data?: any
): Promise<KpiDefinition[]> {
  const baseKpis = getKpisForRole(module, role);

  // Example: inject dynamic data
  // if (data?.totalClients) {
  //   baseKpis[0].value = data.totalClients;
  // }

  return baseKpis;
}
