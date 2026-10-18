import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import icon from "@/assets/brand/icon-dark.svg";

const BUG_COUNT = 12;

// Bugs start off-screen and settle in a ring around the dialog, "attracted to the light".
function createBugs() {
  const far = Math.max(window.innerWidth, window.innerHeight) * 0.75;

  return Array.from({ length: BUG_COUNT }, (_, index) => {
    const startAngle = Math.random() * Math.PI * 2;
    const ringAngle = (index / BUG_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const ring = 200 + Math.random() * 120;
    const start = {
      x: Math.cos(startAngle) * far,
      y: Math.sin(startAngle) * far,
    };
    // Keep the ring on screen on narrow viewports.
    const end = {
      x: Math.cos(ringAngle) * Math.min(ring * 1.3, window.innerWidth / 2 - 24),
      y: Math.sin(ringAngle) * Math.min(ring, window.innerHeight / 2 - 24),
    };
    // A wobbly halfway point so the flight path is not a straight line.
    const mid = {
      x: (start.x + end.x) / 2 + (Math.random() - 0.5) * 220,
      y: (start.y + end.y) / 2 + (Math.random() - 0.5) * 220,
    };
    // The icon points up, so rotate it along its flight direction.
    const heading =
      (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI + 90;

    return {
      id: index,
      start,
      mid,
      end,
      heading,
      delay: Math.random() * 0.6,
      buzz: 0.5 + Math.random() * 0.6,
      size: 18 + Math.random() * 14,
    };
  });
}

function Bug({ bug }) {
  return (
    <motion.span
      className="absolute left-0 top-0 text-ink"
      style={{ fontSize: bug.size }}
      initial={{
        x: bug.start.x,
        y: bug.start.y,
        rotate: bug.heading,
        opacity: 0,
      }}
      animate={{
        x: [bug.start.x, bug.mid.x, bug.end.x],
        y: [bug.start.y, bug.mid.y, bug.end.y],
        opacity: 1,
      }}
      exit={{
        x: bug.start.x,
        y: bug.start.y,
        opacity: 0,
        transition: { duration: 0.6, ease: "easeIn" },
      }}
      transition={{ duration: 1.6, delay: bug.delay, ease: "easeOut" }}
    >
      {/* Buzzing in place once it has arrived. */}
      <motion.i
        className="bi bi-bug-fill block"
        animate={{
          x: [0, 6, -5, 3, 0],
          y: [0, -5, 4, -3, 0],
          rotate: [0, 12, -10, 8, 0],
        }}
        transition={{
          duration: bug.buzz,
          repeat: Infinity,
          ease: "easeInOut",
          delay: bug.delay + 1.6,
        }}
      />
    </motion.span>
  );
}

export default function LightModeWarning({
  isOpen,
  onBackToDark,
  onStayLight,
}) {
  const shouldReduceMotion = useReducedMotion();
  // New flight paths every time the warning opens.
  const bugs = useMemo(
    () => (isOpen && !shouldReduceMotion ? createBugs() : []),
    [isOpen, shouldReduceMotion],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onStayLight();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onStayLight]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="light-mode-warning"
          className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
        >
          {/* The "light" the bugs fly to. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/40"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgb(var(--c-paper)) 0, transparent 55%)",
            }}
            onClick={onStayLight}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-10"
          >
            <AnimatePresence propagate>
              {bugs.map((bug) => (
                <Bug key={bug.id} bug={bug} />
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="light-mode-warning-title"
            aria-describedby="light-mode-warning-text"
            className="card-brutal relative w-full max-w-md p-6 shadow-brutal-accent md:p-8"
            initial={{ scale: 0.6, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: [-6, 4, -3, 2, 0], opacity: 1 }}
            exit={{
              scale: 0.8,
              rotate: 4,
              opacity: 0,
              transition: { duration: 0.25 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <motion.div
                className="relative shrink-0"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                  repeat: Infinity,
                  repeatDelay: 2.4,
                }}
              >
                <img src={icon} alt="" className="h-14 w-14" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center border-2 border-ink bg-accent text-sm font-bold text-on-accent">
                  !
                </span>
              </motion.div>
              <p className="tag m-0">⚠ Warning</p>
            </div>

            <h2
              id="light-mode-warning-title"
              className="mb-4 mt-0 text-[clamp(1.75rem,6vw,2.5rem)] font-bold uppercase leading-[0.95] tracking-tight"
            >
              Light mode attracts <span className="text-accent">bugs</span>
            </h2>
            <p
              id="light-mode-warning-text"
              className="mb-6 mt-0 leading-relaxed text-grey"
            >
              Every developer knows it: bugs love the light. Please switch back
              to dark mode, it&apos;s safer for everyone&apos;s code.
            </p>

            {bugs.length > 0 && (
              <p className="mb-6 mt-0 font-mono text-xs font-bold uppercase tracking-wider text-accent">
                <span className="animate-blink">●</span> {bugs.length} bugs
                detected
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-accent"
                onClick={onBackToDark}
                autoFocus
              >
                <i className="bi bi-moon-stars" aria-hidden="true" /> Back to
                dark mode
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onStayLight}
              >
                I&apos;ll take the risk
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
