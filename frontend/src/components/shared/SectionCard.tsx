

import Link from "next/link";
import styles from "./SectionCard.module.css";

export type CardTone = "blue" | "green" | "purple" | "orange";

type Stat = { label: string; value: string | number };

type SectionCardProps = {
  title: string;
  subtitle?: string;

  /** الأفضل: مسار الأيقونة داخل public */
  iconSrc?: string;

  /** لو تبين تمرير ReactNode (اختياري) */
  icon?: React.ReactNode;

  badge?: string;
  stats?: ReadonlyArray<Stat>;

  active?: boolean;
  tone?: CardTone;

  href?: string;
  onClick?: () => void;
};

export default function SectionCard({
  title,
  subtitle,
  iconSrc,
  icon,
  badge,
  stats = [],
  active = false,
  tone = "blue",
  href,
  onClick,
}: SectionCardProps) {
  const className = [
    styles.card,
    styles[`toneCard_${tone}`],
    active ? styles.cardActive : "",
    href || onClick ? styles.cardClickable : "",
  ]
    .filter(Boolean)
    .join(" ");

  const iconWrapClass = [styles.iconWrap, styles[`toneIcon_${tone}`]]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div className={className} onClick={!href ? onClick : undefined}>
      <div className={styles.topRow}>
        <div className={styles.left}>
          {(iconSrc || icon) ? (
            <span className={iconWrapClass}>
              {iconSrc ? (
                <img className={styles.icon} src={iconSrc} alt="" />
              ) : (
                icon
              )}
            </span>
          ) : null}

          <div className={styles.text}>
            <div className={styles.title}>{title}</div>
            {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
          </div>
        </div>

        {/* ✅ مكان ثابت للـ badge حتى ما يلف النص بشكل مختلف */}
        <span className={styles.badgeSlot}>
          {badge ? <span className={styles.badge}>{badge}</span> : null}
        </span>
      </div>

      {stats.length > 0 ? (
        <div className={styles.statsRow}>
          {stats.slice(0, 2).map((s, i) => (
            <div key={i} className={styles.statBox}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  // ✅ لا نستخدم Link إلا إذا href موجود فعلاً
  return href ? (
    <Link href={href} className={styles.linkWrap} aria-label={title}>
      {content}
    </Link>
  ) : (
    content
  );
}