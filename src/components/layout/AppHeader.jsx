import wordmarkForLight from "@/assets/brand/wordmark-light.svg";
import wordmarkForDark from "@/assets/brand/wordmark-dark.svg";
import AppNavigation from "@/components/layout/AppNavigation.jsx";
import ThemeToggle from "@/components/theme/ThemeToggle.jsx";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-[1000] border-b-2 border-ink bg-paper/90 backdrop-blur">
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-6">
        <a href="#home" className="shrink-0" aria-label="getdeveloper, back to top">
          <img src={wordmarkForLight} alt="get<developer/>" className="h-6 w-auto dark:hidden sm:h-7" />
          <img src={wordmarkForDark} alt="get<developer/>" className="hidden h-6 w-auto dark:block sm:h-7" />
        </a>
        <div className="flex items-center gap-3 md:gap-6">
          <AppNavigation />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
