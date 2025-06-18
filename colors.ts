const tintColorLight = "#2563eb";
const tintColorDark = "#3b82f6";

export default {
  light: {
    text: "#1f2937",
    background: "#ffffff",
    surface: "#f8fafc",
    tint: tintColorLight,
    tabIconDefault: "#9ca3af",
    tabIconSelected: tintColorLight,
    border: "#e5e7eb",
    card: "#ffffff",
    notification: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    primary: "#2563eb",
    secondary: "#6b7280",
  },
  dark: {
    text: "#f9fafb",
    background: "#111827",
    surface: "#1f2937",
    tint: tintColorDark,
    tabIconDefault: "#6b7280",
    tabIconSelected: tintColorDark,
    border: "#374151",
    card: "#1f2937",
    notification: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    primary: "#3b82f6",
    secondary: "#9ca3af",
  },
};

export const useThemeColor = (
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) => {
  const theme = 'light'; // This would come from a theme context
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
};

export const Colors = {
  light: {
    text: "#1f2937",
    background: "#ffffff",
    surface: "#f8fafc",
    tint: tintColorLight,
    tabIconDefault: "#9ca3af",
    tabIconSelected: tintColorLight,
    border: "#e5e7eb",
    card: "#ffffff",
    notification: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    primary: "#2563eb",
    secondary: "#6b7280",
  },
  dark: {
    text: "#f9fafb",
    background: "#111827",
    surface: "#1f2937",
    tint: tintColorDark,
    tabIconDefault: "#6b7280",
    tabIconSelected: tintColorDark,
    border: "#374151",
    card: "#1f2937",
    notification: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    primary: "#3b82f6",
    secondary: "#9ca3af",
  },
};