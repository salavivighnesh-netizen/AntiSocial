import {
  CalendarDays,
  Home,
  PenSquare,
  Radio,
  Settings,
  User,
  Link2,
  Palette,
} from "lucide-react";

export const STORAGE_KEYS = {
  theme: "antisocial-theme",
  auth: "antisocial-auth",
  authToken: "antisocial-auth-token",
  email: "antisocial-email",
  profileName: "antisocial-profile-name",
  onboardingCompleted: "antisocial-onboarding-completed",
  socialConnections: "antisocial-social-connections",
};

/** Buffer-style primary navigation */
export const MAIN_NAV = [
  { key: "dashboard", label: "Home", path: "/dashboard", icon: Home },
  { key: "create-post", label: "Create", path: "/create-post", icon: PenSquare },
  { key: "schedule", label: "Schedule", path: "/schedule", icon: CalendarDays },
  { key: "channels", label: "Connect channels", path: "/channels", icon: Radio },
];

export const SETTINGS_NAV = [
  { key: "account", label: "Account", path: "/settings/account", icon: User, description: "Profile and password" },
  { key: "channels", label: "Channels & connections", path: "/settings/channels", icon: Link2, description: "Social accounts and OAuth" },
  { key: "preferences", label: "Preferences", path: "/settings/preferences", icon: Palette, description: "Appearance and defaults" },
];

/** @deprecated Use MAIN_NAV — kept for Topbar title lookup */
export const ROUTES = [
  ...MAIN_NAV,
  { key: "settings", label: "Settings", path: "/settings", icon: Settings },
];

export function getPageTitle(pathname) {
  const all = [...MAIN_NAV, ...SETTINGS_NAV, { label: "Settings", path: "/settings" }];
  const exact = all.find((r) => r.path === pathname);
  if (exact) return exact.label;
  if (pathname.startsWith("/channels/")) return "Channel";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/channels")) return "Connect channels";
  if (pathname.startsWith("/schedule/new")) return "Schedule post";
  if (pathname.startsWith("/schedule")) return "Schedule";
  if (pathname.startsWith("/create-post")) return "Create";
  return "Home";
}
