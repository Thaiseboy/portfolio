import Reveal from "@/components/motion/Reveal.jsx";
import ScrambleText from "@/components/motion/ScrambleText.jsx";

export default function SectionHeader({ index, eyebrow, title, intro }) {
  return (
    <Reveal className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_minmax(0,22rem)] md:items-end">
      <div>
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-grey">
          <span className="text-accent">{index} /</span> {eyebrow}
        </p>
        <ScrambleText as="h2" text={title} className="section-heading m-0" />
      </div>
      {intro && (
        <p className="m-0 text-base leading-relaxed text-grey md:text-right">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
