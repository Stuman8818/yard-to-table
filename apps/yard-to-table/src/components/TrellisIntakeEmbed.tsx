const defaultTrellisUrl = "http://localhost:3000";

export function TrellisIntakeEmbed() {
  const trellisUrl = (process.env.NEXT_PUBLIC_TRELLIS_URL ?? defaultTrellisUrl).replace(/\/$/, "");
  const intakeUrl = `${trellisUrl}/embed/intake`;

  return (
    <iframe
      src={intakeUrl}
      title="Request Yard To Table landscaping service"
      className="h-[1450px] w-full rounded-2xl border border-[#d5ded2] bg-[#f3f5ef] shadow-[0_20px_60px_rgba(32,59,49,0.09)] sm:h-[1080px]"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-forms allow-same-origin allow-scripts"
    />
  );
}
