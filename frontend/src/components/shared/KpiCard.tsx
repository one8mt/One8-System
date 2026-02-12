import styles from "./KpiCard.module.css";

export type KpiTrend = "positive" | "negative" | "neutral";
export type KpiIconType =
  | "users"
  | "user"
  | "userPlus"
  | "package"
  | "shoppingCart"
  | "clock"
  | "target"
  | "trendingUp"
  | "trendingDown"
  | "alert"
  | "checkCircle"
  | "document"
  | "mail"
  | "send"
  | "rotate"
  | "dollar"
  | "award"
  | "thumbsUp"
  | "thumbsDown"
  | "star"
  | "truck"
  | "clipboard";

type KpiCardProps = {
  title: string;
  value: string | number;
  comparison?: string;
  trend?: KpiTrend;
  iconType?: KpiIconType;
  onClick?: () => void;
  href?: string;
  isLoading?: boolean;
};

// Icon component (inline like AlertBanner)
function KpiIcon({ type }: { type: KpiIconType }) {
  const iconProps = {
    width: 36,
    height: 36,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: styles.icon,
  };

  switch (type) {
    case "users":
      return (
        <svg {...iconProps}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "user":
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "userPlus":
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4h-3" />
          <path d="M4 21v-2a4 4 0 0 1 4-4h3" />
          <circle cx="12" cy="7" r="4" />
          <line x1="18" y1="8" x2="24" y2="8" />
          <line x1="21" y1="5" x2="21" y2="11" />
        </svg>
      );
    case "package":
      return (
        <svg {...iconProps}>
          <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "shoppingCart":
      return (
        <svg {...iconProps}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "target":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "trendingUp":
      return (
        <svg {...iconProps}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case "trendingDown":
      return (
        <svg {...iconProps}>
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      );
    case "alert":
      return (
        <svg {...iconProps}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "checkCircle":
      return (
        <svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "document":
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "mail":
      return (
        <svg {...iconProps}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "send":
      return (
        <svg {...iconProps}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case "rotate":
      return (
        <svg {...iconProps}>
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      );
    case "dollar":
      return (
        <svg {...iconProps}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "award":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case "thumbsUp":
      return (
        <svg {...iconProps}>
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      );
    case "thumbsDown":
      return (
        <svg {...iconProps}>
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
      );
    case "star":
      return (
        <svg {...iconProps}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "truck":
      return (
        <svg {...iconProps}>
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...iconProps}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      );
    default:
      return null;
  }
}

export default function KpiCard({
  title,
  value,
  comparison,
  trend = "neutral",
  iconType,
  onClick,
  href,
  isLoading = false,
}: KpiCardProps) {
  const cardClass = [
    styles.card,
    onClick || href ? styles.cardClickable : "",
    isLoading ? styles.cardLoading : "",
  ]
    .filter(Boolean)
    .join(" ");

  const comparisonClass = [
    styles.comparison,
    trend === "positive" ? styles.comparison_positive : "",
    trend === "negative" ? styles.comparison_negative : "",
    trend === "neutral" ? styles.comparison_neutral : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div className={cardClass} onClick={!href ? onClick : undefined}>
      {isLoading ? (
        // Loading skeleton
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonValue} />
          <div className={styles.skeletonComparison} />
        </div>
      ) : (
        <>
          <div className={styles.content}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.value}>{value}</p>
            {comparison && (
              <p className={comparisonClass}>{comparison}</p>
            )}
          </div>

          {iconType && (
            <div className={styles.iconWrap} aria-hidden="true">
              <KpiIcon type={iconType} />
            </div>
          )}
        </>
      )}
    </div>
  );

  // If href provided, wrap in anchor
  return href ? (
    <a href={href} className={styles.linkWrap}>
      {content}
    </a>
  ) : (
    content
  );
}