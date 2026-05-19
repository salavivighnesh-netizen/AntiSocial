import { History, LayoutGrid, PenSquare, User } from "lucide-react";

/** Profile sections shown under an active channel in the sidebar. */
export const CHANNEL_PROFILE_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "feed", label: "Feed", icon: LayoutGrid },
  { id: "create", label: "Create post", icon: PenSquare },
  { id: "history", label: "History", icon: History },
];

export const CHANNEL_TAB_IDS = new Set(CHANNEL_PROFILE_TABS.map((t) => t.id));

/** @param {string | null} tab */
export function normalizeChannelTab(tab) {
  if (tab && CHANNEL_TAB_IDS.has(tab)) return tab;
  return "profile";
}
