/** My Era Rx brand tokens — match reference/myera-app-design (3).html */
/**
 * Page background green. The ONE place to change it once the client confirms the exact shade.
 * Currently Deep Teal.
 */
const background = '#0F3D46';
/** Aged Ivory — buttons, active nav pill, text on green. */
const beige = '#EDE3D5';

export const colors = {
  /** Page background on every screen (green). */
  background,
  /** Buttons and active pill (beige). */
  beige,
  /** Dark label colour on beige buttons (7:1+ on beige). */
  onBeige: '#0F3D46',
  /** Titles / labels directly on the green background (beige, 9:1+ on Deep Teal). */
  onBg: beige,
  /** Helper text on green; stays above 4.5:1 on Deep Teal. */
  onBgMuted: '#CFC4B4',
  /** Hairlines / inactive fills on green. */
  onBgLine: 'rgba(237,227,213,0.28)',
  sand: background,
  sandDeep: '#E2D5C3',
  card: '#FFFFFF',
  pine: '#0F3D46',
  pineDeep: '#0A2C33',
  pineSoft: '#4E6E65',
  sage: '#C9D6D0',
  sageSoft: '#E1E9E5',
  gold: '#C49A8A',
  roseDeep: '#9C6E5E',
  ink: '#1F1F26',
  muted: '#6A6862',
  line: '#DDD0BE',
  danger: '#A4433A',
  softRose: '#F3E7E1',
  chartGrid: '#EFE6DA',
  black: '#000000',
  white: '#FFFFFF',
  /** Profile setup (Image 1) */
  setupBg: background,
  setupSurface: '#FFFFFF',
  setupInk: '#12211C',
  setupMuted: '#5F6E68',
  setupLabel: '#7C8884',
  setupAccent: '#17453A',
  /** Today tab (Image 1) */
  todayBg: background,
  todayCard: '#FFFFFF',
  todayInk: '#14251F',
  todayMuted: '#6C7A72',
  todayHero: '#1B4B3F',
  todayAccent: '#17453A',
  todayRingTrack: '#2E6152',
  todayRingArc: '#D5E6D8',
  todayMintMuted: '#A9C6B8',
  todayCream: beige,
  todayPillBg: '#DEE9DA',
  todayPillText: '#1E4B3F',
  todayBarTrack: '#E6DFD2',
  todayGold: '#D9A441',
  /** Dose screen (Image 1) */
  dosePillBg: '#E8EDE0',
  dosePillText: '#1E4B3F',
  doseAmber: '#C9963F',
  doseRail: '#E2DACB',
  doseHollow: '#CFC7B7',
  doseBorder: '#DCD5C7',
  /** Food tab (Image 1) */
  foodAccent: '#1F4A3D',
  foodGold: '#C99A4A',
  foodTrack: '#EDE5D6',
  foodDivider: '#EDE6D8',
  foodTodayPill: '#DEE9DA',
  /** Add-to-meal search modal (Image 1) */
  mealAddBackdrop: background,
  mealAddInk: '#14251F',
  mealAddMuted: '#6C7A72',
  mealAddAccent: '#1B4B3F',
  mealAddListBg: '#F2F5F1',
  mealAddHairline: '#DDE4DC',
  mealAddTile: '#F5F1E5',
  mealAddStepper: '#F0EADB',
  mealAddGrabber: '#E4DFD3',
  mealAddSheet: '#FFFFFF',
  /** Community feed (Image 1) */
  communityBg: background,
  communityCard: '#FFFFFF',
  communityInk: '#14251F',
  communityMuted: '#6C7A72',
  communityAccent: '#1B4B3F',
  communityMilestoneBg: '#DCE7DD',
  communityMilestoneInk: '#2B4A3F',
  communityCommentBg: '#F4F0E4',
  /** Report post bottom sheet (Image 1) */
  reportSheet: '#FFFFFF',
  reportGrabber: '#D9D5C8',
  reportInk: '#14251F',
  reportMuted: '#6C7A72',
  reportDivider: '#E7E1D2',
  reportBorder: '#D6D2C6',
} as const;

/** Branding PDF primary = Lora. Design HTML: Lora titles, Jost subheads, DM Sans body.
 * Use displayMedium / displaySemiBold on RN web — fontWeight on `Lora` alone often falls back to sans. */
export const fonts = {
  display: 'Lora',
  displayMedium: 'Lora_500Medium',
  displaySemiBold: 'Lora_600SemiBold',
  displayItalic: 'LoraItalic',
  sub: 'Jost',
  body: 'DMSans',
} as const;

export const radii = {
  card: 20,
  button: 14,
  buttonSm: 11,
  field: 14,
  chip: 99,
  iconBtn: 12,
  tabBar: 34,
} as const;
