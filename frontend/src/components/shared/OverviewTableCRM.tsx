"use client";

import styles from "./OverviewTable.module.css";
import Image from "next/image";

export type CrmHealthStatus = "Healthy" | "At Risk" | "Monitor";

export type CrmOverviewRow = {
  id: string;          // Client ID
  clientName: string;  // Client name (e.g., "Techcorp")
  clientType: string;  // Client type (e.g., "Enterprise")
  meta: string;        // Meta line (e.g., "Jan 12 • Email")
  satisfaction: number; // Satisfaction score (e.g., 4.5)
  complaints: number;   // Number of complaints (e.g., 2)
  healthStatus: CrmHealthStatus; // Health status badge
  progress: number;     // Adjusted profit 0-100
};

type Props = {
  title: string;
  description?: string;
  rows: CrmOverviewRow[];
};

function healthBadgeClass(status: string, styles: any) {
  const key = status.toLowerCase().replace(/\s+/g, "");
  
  if (key === "healthy") return styles.crm__badge_healthy;
  if (key === "atrisk") return styles.crm__badge_atRisk;
  if (key === "monitor") return styles.crm__badge_monitor;
  
  return styles.crm__badge_default;
}

export default function OverviewTableCRM({ title, description, rows }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          {/* نفس اللي عندنا بالمشتريات (مو ايموجي — مجرد حرف/رمز UI) */}
          <span className={styles.headerIcon} aria-hidden="true">
            ↗
          </span>
          <div className={styles.headerTitle}>{title}</div>
        </div>

        {description ? <div className={styles.headerDesc}>{description}</div> : null}
      </div>

      <div className={styles.divider} />

      <div className={styles.crm__innerContainer}>
        {/* Row cards */}
        {rows.map((r) => {
          return (
            <div key={r.id} className={styles.crm__rowCard}>
              {/* LEFT */}
              <div className={styles.crm__left}>
                <div className={styles.crm__avatarWrap}>
                  <Image src="/icons/crm/clients.svg" alt="" width={16} height={16} />
                </div>
                <div className={styles.crm__clientInfo}>
                  <div className={styles.crm__clientHeader}>
                    <span className={styles.crm__clientName}>{r.clientName}</span>
                    <span className={styles.crm__clientType}>• {r.clientType}</span>
                  </div>
                  <div className={styles.crm__meta}>Created: {r.meta}</div>
                </div>
              </div>

              {/* RIGHT - 4 metric blocks with labels */}
              <div className={styles.crm__rightGrid}>
                {/* Satisfaction block */}
                <div className={styles.crm__metricBlock}>
                  <div className={styles.crm__metricLabel}>Satisfaction</div>
                  <div className={styles.crm__metricValue}>
                    <span className={styles.crm__satisfaction}>
                      {r.satisfaction}
                      <span className={styles.crm__star}>★</span>
                    </span>
                  </div>
                </div>

                {/* Complaints block */}
                <div className={styles.crm__metricBlock}>
                  <div className={styles.crm__metricLabel}>Complaints</div>
                  <div className={styles.crm__metricValue}>
                    <span className={styles.crm__complaints}>{r.complaints}</span>
                  </div>
                </div>

                {/* Statuses block */}
                <div className={styles.crm__metricBlock}>
                  <div className={styles.crm__metricLabel}>Status</div>
                  <div className={styles.crm__metricValue}>
                    <span className={`${styles.badge} ${styles.crm__healthBadge} ${healthBadgeClass(r.healthStatus, styles)}`}>
                      {r.healthStatus}
                    </span>
                  </div>
                </div>

                {/* Adjusted Profit block */}
                <div className={styles.crm__metricBlock}>
                  <div className={styles.crm__metricLabel}>Adjusted Profit</div>
                  <div className={styles.crm__metricValue}>
                    <div className={styles.crm__profitBarWrap}>
                      <div className={styles.crm__profitTrack} aria-hidden="true">
                        <div
                          className={styles.crm__profitFill}
                          style={{ width: `${Math.max(0, Math.min(100, r.progress))}%` }}
                        />
                      </div>
                      <div className={styles.crm__profitPercent}>{r.progress}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
