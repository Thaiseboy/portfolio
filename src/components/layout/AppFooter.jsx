import wordmark from "@/assets/brand/wordmark-dark.svg";

export default function AppFooter() {
  return (
    <footer className="stripes-dark border-t-2 border-ink text-white">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <img src={wordmark} alt="get<developer/>" className="h-7 w-auto self-start" />
        <p className="m-0 font-mono text-xs uppercase tracking-wider text-grey-light">
          &copy; 2026 Master Supakon Karanyawad — built with <span className="text-accent-light">React</span> &amp;{" "}
          <span className="text-accent-light">Sanity</span>
        </p>
        <a href="#home" className="btn btn-ghost self-start px-4 py-2.5 md:self-auto">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
