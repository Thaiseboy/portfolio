import { describe, expect, it } from "vitest";
import {
  getInitials,
  normalizePhoto,
  normalizeProject,
  normalizeSkill,
} from "@/utils/sanityMappers";

describe("Sanity mappers", () => {
  it("normalizes photos", () => {
    expect(
      normalizePhoto({ _id: "1", imageUrl: "photo.jpg", title: "Me" }, 0),
    ).toEqual({
      id: "1",
      url: "photo.jpg",
      title: "Me",
    });
  });

  it("normalizes skills", () => {
    expect(
      normalizeSkill({
        _id: "1",
        name: "React",
        imageUrl: "react.svg",
        level: "advanced",
        unusedField: "ignored",
      }),
    ).toEqual({
      _id: "1",
      name: "React",
      logoUrl: "react.svg",
      level: "Advanced",
      levelRank: 3,
    });
  });

  it("normalizes projects", () => {
    expect(
      normalizeProject({
        _id: "1",
        title: "App",
        description: "Project description",
        imageUrl: "app.jpg",
        url: null,
        github: null,
        unusedField: "ignored",
      }),
    ).toEqual({
      _id: "1",
      title: "App",
      description: "Project description",
      excerpt: "Project description",
      tags: [],
      image: "app.jpg",
      imageAlt: "",
      url: "",
      github: "",
    });
  });

  it("turns rich text project descriptions into a plain excerpt", () => {
    const description = [
      { _type: "block", _key: "a", style: "normal", markDefs: [], children: [{ _type: "span", _key: "a1", text: "First paragraph.", marks: [] }] },
      { _type: "block", _key: "b", style: "normal", markDefs: [], children: [{ _type: "span", _key: "b1", text: "Second one.", marks: [] }] },
    ];

    const project = normalizeProject({ _id: "2", title: "Rich", description, tags: ["React"] });

    expect(project.description).toBe(description);
    expect(project.excerpt).toBe("First paragraph.\n\nSecond one.");
    expect(project.tags).toEqual(["React"]);
  });

  it("gets initials", () => {
    expect(getInitials("Zend Framework")).toBe("ZF");
    expect(getInitials("")).toBe("?");
  });
});
