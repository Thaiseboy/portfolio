import { useState } from "react";
import { useScrollNavigation } from "@/hooks/useScrollNavigation";

const navItems = [
  { id: "home", icon: "house-door", label: "Home" },
  { id: "about", icon: "person", label: "About" },
  { id: "skills", icon: "tools", label: "Skills" },
  { id: "project", icon: "folder2-open", label: "Project" },
  { id: "contact", icon: "envelope", label: "Contact" },
];

const sectionIds = navItems.map((item) => item.id);

export default function AppNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { goNext, goPrev } = useScrollNavigation(sectionIds);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        className={`hamburger-btn fixed top-4 left-6 z-[1001] ${isMenuOpen ? "is-open" : ""}`}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      <nav
        className={`fixed left-6 z-[1000] transition-all ${
          isMenuOpen
            ? "top-20 opacity-100 visible duration-700 ease-out"
            : "-top-10 opacity-0 invisible duration-500 ease-in"
        }`}
      >
        <ul className="flex justify-center items-center list-none m-0 p-0 gap-4 md:gap-3 sm:gap-2.5">
          {navItems.map((item, index) => (
            <li
              key={item.id}
              className={`nav-item ${isMenuOpen ? "nav-item-show" : ""}`}
              style={{
                transitionDelay: isMenuOpen ? `${index * 0.08}s` : "0s",
                animationDelay: isMenuOpen ? `${index * 0.08}s` : "0s",
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <a className="nav-link nav-link-icon" href={`#${item.id}`} aria-label={item.label}>
                <i className={`bi bi-${item.icon} nav-icon`} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 max-[640px]:right-4 max-[640px]:bottom-4">
        <button type="button" onClick={goPrev} className="btn-scroll-glass" aria-label="Previous section">
          <i className="bi bi-chevron-up text-2xl" />
        </button>
        <button type="button" onClick={goNext} className="btn-scroll-glass" aria-label="Next section">
          <i className="bi bi-chevron-down text-2xl" />
        </button>
      </div>
    </>
  );
}
