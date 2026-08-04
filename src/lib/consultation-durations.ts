export const consultationDurations = [30, 60, 90, 120, 150, 180, 210, 240] as const;

export function consultationEndFromDuration(start: string, duration: string): string | null {
  const minutes = Number(duration);
  const startDate = new Date(start);
  if (
    Number.isNaN(startDate.getTime()) ||
    !consultationDurations.some((value) => value === minutes)
  )
    return null;
  return new Date(startDate.getTime() + minutes * 60_000).toISOString();
}
