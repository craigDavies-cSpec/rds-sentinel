// Custom Accent Color Theme Module (Phase 9A)

export type AccentTheme = "aws_orange" | "emerald_green" | "indigo_blue" | "cyber_cyan";

export interface AccentOption {
  id: AccentTheme;
  name: string;
  primaryColor: string; // hex
  badgeClass: string;
}

export const ACCENT_THEMES: AccentOption[] = [
  {
    id: "aws_orange",
    name: "AWS Amber",
    primaryColor: "#FF9900",
    badgeClass: "bg-aws-orange text-aws-lightTextPrimary",
  },
  {
    id: "emerald_green",
    name: "Emerald Green",
    primaryColor: "#10B981",
    badgeClass: "bg-emerald-600 text-white",
  },
  {
    id: "indigo_blue",
    name: "Indigo Cloud",
    primaryColor: "#6366F1",
    badgeClass: "bg-indigo-600 text-white",
  },
  {
    id: "cyber_cyan",
    name: "Cyber Cyan",
    primaryColor: "#06B6D4",
    badgeClass: "bg-cyan-600 text-white",
  },
];

/**
 * Returns dynamic CSS color variable mapping for selected accent theme
 */
export function getAccentStyles(accent: AccentTheme): { primary: string; hover: string } {
  switch (accent) {
    case "emerald_green":
      return { primary: "#10B981", hover: "#059669" };
    case "indigo_blue":
      return { primary: "#6366F1", hover: "#4F46E5" };
    case "cyber_cyan":
      return { primary: "#06B6D4", hover: "#0891B2" };
    case "aws_orange":
    default:
      return { primary: "#FF9900", hover: "#EC7211" };
  }
}
