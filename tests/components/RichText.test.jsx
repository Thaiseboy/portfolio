import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RichText from "@/components/ui/RichText.jsx";

const span = (key, text, marks = []) => ({
  _type: "span",
  _key: key,
  text,
  marks,
});

describe("RichText", () => {
  it("renders paragraphs, bullet lists, links and code blocks", () => {
    const value = [
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        markDefs: [],
        children: [span("s1", "Intro paragraph.")],
      },
      {
        _type: "block",
        _key: "h1",
        style: "h3",
        markDefs: [],
        children: [span("s2", "Stack")],
      },
      {
        _type: "block",
        _key: "l1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [span("s3", "React")],
      },
      {
        _type: "block",
        _key: "l2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [span("s4", "Laravel")],
      },
      {
        _type: "block",
        _key: "p2",
        style: "normal",
        markDefs: [
          { _type: "link", _key: "m1", href: "https://getdeveloper.nl" },
        ],
        children: [span("s5", "Visit the site", ["m1"])],
      },
      {
        _type: "code",
        _key: "c1",
        language: "tsx",
        filename: "App.tsx",
        code: "const a = 1;",
      },
    ];

    render(<RichText value={value} />);

    expect(screen.getByText("Intro paragraph.").tagName).toBe("P");
    expect(screen.getByText("Stack").tagName).toBe("H4");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Visit the site" }),
    ).toHaveAttribute("target", "_blank");
    expect(screen.getByText("const a = 1;").closest("pre")).toBeInTheDocument();
    expect(screen.getByText("App.tsx")).toBeInTheDocument();
  });

  it("still renders old plain-text descriptions line by line", () => {
    render(<RichText value={"First line\nSecond line"} />);

    expect(screen.getByText("First line").tagName).toBe("P");
    expect(screen.getByText("Second line").tagName).toBe("P");
  });
});
