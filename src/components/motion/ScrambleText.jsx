import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// "Decodes" text from random glyphs to the real characters when it scrolls into view.
export default function ScrambleText({ text, as: Tag = "span", className = "", delay = 0, duration = 900 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      setOutput(text);
      return undefined;
    }

    let frame;
    let start;

    const tick = (now) => {
      start ??= now + delay;
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      const revealed = Math.floor(progress * text.length);

      setOutput(
        Array.from(text)
          .map((char, index) =>
            index < revealed || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );

      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isInView, shouldReduceMotion, text, delay, duration]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </Tag>
  );
}
