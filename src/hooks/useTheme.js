import { useCallback, useState } from "react";
import { flushSync } from "react-dom";

const THEME_COLORS = { dark: "#0E1116", light: "#F6F7F9" };

// index.html sets data-theme before first paint; dark is the default.
const readTheme = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(readTheme);

  // Switches the theme with a circle growing from `origin` ({ x, y } in viewport px).
  const setTheme = useCallback((nextTheme, origin) => {
    const root = document.documentElement;
    const update = () => {
      applyTheme(nextTheme);
      flushSync(() => setThemeState(nextTheme));
    };
    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (shouldReduceMotion) {
      update();
      return Promise.resolve();
    }

    if (!document.startViewTransition) {
      root.classList.add("theme-fade");
      update();
      window.setTimeout(() => root.classList.remove("theme-fade"), 350);
      return Promise.resolve();
    }

    const { x, y } = origin ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = document.startViewTransition(update);

    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });

    return transition.finished.catch(() => {});
  }, []);

  return { theme, setTheme };
}
