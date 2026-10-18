import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import LightModeWarning from "@/components/theme/LightModeWarning.jsx";

const centerOf = (element) => {
  const bounds = element.getBoundingClientRect();
  return {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2,
  };
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const isDark = theme === "dark";

  const toggleTheme = (event) => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme, centerOf(event.currentTarget)).then(() => {
      if (nextTheme === "light") setIsWarningOpen(true);
    });
  };

  const backToDark = () => {
    setIsWarningOpen(false);
    setTheme("dark");
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost h-10 w-10 shrink-0 p-0"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
        onClick={toggleTheme}
      >
        <i
          className={`bi bi-${isDark ? "sun" : "moon-stars"} text-base`}
          aria-hidden="true"
        />
      </button>

      <LightModeWarning
        isOpen={isWarningOpen}
        onBackToDark={backToDark}
        onStayLight={() => setIsWarningOpen(false)}
      />
    </>
  );
}
