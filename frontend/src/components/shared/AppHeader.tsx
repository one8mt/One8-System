"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type AppRole = "manager" | "employee" | "supplier" | "client";

type AppHeaderProps = {
  role?: AppRole;
  user?: {
    name: string;
    roleLabel?: string;
    initials: string;
  };
};

type Theme = "light" | "dark";

function defaultRoleLabel(role: AppRole) {
  switch (role) {
    case "client":
      return "Client";
    case "supplier":
      return "Supplier";
    case "employee":
      return "Employee";
    default:
      return "Manager";
  }
}

function useTheme(defaultTheme: Theme = "light") {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return { theme, setTheme, toggle };
}

const styles = {
  header: {
    height: 64,
    position: "sticky" as const,
    top: 0,
    zIndex: 50,

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",

    borderBottom: "1px solid var(--border)",
    background: "var(--background, #ffffff)",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  themeBtn: {
    width: 36,
    height: 36,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },

  nameBlock: {
    textAlign: "right" as const,
    lineHeight: 1.2,
  },

  name: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--color-text-primary)",
  },

  role: {
    fontSize: 12,
    color: "var(--color-text-muted)",
  },
} as const;

export default function AppHeader({
  role = "manager",
  user,
}: AppHeaderProps) {
  const { theme, toggle } = useTheme("light");

  const resolvedUser = useMemo(() => {
    const roleLabel = user?.roleLabel ?? defaultRoleLabel(role);
    return {
      name: user?.name ?? "Rahaf B",
      initials: user?.initials ?? "RB",
      roleLabel,
    };
  }, [role, user]);

  const icons = useMemo(() => {
    return {
      theme: theme === "light" ? "/icons/moon.svg" : "/icons/darkmoon.svg",
      dropdown: theme === "dark" ? "/icons/darkdropdown.svg" : "/icons/dropdown.svg",
    };
  }, [theme]);

  const avatarStyle = useMemo(
    () => ({
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: theme === "dark" ? "#262626" : "#ECECF0",
      color: theme === "dark" ? "#FAFAFA" : "#0A0A0A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
      fontSize: 12,
    }),
    [theme]
  );

  return (
    <header style={styles.header}>
      {/* Logo */}
      <Image src="/one8logo.png" alt="ONE8 Logo" width={90} height={28} priority />

      {/* Right */}
      <div style={styles.right}>
        {/* Theme toggle */}
        <button onClick={toggle} style={styles.themeBtn} title="Toggle theme" type="button">
          <Image src={icons.theme} alt="Toggle theme" width={18} height={18} />
        </button>

        {/* Name + Role */}
        <div style={styles.nameBlock}>
          <div style={styles.name}>{resolvedUser.name}</div>
          <div style={styles.role}>{resolvedUser.roleLabel}</div>
        </div>

        {/* Avatar */}
        <div style={avatarStyle}>{resolvedUser.initials}</div>

        {/* Dropdown */}
        <Image src={icons.dropdown} alt="Open menu" width={12} height={12} />
      </div>
    </header>
  );
}
