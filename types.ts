
export interface Profile {
  name: string;
  title: string;
  bio: string;
  photo_url: string;
  email: string;
  github: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface PortfolioData {
  profile: Profile;
  experience: Experience[];
  skills: string[];
  projects: Project[];
  education: Education[];
}
