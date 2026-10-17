import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useScrollNavigation } from "@/hooks/useScrollNavigation";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "project", label: "Projects" },
];

const sectionIds = [...navItems.map((item) => item.id), "contact"];

export default function AppNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentIndex } = useScrollNavigation(sectionIds, { threshold: 0.35 });
  const activeId = sectionIds[currentIndex];

  return (
    <>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${activeId === item.id ? "is-active" : ""}`}
          >
            {item.label}
          </a>
        ))}
        <a href="#contact" className="btn btn-accent px-4 py-2.5">
          Get in touch
        </a>
      </nav>

      <button
        type="button"
        className="btn btn-ghost px-3 py-2 md:hidden"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? "Close" : "Menu"}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            className="absolute inset-x-0 top-full border-b-2 border-ink bg-paper md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="container m-0 flex list-none flex-col gap-1 py-6">
              {[...navItems, { id: "contact", label: "Contact" }].map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.05 }}
                >
                  <a
                    href={`#${item.id}`}
                    className="flex items-baseline gap-4 py-2 text-3xl font-bold uppercase text-ink no-underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-mono text-xs text-accent">0{index + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
