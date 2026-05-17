import { Building2, MessageCircle, MessagesSquare, Megaphone, Pin, Sparkles, Users, Video } from "lucide-react";

export const SOCIAL_PLATFORM_CONFIGS = [
  {
    key: "instagram",
    label: "Instagram",
    icon: Sparkles,
    hint: "Professional account only",
    connectSubtitle: "Business, Creator, or Profile",
  },
  {
    key: "threads",
    label: "Threads",
    icon: MessageCircle,
    hint: "Threads profile publishing",
    connectSubtitle: "Profile",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Megaphone,
    hint: "Profile + organizations/pages by access",
    connectSubtitle: "Page or Profile",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: Users,
    hint: "Personal profile",
    connectSubtitle: "Page or Profile",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: Video,
    hint: "Channel publishing and analytics",
    connectSubtitle: "Channel",
  },
  {
    key: "x",
    label: "X",
    icon: MessageCircle,
    hint: "Profile and brand accounts (API tier dependent)",
    connectSubtitle: "Profile",
  },
  {
    key: "pinterest",
    label: "Pinterest",
    icon: Pin,
    hint: "Pins and board management",
    connectSubtitle: "Profile",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: MessageCircle,
    hint: "Bot-based group/channel setup",
    connectSubtitle: "Bot & Channel",
  },
  {
    key: "googleBusiness",
    label: "Google Business",
    icon: Building2,
    hint: "Business profile location updates",
    connectSubtitle: "Business location",
  },
  {
    key: "reddit",
    label: "Reddit",
    icon: MessagesSquare,
    hint: "Community posting with authenticated scopes",
    connectSubtitle: "Profile",
  },
  {
    key: "discord",
    label: "Discord",
    icon: MessagesSquare,
    hint: "OAuth + bot/webhook channel setup",
    connectSubtitle: "Server or Webhook",
  },
];

/** New connections and reconnect OAuth are hidden/disabled in the UI until re-enabled. */
export const TEMPORARILY_DISABLED_CONNECT_PLATFORM_KEYS = new Set(["pinterest", "reddit", "discord"]);

export function isPlatformConnectTemporarilyDisabled(platformKey) {
  return TEMPORARILY_DISABLED_CONNECT_PLATFORM_KEYS.has(platformKey);
}

export const PLATFORM_CAPABILITY_MATRIX = {
  facebook: { badges: ["Posting", "Analytics"], supportLevel: "full", oauth: true },
  instagram: { badges: ["Posting", "Analytics"], supportLevel: "full", oauth: true },
  threads: { badges: ["Posting", "Analytics"], supportLevel: "full", oauth: true },
  linkedin: { badges: ["Posting", "Analytics"], supportLevel: "full", oauth: true },
  youtube: { badges: ["Posting", "Analytics", "Media Upload"], supportLevel: "full", oauth: true },
  x: { badges: ["Posting", "Limited API"], supportLevel: "limited", oauth: true },
  reddit: { badges: ["Posting", "Limited API"], supportLevel: "limited", oauth: true },
  pinterest: { badges: ["Posting", "Analytics"], supportLevel: "full", oauth: true },
  telegram: { badges: ["Posting", "Limited API"], supportLevel: "limited", oauth: false },
  discord: { badges: ["Posting", "Messaging", "Limited API"], supportLevel: "limited", oauth: true },
  googleBusiness: { badges: ["Posting", "Analytics"], supportLevel: "full", oauth: true },
};
