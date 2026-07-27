const COLS = [
  { title: 'Shop', items: ['All treats', 'Mochi', 'Pancakes', 'Pastries'] },
  {
    title: 'Hours',
    items: ['Mon–Fri · 7–6', 'Sat · 8–7', 'Sun · 9–4', 'Pickup & delivery'],
  },
  {
    title: 'Visit',
    items: ['12 Blossom Lane', 'Pixel Town', '☎ 555-MOCHI', '@sweetnothing'],
  },
];

export function Footer() {
  return (
    <footer className="mt-[60px]">
      <div className="checker" />
      <div className="bg-ink px-6 py-9 text-bg">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-start gap-10">
          <div className="max-w-[280px]">
            <div className="pixel-text mb-3 text-[18px]">
              Sweet<span className="text-primary">Nothing</span>
            </div>
            <p className="text-[14px] leading-[1.7] opacity-80">
              A tiny pixel bakery making fresh mochi, dorayaki &amp; taiyaki
              every morning. Baked with love, served warm.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="pixel-text mb-3.5 text-[10px] text-primary">
                {col.title}
              </div>
              <ul className="flex list-none flex-col gap-2.5 p-0">
                {col.items.map((item) => (
                  <li key={item} className="text-[14px] opacity-85">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-7 w-full max-w-[1180px] border-t-2 border-dashed border-white/25 pt-[18px] text-[12px] opacity-60">
          © 2026 Sweet Nothing · Made with 🍓 &amp; pixels
        </div>
      </div>
    </footer>
  );
}
