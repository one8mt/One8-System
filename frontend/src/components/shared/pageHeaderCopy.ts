import type { AppRole } from "./AppHeader";

export type AppModule = "procurement" | "crm" | "finance";

type HeaderCopy = Record<AppRole, { title: string; description: string }>;

export const pageHeaderCopy: Record<AppModule, Partial<HeaderCopy>> = {
  procurement: {
    manager: {
      title: "Procurement Dashboard",
      description: "Monitor and manage procurement processes across your organization",
    },
    employee: {
      title: "Procurement",
      description: "Track and update procurement tasks assigned to you",
    },
    supplier: {
      title: "Supplier Portal",
      description: "Manage RFQs, submit quotations, and track purchase orders",
    },
  },

  crm: {
    manager: {
      title: "CRM Dashboard",
      description: "Monitor client health, returns, and profitability insights",
    },
    client: {
      title: "CRM",
      description: "View and manage your feedback and returns",
    },
  },

  finance: {
    manager: {
      title: "Finance Dashboard",
      description: "Track financial performance, accounting, and outcomes",
    },
    employee: {
      title: "Finance",
      description: "Handle your assigned finance operations and records",
    },
  },
};