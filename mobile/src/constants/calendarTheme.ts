import { COLORS } from "./theme";

// Backward-compatible alias so existing calendar files (built before
// theme.ts was updated) keep working without edits.
export const CAL_COLORS = {
  primary: COLORS.primary,
  primaryDark: COLORS.primaryDark,
  primaryHover: COLORS.primaryHover,
  primaryDeep: COLORS.primaryDeep,
   gradientStart: COLORS.gradientStart,   // add this
  gradientEnd: COLORS.gradientEnd,       // add this

  marigold: COLORS.marigold,
  marigoldBright: COLORS.marigoldBright,
  borderYellowSoft: COLORS.borderYellowSoft,
  borderYellowPale: COLORS.borderYellowPale,
  yellowHover: COLORS.yellowHover,
  bgMarigoldLight: COLORS.warningLight,
  panelCreamYellow: COLORS.panelCreamYellow,
  gradientBg: COLORS.gradientBg,

  ivoryBg: COLORS.background,
  ivoryBgLight: COLORS.surface,
  headerWhite: COLORS.headerWhite,

  pinkIconBg: COLORS.primaryLight,
  pinkHover: COLORS.pinkHover,

  headingPlum: COLORS.textHeading,
  supportPlum: COLORS.textSupportHeading,
  navText: COLORS.textNav,
  bodyRose: COLORS.textMuted,
  supportText: COLORS.textLight,
  baseText: COLORS.text,

  peachBorder: COLORS.border,
  paleDivider: COLORS.borderDivider,
  emptyStateBorder: COLORS.borderEmptyState,
  hoverDeep: COLORS.hoverDeep,

  available: COLORS.success,
  blocked: COLORS.danger,
  white: "#ffffff",
};