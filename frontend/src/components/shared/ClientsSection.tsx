import styles from "./ClientsSection.module.css";

export type ClientTag = {
  label: string;
  tone?: "dark" | "light";
};

export type ClientStatus = "resolved" | "pending" | "critical" | "monitor";

export type ClientCardItem = {
  id: string;
  name: string;
  iconText?: string;
  tags?: ClientTag[];
  totalRevenue: string;
  lastOrder: string;
  status: ClientStatus;
};

type ClientsSectionProps = {
  title?: string;
  items: ClientCardItem[];
};

export default function ClientsSection({ title = "Clients", items }: ClientsSectionProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.icon}>{item.iconText ?? "CL"}</div>
              <div>
                <div className={styles.name}>{item.name}</div>
                {item.tags?.length ? (
                  <div className={styles.tags}>
                    {item.tags.map((tag, index) => (
                      <span
                        key={`${item.id}-tag-${index}`}
                        className={`${styles.tag} ${
                          tag.tone === "dark" ? styles.tagDark : ""
                        }`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Total Revenue:</span>
                <span>{item.totalRevenue}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Last Order:</span>
                <span>{item.lastOrder}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Status:</span>
                <span className={`${styles.status} ${styles[`status_${item.status}`]}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
