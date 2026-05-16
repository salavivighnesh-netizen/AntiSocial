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
  { key: "create-post", label: "Publish", path: "/create-post", icon: PenSquare },
  { key: "schedule", label: "Queue", path: "/schedule", icon: CalendarDays },
  { key: "connected-platforms", label: "Connected Platforms", path: "/connected-platforms", icon: Radio },
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
  if (pathname.startsWith("/connected-platforms/")) return "Connected Platform";
  if (pathname.startsWith("/channels/")) return "Channel";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/connected-platforms")) return "Connected Platforms";
  if (pathname.startsWith("/channels")) return "Connected Platforms";
  return "Home";
}
