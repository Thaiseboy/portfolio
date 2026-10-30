import { toPlainText } from "@portabletext/react";
import { ABOUT_DEFAULTS } from "../../studio/shared/aboutDefaults.js";

const levelLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const levelRanks = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export const getInitials = (name) => {
  if (!name) return "?";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const normalizePhoto = (photo, index) => ({
  id: photo._id || index,
  url: photo.imageUrl,
  title: photo.title || `Photo ${index + 1}`,
});

// Without a published document the default texts show; the optional label and highlight may be
// left empty on purpose, so only the required fields fall back.
export const normalizeAbout = (about) =>
  about
    ? {
        title: about.title || ABOUT_DEFAULTS.title,
        tagline: about.tagline ?? "",
        heading: about.heading || ABOUT_DEFAULTS.heading,
        highlight: about.highlight ?? "",
        body: about.body?.length ? about.body : ABOUT_DEFAULTS.body,
      }
    : ABOUT_DEFAULTS;

export const normalizeSkill = (skill) => ({
  _id: skill._id,
  name: skill.name,
  logoUrl: skill.imageUrl,
  level: levelLabels[skill.level] || "Intermediate",
  levelRank: levelRanks[skill.level] || 2,
});

// Descriptions are rich text now; older ones are still plain strings.
const descriptionText = (description) => {
  if (!description) return "";
  return typeof description === "string"
    ? description
    : toPlainText(description);
};

export const normalizeProject = (project) => ({
  _id: project._id,
  title: project.title,
  description: project.description ?? null,
  excerpt: descriptionText(project.description),
  tags: project.tags ?? [],
  image: project.imageUrl,
  imageAlt: project.imageAlt ?? "",
  url: project.url ?? "",
  github: project.github ?? "",
});
