// Endless ticker; the list is rendered twice so the loop has no gap.
export default function Marquee({ items, className = "" }) {
  const loop = [...items, ...items];

  return (
    <div className={`overflow-hidden border-y-2 border-ink bg-ink py-4 text-paper ${className}`}>
      <ul className="m-0 flex w-max animate-marquee list-none gap-10 p-0 font-mono text-sm font-bold uppercase tracking-widest hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-center gap-10" aria-hidden={index >= items.length}>
            <span>{item}</span>
            <span className="text-accent">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
