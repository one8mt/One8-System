import { ReactNode } from "react";

type KpiGridProps = {
  children: ReactNode;
};

/**
 * ✅ Grid container for KPI cards
 * - Always 4 cards per row
 * - 16px gap between cards
 * - Responsive: 2 cards on tablet, 1 on mobile
 */
export default function KpiGrid({ children }: KpiGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
      }}
      className="kpi-grid"
    >
      {children}

      <style jsx>{`
        @media (max-width: 1199px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 767px) {
          .kpi-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}