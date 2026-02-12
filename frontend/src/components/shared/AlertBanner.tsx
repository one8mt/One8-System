"use client";

import Link from "next/link";
import styles from "./AlertBanner.module.css";

export type AlertTone = "error" | "warning" | "info" | "success";

export type AlertAction = {
  label: string;
  onClick?: () => void;
  href?: string;
};

type AlertBannerProps = {
  tone: AlertTone;
  message: string;
  action?: AlertAction;
  meta?: string;
};

function AlertIcon({ tone }: { tone: AlertTone }) {
  const iconProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (tone) {
    case "error":
      // ✅ Triangle warning icon (matches design)
      return (
        <svg {...iconProps} className={styles.icon}>
          <path
            d="M10 6V10M10 14H10.01M8.6 2.4L1.2 15C0.8 15.6 1.2 16.4 2 16.4H18C18.8 16.4 19.2 15.6 18.8 15L11.4 2.4C11 1.8 10 1.8 9.6 2.4H8.6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "warning":
      // ✅ Circle with exclamation (matches design)
      return (
        <svg {...iconProps} className={styles.icon}>
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M10 6V10M10 13.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "info":
      // ✅ Circle with exclamation (same as warning, but blue)
      return (
        <svg {...iconProps} className={styles.icon}>
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M10 6V10M10 13.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "success":
      // ✅ Circle with checkmark (matches design)
      return (
        <svg {...iconProps} className={styles.icon}>
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path
            d="M6.5 10L9 12.5L13.5 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export default function AlertBanner({ tone, message, action, meta }: AlertBannerProps) {
  const hasRight = Boolean(action || meta);

  return (
    <div className={`${styles.alert} ${styles[`alert_${tone}`]}`}>
      <div className={styles.left}>
        <div className={styles.iconWrap}>
          <AlertIcon tone={tone} />
        </div>
        <div className={styles.message}>{message}</div>
      </div>

      {hasRight && (
        <div className={styles.right}>
          {meta ? <span className={styles.meta}>{meta}</span> : null}
          {action?.href ? (
            <Link href={action.href} className={styles.actionButton}>
              {action.label}
            </Link>
          ) : action?.onClick ? (
            <button onClick={action.onClick} className={styles.actionButton}>
              {action.label}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
