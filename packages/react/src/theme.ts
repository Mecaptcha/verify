export const colors = {
  light: {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    error: "#ef4444",
    success: "#10b981",
  },
  dark: {
    primary: "#818cf8",
    primaryHover: "#6366f1",
    background: "#090446",
    surface: "#1e1b4b",
    text: "#f9fafb",
    textSecondary: "#9ca3af",
    border: "#374151",
    error: "#f87171",
    success: "#34d399",
  },
};

export type Theme = keyof typeof colors;
export type ColorScheme = typeof colors.light;



