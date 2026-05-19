const levelLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
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

export const normalizeSkill = (skill) => ({
  ...skill,
  logoUrl: skill.imageUrl,
  level: levelLabels[skill.level] || "Intermediate",
});

export const normalizeProject = (project) => ({
  ...project,
  image: project.imageUrl,
  url: project.url === null || project.url === "null" ? "" : project.url,
  github: project.github === null || project.github === "null" ? "" : project.github,
});
