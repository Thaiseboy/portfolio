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
      image: "app.jpg",
      url: "",
      github: "",
    });
  });

  it("gets initials", () => {
    expect(getInitials("Zend Framework")).toBe("ZF");
    expect(getInitials("")).toBe("?");
  });
});
