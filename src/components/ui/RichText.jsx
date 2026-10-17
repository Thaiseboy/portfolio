import { PortableText } from "@portabletext/react";

const isExternal = (href = "") => /^https?:\/\//.test(href);

// Renders Sanity rich text; colours follow the surrounding card (currentColor).
const components = {
  block: {
    normal: ({ children }) => <p className="m-0">{children}</p>,
    h3: ({ children }) => (
      <h4 className="m-0 mt-2 text-lg font-bold uppercase leading-tight">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="m-0 mt-1 font-mono text-xs font-bold uppercase tracking-wider text-accent">
        {children}
      </h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="m-0 border-l-4 border-accent pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="m-0 list-none space-y-1.5 p-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="m-0 list-decimal space-y-1.5 pl-5 marker:font-mono marker:text-accent">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3">
        <span
          aria-hidden="true"
          className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-accent"
        />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="bg-accent/15 px-1 py-0.5 font-mono text-[0.85em]">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="font-bold text-accent underline underline-offset-4"
        {...(isExternal(value?.href)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    ),
  },
  types: {
    code: ({ value }) => (
      <figure className="m-0 overflow-hidden border-2 border-current bg-night text-white">
        {(value.filename || value.language) && (
          <figcaption className="flex justify-between gap-4 border-b-2 border-white/15 px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-white/60">
            <span>{value.filename}</span>
            <span>{value.language}</span>
          </figcaption>
        )}
        <pre className="m-0 overflow-x-auto p-3 font-mono text-xs leading-relaxed">
          <code>{value.code}</code>
        </pre>
      </figure>
    ),
  },
};

export default function RichText({ value, className = "" }) {
  if (!value) return null;

  // Descriptions saved before the switch to rich text are plain strings.
  if (typeof value === "string") {
    return (
      <div className={`space-y-4 ${className}`}>
        {value
          .split(/\n+/)
          .filter((line) => line.trim())
          .map((line, index) => (
            <p key={index} className="m-0">
              {line.trim()}
            </p>
          ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
