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
  tagline:
    "I build scalable systems and usable interfaces — primarily with Laravel, React, and Go.",
  bio: `Experienced web developer with 3+ years of experience, primarily focused on PHP using Laravel and CodeIgniter.
        Proficient in building scalable systems and familiar with modern technologies such as React, TypeScript, Golang, and Node.js.
        Committed to writing clean, maintainable code and delivering high-quality web solutions.`,
  email: "bie.ritan112@gmail.com",
  location: "Yogyakarta, Indonesia",
  // Fallback when /api/github is unreachable — GitHub serves the real avatar
  // from this path, so a failed API call no longer shows a stranger's photo.
  avatar: "https://github.com/gabrieladvent.png",
  resumeUrl: "/cv-gabriel-advent-batan.pdf",
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
  { name: "JavaScript", category: "frontend", icon: "js" },
  { name: "TypeScript", category: "frontend", icon: "ts" },
  { name: "React", category: "frontend", icon: "react" },
  { name: "Next.js", category: "frontend", icon: "nextjs" },
  { name: "Tailwind CSS", category: "frontend", icon: "tailwind" },
  { name: "Framer Motion", category: "frontend", icon: "react" },

  // Backend
  { name: "PHP", category: "backend", icon: "php" },
  { name: "Laravel", category: "backend", icon: "laravel" },
  { name: "CodeIgniter 4", category: "backend", icon: "php" },
  { name: "Node.js", category: "backend", icon: "nodejs" },
  // skillicons.dev has no fastify/drizzle/bullmq slug — they render blank, so
  // each falls back to the closest icon it actually serves.
  { name: "Fastify", category: "backend", icon: "nodejs" },
  { name: "Golang", category: "backend", icon: "go" },
  { name: "PostgreSQL", category: "backend", icon: "postgres" },
  { name: "MySQL", category: "backend", icon: "mysql" },
  { name: "Drizzle ORM", category: "backend", icon: "postgres" },
  { name: "Redis", category: "backend", icon: "redis" },
  { name: "BullMQ", category: "backend", icon: "redis" },
  { name: "Solidity", category: "backend", icon: "solidity" },
  { name: "Firebase", category: "backend", icon: "firebase" },

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
];

export const projects: Project[] = [
  {
    id: "warung-agent",
    title: "WarungAgent",
    description:
      "An autonomous AI agent that runs a small shop's operations — stablecoin payments, automatic supplier restocking, and receivables tokenized as on-chain RWA for DeFi financing.",
    longDescription: `Built an AI agent that operates a neighborhood shop (warung) end to end: it accepts stablecoin payments, reorders from suppliers when stock runs low, and turns customer credit (piutang) into tokenized real-world assets that DeFi investors can finance.
    The agent reasons over live inventory — ranking restock priority by sales velocity, parsing supplier quotes from raw WhatsApp messages (tiered pricing, minimum order, availability), rejecting offers that fail policy, skipping suppliers outside the whitelist, and halting once the daily spending cap is reached, then reporting why. Every step streams to the dashboard over SSE, so its decision trail is auditable rather than a black box.
    Two dashboards sit on top: one for the shop owner (stock, treasury, receivables, off-ramp) and one for investors (invoice marketplace, bidding, portfolio, risk model). Invoices are minted as NFTs into an escrow pool with a first-loss buffer that returns to the shop on settlement and pays out to the financer on default.
    The frontend was built against a mock API written to a locked data contract, which then served as a living specification for the backend. All money is handled as BigInt base-unit strings (18 decimals on BNB Smart Chain) because even 0.01 USDC overflows JavaScript's safe integer range.
    Built with Next.js, TypeScript, Fastify, Drizzle ORM, PostgreSQL, Redis + BullMQ, and Solidity (Foundry) on BNB Smart Chain.`,
    image:
      "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&h=600&fit=crop",
    technologies: [
      "Next.js",
      "TypeScript",
      "Fastify",
      "Drizzle ORM",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Solidity",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/gabrieladvent/warung-agent",
    featured: true,
    category: "web",
  },

  {
    id: "object-detection-yolov8",
    title: "Object Detection with YOLOv8",
    description:
      "Real-time object detection system powered by YOLOv8 with a public web interface built using Streamlit.",
    longDescription: `Designed and implemented a real-time object detection system using the YOLOv8 algorithm as part of a thesis project. The system focuses on high accuracy and performance, capable of efficiently detecting various objects across different image conditions.

    An interactive web interface was built using Streamlit to make the model accessible to non-technical users — simply upload an image through the browser and detection results are displayed visually in real time.

    This project demonstrates practical integration between a machine learning model and a publicly accessible web application.`,
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=600&fit=crop",
    technologies: ["Python", "YOLOv8", "Streamlit"],
    githubUrl: "https://github.com/gabrieladvent/thesis-result.git",
    liveUrl: "https://thesis-detec-result.streamlit.app/",
    featured: true,
    category: "backend",
  },

  {
    id: "count-sound",
    title: "Count Sound",
    description:
      "A digital vote counting application designed to speed up and improve the accuracy of election result tabulation.",
    longDescription: `Developed a web-based vote counting system to support the 2024 Legislative Election process in Wailolong, East Flores. The application digitizes the manual vote tallying workflow that was previously prone to human error.

    Built with Laravel, the system provides structured data input, automated vote aggregation, and clear result visualization — making it easier for election organizers to monitor and validate vote counts in real time.

    This project successfully reduced tabulation time and improved data accuracy at the village level.`,
    image:
      "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=600&fit=crop",
    technologies: ["Laravel", "PHP", "JavaScript", "CSS", "SCSS"],
    githubUrl: "https://github.com/gabrieladvent/count-sound.git",
    featured: true,
    category: "web",
  },

  {
    id: "toko-kelontong",
    title: "Toko Kelontong (e-commerce system)",
    description:
      "A simple inventory and transaction management system for small retail businesses.",
    longDescription: `Developed collaboratively in a team of four as a Software Engineering course project. The system is designed to help small grocery store owners manage products and daily transactions digitally.

    Contributed to core features including product management, transaction recording, and UI improvements to enhance overall usability.

    This project strengthened understanding of teamwork, fundamental system design, and practical implementation using core web technologies.`,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    technologies: ["PHP", "JavaScript", "CSS"],
    githubUrl: "https://github.com/gabrieladvent/toko-sembako.git",
    featured: false,
    category: "web",
  },

  {
    id: "weru-website",
    title: "Weru Village Website",
    description:
      "A community website for digitally documenting and publishing village activities and local programs.",
    longDescription: `Developed the official website for Weru Village, Gunung Kidul, Yogyakarta, as a digital documentation platform and public information hub for the local community.

    The platform is used to publish local activities — particularly KKN (community service) programs — improving the visibility and accessibility of village initiatives to both residents and the general public.

    Built with Laravel, the system prioritizes simplicity, ease of content management, and readability for all types of users.`,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    technologies: ["Laravel", "PHP", "JavaScript", "CSS", "SCSS"],
    githubUrl: "https://github.com/gabrieladvent/website-pedukuhan.git",
    featured: false,
    category: "web",
  },

  {
    id: "lms-project",
    title: "LMS Project",
    description:
      "A learning management platform for organizing courses, managing content, and tracking learner progress.",
    longDescription: `Built a full-featured Learning Management System (LMS) that enables instructors to organize educational content and monitor learner performance within a single centralized platform.

    Students can access materials, track their learning progress, and complete courses independently. Instructors get an intuitive admin panel for class management and progress reporting.

    Developed using Laravel, Filament, Inertia.js, and React TypeScript — this project emphasizes clean architecture, admin usability, and scalable frontend-backend integration.`,
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
    technologies: [
      "Laravel",
      "Filament",
      "Inertia.js",
      "React TypeScript",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/gabrieladvent/learning-management-system",
    liveUrl: "https://lms.geb4v.my.id",
    featured: true,
    category: "web",
  },

  {
    id: "task-tracker",
    title: "Task Tracker",
    description:
      "A sprint-based task and project management app built for developers and small teams.",
    longDescription: `Developed a modern task management application designed to help developers and small teams manage their workflows more effectively and in a structured way.

    The system supports period-based tracking (sprints or monthly cycles), project organization, task prioritization, and reporting. Unfinished tasks from a previous period are automatically carried over to maintain continuity.

    Built with Laravel, Inertia.js, and React TypeScript — this project reflects real-world usage scenarios and focuses on improving productivity, visibility, and decision-making through structured data.`,
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    technologies: ["Laravel", "Inertia.js", "React TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/gabrieladvent/task-tracker",
    featured: false,
    category: "web",
  },

  {
    id: "restaurant-order-app",
    title: "Restaurant Order App",
    description:
      "A mobile app for browsing restaurant menus and placing food orders directly from your phone.",
    longDescription: `Developed a cross-platform mobile application that allows customers to browse a restaurant's menu, customize their orders, and place them seamlessly from their smartphones.
 
    The app features an intuitive menu browsing experience with category filters, item detail pages, a cart system, and order summary before checkout. The UI is designed to be clean and fast, prioritizing ease of use for all ages.
 
    Built with Flutter and Dart, this project demonstrates mobile UI development skills, state management, and the ability to deliver a polished, production-ready app experience on both Android and iOS from a single codebase.`,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    technologies: ["Flutter", "Dart"],
    githubUrl: "https://github.com/gabrieladvent/restaurant-order-app",
    featured: false,
    category: "mobile",
  },

  {
    id: "tka-assessment-website",
    title: "TKA Assessment Website",
    description:
      "A web-based academic assessment platform for elementary and junior high school students in Magelang, Central Java.",
    longDescription: `Developed a comprehensive academic assessment platform (TKA) to support standardized testing for elementary (SD) and junior high school (SMP) students in Magelang, Central Java.

    The platform covers the full assessment lifecycle — from creating question banks and building exams, to students taking tests online, and administrators monitoring results in real time. Teachers can compose various question types, set time limits, and organize exams by subject and grade level.
 
    A built-in reporting and monitoring dashboard gives administrators and teachers clear visibility into student performance, completion rates, and score analytics — making it easier to identify learning gaps and track academic progress.
 
    Built with Laravel, Livewire, Tailwind CSS, and MySQL, the system delivers a seamless, reactive experience without full page reloads, ensuring a smooth exam-taking flow for students.`,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    technologies: ["Laravel", "Livewire", "Tailwind CSS", "MySQL"],
    githubUrl: "https://github.com/gabrieladvent/tka-assessment",
    featured: false,
    category: "web",
  },

  {
    id: "laundry-management",
    title: "Laundry Management System",
    description:
      "A full-featured laundry management app covering customer registration, orders, delivery, and more.",
    longDescription: `Built a comprehensive laundry business management system designed to streamline day-to-day operations from end to end.
 
    The platform handles the complete laundry workflow — customer registration, order intake with item details and pricing, processing status tracking, delivery scheduling, and payment recording. Staff can manage everything from a single, clean admin interface.
 
    Key features include order status tracking (received, in-progress, ready, delivered), customer history, delivery management, and business reporting to monitor daily and monthly performance.
 
    Built with Laravel and Filament, the system leverages Filament's powerful admin panel to deliver a fast, well-structured back-office experience with minimal development overhead.`,
    image:
      "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&h=600&fit=crop",
    technologies: ["Laravel", "Filament", "MySQL", "Tailwind CSS"],
    githubUrl: "https://github.com/gabrieladvent/loundry-filament",
    featured: false,
    category: "web",
  },

  {
    id: "library-management",
    title: "Library Management System",
    description:
      "A library management system to manage books, borrowing, returns, and overdue tracking.",
    longDescription: `Built a library management system designed to simplify and digitize daily library operations.

      The system manages the complete book lifecycle, including book inventory management, borrowing and return processes, due date tracking, and overdue handling. It helps librarians efficiently track which books are available, currently borrowed, or overdue.

      Key features include book catalog management, member borrowing history, return processing, late return tracking with penalties (if applicable), and reporting to monitor library activity.

      Built with CodeIgniter 4 and MySQL, the system provides a lightweight and efficient backend with a clean interface styled using CSS for smooth day-to-day library operations.`,
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop",
    technologies: ["CodeIgniter 4", "MySQL", "CSS"],
    githubUrl: "https://github.com/gabrieladvent/library",
    featured: false,
    category: "web",
  },

  {
    id: "school-website-template",
    title: "School Website Template (Single-Tenant)",
    description:
      "A reusable, configurable school website where the entire identity — branding, theme, content, and modules — is managed from an admin panel without touching code.",
    longDescription: `Built a reusable school website template designed so that a single deployment serves one school, with every aspect of its identity configured through an admin panel rather than hardcoded — making it easy to spin up a new, distinct site for any school from the same codebase.

    The platform features a runtime theming system: admins can pick from color presets and style packs (typography + radius) or derive the palette straight from an uploaded logo, with an automatic color ramp and WCAG contrast validation on save. Content modules (News, Achievements, Extracurriculars, Gallery, Agenda, Admissions, and a configurable faith/values section) can be toggled per school — navigation, routes, and homepage sections adapt automatically, returning a clean 404 when a module is disabled.

    Includes role-based access control (Filament Shield), a rich text editor and media uploads for all content, full SEO support (sitemap, robots, Open Graph, Schema.org), Indonesian localization with timezone handling, and a polished, responsive, accessible public front-end.

    Built with Laravel, Filament, Livewire, Alpine.js, and Tailwind CSS — emphasizing a single source of truth for configuration, a strong design system, and an experience that lets non-technical school staff manage everything themselves.`,
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop",
    technologies: [
      "Laravel",
      "Filament",
      "Livewire",
      "Alpine.js",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/gabrieladvent/single-tenancy-landing-page",
    liveUrl: "https://school.geb4v.my.id/",
    featured: true,
    category: "web",
  },

  {
    id: "kanisius-yogyakarta-website",
    title: "Yayasan Kanisius Yogyakarta Website",
    description:
      "A data management and analytics platform for student records across Kanisius schools in Yogyakarta.",
    longDescription: `Developed a web-based data management and analytics system for Yayasan Kanisius Yogyakarta to centralize student information across multiple schools under the foundation.

      The platform is designed to support data collection, management, and analysis of student records from various schools within the Kanisius network in Yogyakarta. It helps administrators and staff monitor student data more efficiently and generate insights for decision-making.

      Key features include student data management, cross-school data aggregation, reporting and analytics, and structured data visualization to support educational monitoring and evaluation.

      Built with Laravel 10, Bootstrap, and MySQL, the system provides a responsive interface and a robust backend for handling centralized educational data across multiple institutions.`,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    technologies: ["Laravel 10", "Bootstrap", "MySQL"],
    githubUrl: "https://github.com/gabrieladvent/website-kanisius",
    featured: false,
    category: "web",
  },

  {
    id: "koperasi-management",
    title: "Cooperative (KSP) Management System",
    description:
      "An internal management system for a savings & loan cooperative (KSP), handling member records, multiple savings schemes, loans, and installment tracking — with strong financial data integrity at its core.",
    longDescription: `Built for a government employees' cooperative (KPRI) to replace manual, Excel-based bookkeeping. The system centralizes member data, six savings schemes, loans, and installments into a single internal admin platform.

      It implements the cooperative's real business rules — grade-based mandatory savings, flexible holiday savings, a shopping-balance scheme, short-term ("sebrakan") and long-term loans with admin and mandatory-savings deductions, and installments composed of principal, service charge, and time-deposit savings that are returned once the loan is paid off.

      Financial integrity is the top priority: DECIMAL-based money handling, database transactions, full audit logging, reversal-based corrections instead of hard deletes, and idempotent transactions. Built with Laravel 11, Filament 3, and MySQL for a fast, well-structured back office.`,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    technologies: ["Laravel", "Filament", "MySQL", "Tailwind CSS"],
    featured: false,
    category: "web",
  },
];

export const experiences: Experience[] = [
  {
    id: "fullstack-dev-konnco",
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
    id: "fullstack-dev-vega",
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
    id: "fullstack-dev-kanisius",
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

// GitHub/Wakatime credentials live only in the serverless handlers under /api,
// so nothing here is read from import.meta.env any more.
