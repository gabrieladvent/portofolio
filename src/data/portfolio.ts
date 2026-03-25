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
  category: "frontend" | "backend" | "mobile" | "tools" | "other";
  icon: string;
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

export const personalInfo = {
  name: "Gabriel Advent",
  title: "Full Stack Developer",
  bio: `Experienced web developer with 2+ years of experience, primarily focused on PHP using Laravel and CodeIgniter. 
        Proficient in building scalable backend systems and familiar with modern technologies such as React, TypeScript, Golang, and Node.js. 
        Committed to writing clean, maintainable code and delivering high-quality web solutions.`,
  email: "bie.ritan112@gmail.com",
  location: "Yogyakarta, Indonesia",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  resumeUrl: "public/Resume.pdf",
};

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/gabrieladvent",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/gabriel-advent",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/gab_adv",
    icon: "instagram",
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: "HTML", category: "frontend", icon: "html" },
  { name: "CSS", category: "frontend", icon: "css" },
  { name: "JavaScript", category: "frontend", icon: "js" },
  { name: "TypeScript", category: "frontend", icon: "ts" },
  { name: "React", category: "frontend", icon: "react" },
  { name: "Next.js", category: "frontend", icon: "nextjs" },
  { name: "Tailwind CSS", category: "frontend", icon: "tailwind" },
  { name: "Bootstrap", category: "frontend", icon: "bootstrap" },
  { name: "Framer Motion", category: "frontend", icon: "react" },
  { name: "jQuery", category: "frontend", icon: "jquery" },

  // Backend
  { name: "PHP", category: "backend", icon: "php" },
  { name: "Laravel", category: "backend", icon: "laravel" },
  { name: "CodeIgniter 4", category: "backend", icon: "php" },
  { name: "Node.js", category: "backend", icon: "nodejs" },
  { name: "Golang", category: "backend", icon: "go" },
  { name: "PostgreSQL", category: "backend", icon: "postgres" },
  { name: "MySQL", category: "backend", icon: "mysql" },
  { name: "Redis", category: "backend", icon: "redis" },
  { name: "Firebase", category: "backend", icon: "firebase" },
  { name: "WordPress", category: "backend", icon: "wordpress" },

  // Mobile
  { name: "Flutter", category: "mobile", icon: "flutter" },
  { name: "Dart", category: "mobile", icon: "dart" },
  { name: "Kotlin", category: "mobile", icon: "kotlin" },

  // DevOps & Tools
  { name: "Git", category: "tools", icon: "git" },
  { name: "GitHub", category: "tools", icon: "github" },
  { name: "GitHub Actions", category: "tools", icon: "githubactions" },
  { name: "Docker", category: "tools", icon: "docker" },
  { name: "Linux", category: "tools", icon: "linux" },
  { name: "AWS", category: "tools", icon: "aws" },
  { name: "Grafana", category: "tools", icon: "grafana" },
  { name: "Postman", category: "tools", icon: "postman" },
  { name: "VS Code", category: "tools", icon: "vscode" },
  { name: "Android Studio", category: "tools", icon: "androidstudio" },
];

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

export const experiences: Experience[] = [
  {
    id: "fullstack-dev",
    company: "PT. Sahabat Inovasi Teknologi (Konnco Studio)",
    position: "Middle Full Stack Developer",
    startDate: "2025-05",
    endDate: "Present",
    description: `Middle Full Stack Developer at Konnco Studio, responsible for frontend and backend development of web and mobile applications, 
                including feature implementation, system maintenance, bug fixing, and payment gateway integration. 
                Actively collaborate with cross-functional teams to deliver scalable, secure, and client-oriented solutions.`,
    technologies: [
      "React",
      "PHP",
      "Golang",
      "Node.js",
      "PostgreSQL",
      "MySQL",
      "Redis",
    ],
  },
  {
    id: "fullstack-dev",
    company: "PT. Bintang Utara Nusantara (Vega)",
    position: "Full Stack Developer",
    startDate: "2023-11",
    endDate: "2025-05",
    description: `Full Stack Developer with cross-functional IT responsibilities, including internal web application development using CodeIgniter 4, 
                server procurement and configuration, deployment, and system maintenance. 
                Also handled IT support, DevOps-related tasks, and served as a technical point of contact for internal systems, 
                gaining strong exposure to enterprise IT operations.`,
    technologies: [
      "CodeIgniter 4",
      "JavaScript",
      "Figma",
      "Bootstrap",
      "MySQL",
      "Grafana",
    ],
  },
  {
    id: "fullstack-dev",
    company: "Yayasan Kanisius Cabang Yogyakarta",
    position: "Lead Full Stack Developer (Internship)",
    startDate: "2023-06",
    endDate: "2023-08",
    description: `Lead Full Stack Developer Intern responsible for leading a small development team to build an internal web application 
                connecting foundation schools with the central office. 
                Handled task coordination, code reviews, and contributed to both frontend and backend development, 
                strengthening leadership, communication, and collaboration skills.`,
    technologies: ["Laravel", "JavaScript", "Figma", "Bootstrap", "MySQL"],
  },
];

export const apiConfig = {
  github: {
    username: import.meta.env.VITE_GITHUB_USERNAME || "johndoe",
    token: import.meta.env.VITE_GITHUB_TOKEN || "",
  },
  wakatime: {
    apiKey: import.meta.env.WAKATIME_API_KEY || "",
  },
};

export const siteConfig = {
  title: "Gabriel Advent | Portfolio",
  description: "Full Stack Developer specializing in modern web technologies",
  keywords: [
    "developer",
    "portfolio",
    "react",
    "typescript",
    "fullstack",
    "laravel",
    "golang",
  ],
  ogImage: "/og-image.png",
  themeColor: "#0a0a0a",
};
