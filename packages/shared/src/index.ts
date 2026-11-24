export * from './tokens';
export * from './types';
export * from './schemas';
export * from './doses';

export function communityForGender(
  gender: 'woman' | 'man' | 'non_binary' | 'other',
  picked?: 'women' | 'men'
): 'women' | 'men' {
  if (gender === 'woman') return 'women';
  if (gender === 'man') return 'men';
  if (!picked) {
    throw new Error('community_slug required for non_binary/other');
  }
  return picked;
}

export function inchesToFeetInches(totalInches: number): string {
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${ft}′${inches}″`;
}

export function lbToKg(lb: number): number {
  return Math.round(lb * 0.45359237 * 10) / 10;
}

export function kgToLb(kg: number): number {
  return Math.round(kg / 0.45359237 * 10) / 10;
}

export function inToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

export function cmToIn(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function formatWeightLb(lb: number | null | undefined, units: 'lb_in' | 'kg_cm' = 'lb_in'): string {
  if (lb == null || !Number.isFinite(Number(lb))) return '—';
  const n = Number(lb);
  if (units === 'kg_cm') return `${lbToKg(n)} kg`;
  return `${n} lb`;
}

export function formatHeightIn(inches: number | null | undefined, units: 'lb_in' | 'kg_cm' = 'lb_in'): string {
  if (inches == null || !Number.isFinite(Number(inches))) return '—';
  const n = Number(inches);
  if (units === 'kg_cm') return `${inToCm(n)} cm`;
  return inchesToFeetInches(n);
}

export function weightUnitLabel(units: 'lb_in' | 'kg_cm' = 'lb_in'): string {
  return units === 'kg_cm' ? 'kg' : 'lb';
}

export function heightUnitLabel(units: 'lb_in' | 'kg_cm' = 'lb_in'): string {
  return units === 'kg_cm' ? 'cm' : 'in';
}

export function greetingForHour(hour: number, firstName: string): string {
  const name = firstName || 'there';
  if (hour < 12) return `Morning, ${name}`;
  if (hour < 17) return `Afternoon, ${name}`;
  return `Evening, ${name}`;
}

export function weekNumberSince(startIso: string, now = new Date()): number {
  const start = new Date(startIso);
  const diffMs = now.getTime() - start.getTime();
  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, weeks);
}

export const DEFAULT_CALORIE_GOAL = 1600;

export const REPORT_REASON_LABELS: Record<
  'spam' | 'harassment' | 'unsafe_medical' | 'inappropriate_photo' | 'other',
  string
> = {
  spam: 'Spam or selling',
  harassment: 'Harassment or bullying',
  unsafe_medical: 'Unsafe medical advice',
  inappropriate_photo: 'Nudity or inappropriate photo',
  other: 'Something else',
};
