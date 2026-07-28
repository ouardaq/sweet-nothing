export function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="pixel-text text-[18px] text-primary-d">{value}</div>
      <div className="mt-1.5 text-[13px] font-semibold">{label}</div>
    </div>
  );
}
