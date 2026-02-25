"use client";

import { ObjectiveFeedback } from "./ObjectiveFeedback";

interface NewCrmFeedbackProps {
  userRole: "employee" | "manager" | "client";
}

export function NewCrmFeedback({ userRole }: NewCrmFeedbackProps) {
  return <ObjectiveFeedback userRole={userRole} />;
}
