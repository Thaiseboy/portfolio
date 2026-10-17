import { motion, useScroll, useSpring } from "motion/react";

// Thin red bar along the top that fills as the page scrolls.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[1100] h-1 origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
