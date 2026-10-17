import wordmark from "@/assets/brand/wordmark-light.svg";
import AppNavigation from "@/components/layout/AppNavigation.jsx";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-[1000] border-b-2 border-ink bg-paper/90 backdrop-blur">
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-6">
        <a href="#home" className="shrink-0" aria-label="getdeveloper, back to top">
          <img src={wordmark} alt="get<developer/>" className="h-6 w-auto sm:h-7" />
        </a>
        <AppNavigation />
      </div>
    </header>
  );
}
