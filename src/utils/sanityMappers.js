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
  _id: skill._id,
  name: skill.name,
  logoUrl: skill.imageUrl,
  level: levelLabels[skill.level] || "Intermediate",
});

export const normalizeProject = (project) => ({
  _id: project._id,
  title: project.title,
  description: project.description,
  image: project.imageUrl,
  url: project.url ?? "",
  github: project.github ?? "",
});
