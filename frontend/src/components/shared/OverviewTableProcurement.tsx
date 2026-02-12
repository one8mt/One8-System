"use client";

import styles from "./OverviewTable.module.css";
import Image from "next/image";

export type OverviewStatus =
  | "In Progress"
  | "Partial"
  | "Pending"
  | "Completed"
  | "QA Hold"
  | "Delayed"
  | "Open"
  | "Closed";

export type OverviewRow = {
  id: string; // RFQ-1032 / PO-551 ...
  title: string; // Steel Sheets • Supplier Quotes
  meta: string; // Jan 12 • 45,000 SAR
  module: "RFQ" | "PO" | "PR"; // فقط هذي (بدون Returns)
  statusTitle: string; // Sent to Supplier / Receiving ...
  badge: OverviewStatus; // badge واحد فقط جنب البروقراس
  progress: number; // 0-100
  href?: string; // اختياري (لو تبين procurement clickable لاحقًا)
};

type Props = {
  title: string;
  description?: string;
  rows: OverviewRow[];
  // لو تبين CRM لاحقًا بدون كليك = بس لا تمررين href
};

function normalizeBadgeKey(s: string) {
  // ✅ توحيد المدخلات عشان ما يصير "In progress" رمادي
  return s
    .toLowerCase()
    .replace(/\s+/g, "") // remove spaces
    .replace(/-/g, "");  // remove dashes
}

function badgeClass(badge: string) {
  const key = normalizeBadgeKey(badge);

  if (key === "inprogress") return styles.badge_inProgress;
  if (key === "partial") return styles.badge_partial;
  if (key === "pending") return styles.badge_pending;
  if (key === "completed") return styles.badge_completed;
  if (key === "qahold") return styles.badge_qaHold;
  if (key === "delayed") return styles.badge_delayed;
  if (key === "open") return styles.badge_open;
  if (key === "closed") return styles.badge_closed;

  return styles.badge_default;
}

function moduleIcon(module: OverviewRow["module"]) {
  if (module === "RFQ") return { src: "/icons/procurement/rfq.svg", tone: "green" as const };
  if (module === "PO") return { src: "/icons/procurement/po.svg", tone: "purple" as const };
  return { src: "/icons/procurement/pr.svg", tone: "blue" as const };
}

export default function OverviewTableProcurement({ title, description, rows }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.headerIcon} aria-hidden="true">↗</span>
          <div className={styles.headerTitle}>{title}</div>
        </div>

        {description ? <div className={styles.headerDesc}>{description}</div> : null}
      </div>

      {/* ✅ خط واحد خفيف فقط */}
      <div className={styles.divider} />

      <div className={styles.table}>
        {rows.map((r) => {
          const icon = moduleIcon(r.module);
          const toneClass =
            icon.tone === "green"
              ? styles.iconTone_green
              : icon.tone === "purple"
              ? styles.iconTone_purple
              : styles.iconTone_blue;

          const rowInner = (
            <div className={styles.rowInner}>
              {/* LEFT */}
              <div className={styles.left}>
                <span className={`${styles.iconWrap} ${toneClass}`}>
                  <Image src={icon.src} alt="" width={16} height={16} />
                </span>

                <div className={styles.opText}>
                  <div className={styles.opId}>{r.id}</div>
                  <div className={styles.opTitle}>{r.title}</div>
                  <div className={styles.opMeta}>{r.meta}</div>
                </div>
              </div>

              {/* RIGHT */}
              <div className={styles.right}>
                <div className={styles.statusTitle}>{r.statusTitle}</div>

                <div className={styles.statusRow}>
                  {/* ✅ badge واحد فقط هنا */}
                  <span className={`${styles.badge} ${badgeClass(r.badge)}`}>{r.badge}</span>

                  {/* progress (always black) */}
                  <div className={styles.progressWrap} aria-hidden="true">
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${Math.max(0, Math.min(100, r.progress))}%` }}
                      />
                    </div>
                  </div>

                  <div className={styles.percent}>{r.progress}%</div>
                </div>
              </div>
            </div>
          );

          return r.href ? (
            <a key={r.id} href={r.href} className={styles.rowLink}>
              <div className={styles.row}>{rowInner}</div>
            </a>
          ) : (
            <div key={r.id} className={styles.row}>
              {rowInner}
            </div>
          );
        })}
      </div>
    </section>
  );
}