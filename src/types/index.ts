export interface Photo {
  title: string;
  url: string;
}

export interface Skill {
  _id: string;
  title: string;
  imageUrl: string;
  skillLevel: number;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
}

export interface Contact {
  pdfUrl: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}