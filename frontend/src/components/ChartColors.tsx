// Chart colors that work reliably in both light and dark modes
export const chartColors = {
  primary: "#3b82f6", // Blue
  secondary: "#10b981", // Green
  tertiary: "#f59e0b", // Amber
  quaternary: "#ef4444", // Red
  quinary: "#8b5cf6", // Purple
  grid: "var(--border)",

  // Status colors
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",

  // Neutral colors that adapt to theme
  text: "var(--muted-foreground)",
  border: "var(--border)",
  background: "var(--popover)",
  foreground: "var(--popover-foreground)",
};

export const getTooltipStyle = () => ({
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--popover-foreground)",
});

export const getTooltipTextStyle = () => ({
  color: "var(--popover-foreground)",
});

export const getAxisStyle = () => ({
  tick: { fill: "var(--muted-foreground)" },
  axisLine: { stroke: "var(--border)" },
});
