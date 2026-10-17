import { useEffect, useRef, useState } from "react";

// Dark to bright: brighter pixels get denser glyphs on the dark card.
const RAMP = " .:-=+*#%@";
// Monospace glyphs are roughly 0.6 as wide as they are tall.
const GLYPH_RATIO = 0.6;

function imageToAscii(image, columns) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext?.("2d");
  if (!context) return null;

  const rows = Math.round(columns * GLYPH_RATIO * (image.height / image.width));
  canvas.width = columns;
  canvas.height = rows;
  context.drawImage(image, 0, 0, columns, rows);

  const { data } = context.getImageData(0, 0, columns, rows);
  // Transparent pixels (a cut-out photo) stay empty; the rest is contrast-stretched.
  const luminances = [];
  for (let offset = 0; offset < data.length; offset += 4) {
    luminances.push(
      data[offset + 3] < 128
        ? null
        : (0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2]) / 255,
    );
  }
  const visible = luminances.filter((value) => value !== null);
  const min = Math.min(...visible);
  const range = Math.max(...visible) - min || 1;

  const lines = [];
  for (let y = 0; y < rows; y += 1) {
    let line = "";
    for (let x = 0; x < columns; x += 1) {
      const luminance = luminances[y * columns + x];
      line += luminance === null ? " " : RAMP[1 + Math.round(((luminance - min) / range) * (RAMP.length - 2))];
    }
    lines.push(line);
  }

  return { text: lines.join("\n"), rows };
}

// A photo rendered as text; hovering "decodes" the real photo under the cursor.
export default function AsciiPortrait({ src, alt, columns = 64 }) {
  const frameRef = useRef(null);
  const [ascii, setAscii] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let isActive = true;
    const image = new window.Image();
    image.onload = () => {
      if (isActive) setAscii(imageToAscii(image, columns));
    };
    image.src = src;

    return () => {
      isActive = false;
    };
  }, [src, columns]);

  const moveLens = (event) => {
    const frame = frameRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    frame.style.setProperty("--lens-x", `${event.clientX - bounds.left}px`);
    frame.style.setProperty("--lens-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <figure className="card-brutal relative m-0 bg-night text-white shadow-brutal-accent">
      <figcaption className="flex items-center justify-between gap-4 border-b-2 border-white/15 px-4 py-3 font-mono text-[0.65rem] font-bold uppercase tracking-wider">
        <span>
          <span className="text-accent">■</span> Fig.01 — Self portrait
        </span>
        <span className="text-white/60">{ascii ? `${ascii.rows} lines` : "loading"}</span>
      </figcaption>

      <div
        ref={frameRef}
        className="ascii-frame relative cursor-crosshair overflow-hidden"
        style={{ containerType: "inline-size" }}
        onPointerMove={moveLens}
        onPointerEnter={(event) => {
          moveLens(event);
          setIsRevealed(true);
        }}
        onPointerLeave={() => setIsRevealed(false)}
        onClick={() => setIsRevealed((revealed) => !revealed)}
      >
        {ascii ? (
          <pre
            aria-hidden="true"
            className="m-0 select-none whitespace-pre p-0 font-mono leading-none text-white/80"
            style={{ fontSize: `calc(100cqw / ${columns * GLYPH_RATIO})` }}
          >
            {ascii.text}
          </pre>
        ) : (
          <div className="aspect-[3/4] w-full" />
        )}

        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-300 ease-out"
          style={{
            clipPath: ascii
              ? `circle(${isRevealed ? "90px" : "0px"} at var(--lens-x, 50%) var(--lens-y, 50%))`
              : "none",
          }}
        />
      </div>

      <div className="flex items-center justify-between border-t-2 border-white/15 px-4 py-3 font-mono text-[0.65rem] font-bold uppercase tracking-wider">
        <span className="text-white/60">Hover to decode</span>
        <span>Get_</span>
      </div>
    </figure>
  );
}
