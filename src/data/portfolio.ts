// ==========================================
// PORTFOLIO DATA - Edit this file to update your portfolio
// ==========================================

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: "web" | "mobile" | "backend" | "other";
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "tools" | "other";
  icon?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | "Present";
  description: string;
  technologies: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// ==========================================
// PERSONAL INFO
// ==========================================
export const personalInfo = {
  name: "John Doe",
  title: "Full Stack Developer",
  tagline: "Building digital experiences that matter",
  bio: `Passionate developer with 5+ years of experience crafting modern web applications. 
        I specialize in React, TypeScript, and Node.js, with a keen eye for design and user experience. 
        When I'm not coding, you'll find me exploring new technologies and contributing to open-source projects.`,
  email: "hello@johndoe.dev",
  location: "Jakarta, Indonesia",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  resumeUrl: "/resume.pdf",
};

// ==========================================
// SOCIAL LINKS
// ==========================================
export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/johndoe",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/johndoe",
    icon: "linkedin",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/johndoe",
    icon: "twitter",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/johndoe",
    icon: "instagram",
  },
];

// ==========================================
// SKILLS
// ==========================================
export const skills: Skill[] = [
  // Frontend
  { name: "React", level: 95, category: "frontend" },
  { name: "TypeScript", level: 90, category: "frontend" },
  { name: "Next.js", level: 85, category: "frontend" },
  { name: "Vue.js", level: 75, category: "frontend" },
  { name: "Tailwind CSS", level: 92, category: "frontend" },
  { name: "Framer Motion", level: 80, category: "frontend" },

  // Backend
  { name: "Node.js", level: 88, category: "backend" },
  { name: "Express", level: 85, category: "backend" },
  { name: "PostgreSQL", level: 80, category: "backend" },
  { name: "MongoDB", level: 78, category: "backend" },
  { name: "GraphQL", level: 75, category: "backend" },
  { name: "Redis", level: 70, category: "backend" },

  // Tools
  { name: "Git", level: 90, category: "tools" },
  { name: "Docker", level: 75, category: "tools" },
  { name: "AWS", level: 70, category: "tools" },
  { name: "Figma", level: 80, category: "tools" },
  { name: "VS Code", level: 95, category: "tools" },
  { name: "Linux", level: 78, category: "tools" },
];

// ==========================================
// PROJECTS
// ==========================================
export const projects: Project[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management",
    longDescription: `Built a complete e-commerce solution featuring user authentication, 
                      product catalog, shopping cart, payment integration with Stripe, 
                      and an admin dashboard for inventory management.`,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
    githubUrl: "https://github.com/johndoe/ecommerce",
    liveUrl: "https://ecommerce-demo.johndoe.dev",
    featured: true,
    category: "web",
  },
  {
    id: "task-management",
    title: "Task Management App",
    description:
      "Collaborative task management with real-time updates and team features",
    longDescription: `A Trello-like task management application with drag-and-drop functionality, 
                      real-time collaboration, team workspaces, and detailed analytics.`,
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    technologies: ["Next.js", "TypeScript", "Prisma", "Socket.io", "Tailwind"],
    githubUrl: "https://github.com/johndoe/taskflow",
    liveUrl: "https://taskflow.johndoe.dev",
    featured: true,
    category: "web",
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot Platform",
    description: "Custom AI chatbot builder with natural language processing",
    longDescription: `A platform for creating custom AI chatbots with training capabilities, 
                      analytics dashboard, and integration APIs for websites and apps.`,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    technologies: ["Python", "FastAPI", "React", "OpenAI", "MongoDB"],
    githubUrl: "https://github.com/johndoe/aichat",
    featured: true,
    category: "backend",
  },
  {
    id: "fitness-tracker",
    title: "Fitness Tracker Mobile",
    description: "Cross-platform fitness tracking app with workout plans",
    longDescription: `A React Native mobile app for tracking workouts, nutrition, 
                      and progress with personalized workout plans and social features.`,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    technologies: ["React Native", "TypeScript", "Firebase", "Redux"],
    githubUrl: "https://github.com/johndoe/fittrack",
    featured: false,
    category: "mobile",
  },
  {
    id: "portfolio-generator",
    title: "Portfolio Generator",
    description: "CLI tool for generating developer portfolios from templates",
    longDescription: `A command-line tool that generates beautiful portfolio websites 
                      from YAML/JSON configuration files with multiple themes.`,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    technologies: ["Node.js", "TypeScript", "Handlebars", "CLI"],
    githubUrl: "https://github.com/johndoe/portgen",
    featured: false,
    category: "other",
  },
  {
    id: "crypto-dashboard",
    title: "Crypto Dashboard",
    description: "Real-time cryptocurrency tracking and portfolio management",
    longDescription: `A dashboard for tracking cryptocurrency prices, managing portfolios, 
                      and analyzing market trends with real-time data from multiple exchanges.`,
    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    technologies: ["Vue.js", "D3.js", "WebSocket", "Node.js"],
    githubUrl: "https://github.com/johndoe/cryptodash",
    liveUrl: "https://crypto.johndoe.dev",
    featured: false,
    category: "web",
  },
];

// ==========================================
// EXPERIENCE
// ==========================================
export const experiences: Experience[] = [
  {
    id: "senior-dev",
    company: "TechCorp Indonesia",
    position: "Senior Full Stack Developer",
    startDate: "2022-01",
    endDate: "Present",
    description: `Leading development of enterprise web applications. 
                  Mentoring junior developers and implementing best practices 
                  for code quality and performance optimization.`,
    technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
  },
  {
    id: "fullstack-dev",
    company: "StartupXYZ",
    position: "Full Stack Developer",
    startDate: "2020-06",
    endDate: "2021-12",
    description: `Developed and maintained multiple web applications for clients. 
                  Implemented CI/CD pipelines and improved deployment processes.`,
    technologies: ["Vue.js", "Express", "MongoDB", "Redis"],
  },
  {
    id: "frontend-dev",
    company: "Digital Agency",
    position: "Frontend Developer",
    startDate: "2019-01",
    endDate: "2020-05",
    description: `Created responsive web interfaces and interactive user experiences. 
                  Collaborated with designers to implement pixel-perfect designs.`,
    technologies: ["React", "SCSS", "JavaScript", "Figma"],
  },
];

// ==========================================
// API CONFIGURATION
// ==========================================
// These values are loaded from .env file
// Create .env file from .env.example and fill in your values
export const apiConfig = {
  github: {
    username: import.meta.env.VITE_GITHUB_USERNAME || "johndoe",
    token: import.meta.env.VITE_GITHUB_TOKEN || "",
  },
  wakatime: {
    apiKey: import.meta.env.VITE_WAKATIME_API_KEY || "",
  },
};

// ==========================================
// SITE CONFIGURATION
// ==========================================
export const siteConfig = {
  title: "John Doe | Portfolio",
  description: "Full Stack Developer specializing in modern web technologies",
  keywords: ["developer", "portfolio", "react", "typescript", "fullstack"],
  ogImage: "/og-image.png",
  themeColor: "#0a0a0a",
};
