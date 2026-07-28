export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div>
      {eyebrow && (
        <div className="pixel-text mb-3 text-[9px] tracking-[1px] text-primary-d">
          {eyebrow}
        </div>
      )}
      <h2 className="pixel-text text-[22px]">{title}</h2>
    </div>
  );
}
