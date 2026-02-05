import { useState, useEffect, useRef } from 'react';
import {
  personalInfo,
  socialLinks,
  skills,
  projects,
  experiences
} from './data/portfolio';
import { useGitHubStats, useWakatimeStats } from './hooks/useApi';

// Animated Background Component
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-violet-500/10 rounded-full blur-[128px] animate-pulse delay-500" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
    </div>
  );
}

// Intersection Observer Hook for animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Navigation Component
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['hero', 'about', 'skills', 'projects', 'github', 'stats', 'contact'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'github', label: 'GitHub' },
    { id: 'stats', label: 'Activity' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#hero" className="group flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-black text-lg transform group-hover:rotate-12 transition-transform duration-300">
              {personalInfo.name.charAt(0)}
            </div>
            <span className="text-white font-semibold tracking-tight hidden sm:block">
              {personalInfo.name.split(' ')[0]}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeSection === item.id
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href={personalInfo.resumeUrl}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-5xl mx-auto text-center">
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for work
          </div>
        </div>

        <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <span className="text-white">Hi, I'm </span>
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            {personalInfo.name}
          </span>
        </h1>

        <p className={`text-xl sm:text-2xl text-gray-400 mb-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {personalInfo.title}
        </p>

        <p className={`text-lg text-gray-500 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {personalInfo.tagline}
        </p>

        <div className={`flex flex-wrap items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <a
            href="#projects"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-1"
          >
            View My Work
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 hover:border-white/20 transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>

        <div className={`flex items-center justify-center gap-6 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
              aria-label={link.name}
            >
              <SocialIcon name={link.icon} />
            </a>
          ))}
        </div>

        <div className={`mt-20 animate-bounce transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'
          }`}>
          <a href="#about" className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// Social Icon Component
function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  };

  return icons[name] || null;
}

// About Section
function AboutSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="about" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`relative transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-emerald-500/30 rounded-2xl -z-10" />
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">About Me</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
              Crafting Digital Experiences
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {personalInfo.bio}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-emerald-400 mb-1">5+</div>
                <div className="text-gray-400 text-sm">Years Experience</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-cyan-400 mb-1">50+</div>
                <div className="text-gray-400 text-sm">Projects Completed</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-violet-400 mb-1">30+</div>
                <div className="text-gray-400 text-sm">Happy Clients</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-pink-400 mb-1">∞</div>
                <div className="text-gray-400 text-sm">Cups of Coffee</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className={`mt-32 transition-all duration-1000 delay-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h3 className="text-2xl font-bold text-white text-center mb-12">Work Experience</h3>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-cyan-500 to-violet-500 hidden md:block" />
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={exp.id} className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:ml-auto md:text-right' : 'md:pl-12'}`}>
                  <div className="absolute left-1/2 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 -translate-x-1/2 hidden md:block" />
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <span className="text-emerald-400 text-sm font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                    <h4 className="text-xl font-bold text-white mt-2">{exp.position}</h4>
                    <p className="text-gray-400 mb-3">{exp.company}</p>
                    <p className="text-gray-500 text-sm mb-4">{exp.description}</p>
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Skills Section
function SkillsSection() {
  const { ref, isInView } = useInView();

  const skillCategories = [
    { key: 'frontend', label: 'Frontend', color: 'emerald' },
    { key: 'backend', label: 'Backend', color: 'cyan' },
    { key: 'tools', label: 'Tools', color: 'violet' },
  ] as const;

  return (
    <section id="skills" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className={`text-emerald-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            Skills & Expertise
          </span>
          <h2 className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Technologies I Work With
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.key}
              className={`p-6 rounded-2xl bg-white/5 border border-white/10 transition-all duration-700 hover:border-${category.color}-500/30`}
              style={{ transitionDelay: `${catIndex * 200}ms` }}
            >
              <h3 className={`text-xl font-bold text-white mb-6 flex items-center gap-3 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <span className={`w-3 h-3 rounded-full bg-${category.color}-400`} />
                {category.label}
              </h3>

              <div className="space-y-4">
                {skills
                  .filter((s) => s.category === category.key)
                  .map((skill, index) => (
                    <div
                      key={skill.name}
                      className={`transition-all duration-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                      style={{ transitionDelay: `${catIndex * 200 + index * 100}ms` }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-gray-500 text-sm">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${category.color === 'emerald' ? 'from-emerald-500 to-emerald-400' :
                            category.color === 'cyan' ? 'from-cyan-500 to-cyan-400' :
                              'from-violet-500 to-violet-400'
                            } transition-all duration-1000 ease-out`}
                          style={{
                            width: isInView ? `${skill.level}%` : '0%',
                            transitionDelay: `${catIndex * 200 + index * 100 + 300}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection() {
  const { ref, isInView } = useInView();
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'backend', label: 'Backend' },
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className={`text-emerald-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            Portfolio
          </span>
          <h2 className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Featured Projects
          </h2>
        </div>

        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === cat.key
                ? 'bg-emerald-500 text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium text-center hover:bg-white/30 transition-colors"
                    >
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-emerald-500 text-black text-sm font-medium text-center hover:bg-emerald-400 transition-colors"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6">
                {project.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 mb-3">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-500">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// GitHub Contributions Component
function GitHubContributions() {
  const { stats, loading } = useGitHubStats();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  const { contributionCalendar } = stats;
  const weeks = contributionCalendar.weeks;

  // Generate month labels
  const getMonthLabels = () => {
    const months: { label: string; index: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const date = new Date(firstDay.date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          months.push({
            label: date.toLocaleDateString('en-US', { month: 'short' }),
            index: weekIndex
          });
          lastMonth = month;
        }
      }
    });

    return months;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Contribution Activity
        </h3>
        <span className="text-emerald-400 font-semibold">
          {contributionCalendar.totalContributions} contributions
        </span>
      </div>

      {/* Calendar Container */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        {/* Month Labels */}
        <div className="flex mb-2 text-xs text-gray-500">
          <div className="w-8" />
          <div className="flex-1 flex">
            {monthLabels.map((month, i) => (
              <div
                key={i}
                className="text-left"
                style={{
                  marginLeft: i === 0 ? 0 : `${((month.index - (monthLabels[i - 1]?.index || 0)) * 14) - 24}px`,
                }}
              >
                {month.label}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex">
          {/* Day Labels */}
          <div className="flex flex-col justify-between pr-2 text-xs text-gray-500 h-[98px]">
            <span className="h-3"></span>
            <span>Mon</span>
            <span className="h-3"></span>
            <span>Wed</span>
            <span className="h-3"></span>
            <span>Fri</span>
            <span className="h-3"></span>
          </div>

          {/* Contribution Grid */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-[3px] min-w-max">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.contributionDays.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className="w-[11px] h-[11px] rounded-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-white/30 cursor-pointer relative group"
                      style={{ backgroundColor: day.color }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-white/20 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <div className="font-semibold">{day.contributionCount} contributions</div>
                        <div className="text-gray-400">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((color) => (
            <div key={color} className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalCommitContributions}</div>
          <div className="text-xs text-gray-500">Commits</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalPullRequestContributions}</div>
          <div className="text-xs text-gray-500">PRs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalIssueContributions}</div>
          <div className="text-xs text-gray-500">Issues</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalPullRequestReviewContributions}</div>
          <div className="text-xs text-gray-500">Reviews</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// WAKATIME STATS COMPONENT - NEW LAYOUT
// ============================================

// Calendar Day interface
interface WakatimeCalendarDay {
  date: string;
  total_seconds: number;
  level: number;
  text?: string;
}

// Wakatime Calendar Heatmap Component
function WakatimeCalendarHeatmap({ data }: { data: WakatimeCalendarDay[] }) {
  const [hoveredDay, setHoveredDay] = useState<WakatimeCalendarDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Warna kuning seperti di gambar referensi
  const levelColors = [
    'bg-[#1a1a1a]',      // Level 0 - tidak ada aktivitas
    'bg-[#4d4d00]',      // Level 1 - sedikit
    'bg-[#808000]',      // Level 2 - medium
    'bg-[#cccc00]',      // Level 3 - banyak
    'bg-[#ffff00]',      // Level 4 - sangat banyak
  ];

  // Organisasi data ke dalam minggu-minggu
  const weeks: WakatimeCalendarDay[][] = [];
  let currentWeek: WakatimeCalendarDay[] = [];

  if (data.length > 0) {
    const firstDate = new Date(data[0].date);
    const firstDayOfWeek = firstDate.getDay();

    // Padding untuk hari kosong di awal
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: '', total_seconds: 0, level: -1 });
    }
  }

  data.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', total_seconds: 0, level: -1 });
    }
    weeks.push(currentWeek);
  }

  // Generate month labels
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = '';

    weeks.forEach((week, weekIndex) => {
      const validDays = week.filter(d => d.date);
      if (validDays.length > 0) {
        const firstDay = new Date(validDays[0].date);
        const month = firstDay.toLocaleDateString('en-US', { month: 'short' });
        if (month !== lastMonth) {
          labels.push({ month, weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  const handleMouseEnter = (day: WakatimeCalendarDay, event: React.MouseEvent) => {
    if (day.level >= 0 && day.date) {
      setHoveredDay(day);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  const formatDateShort = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      {/* Scrollable container */}
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Month Labels */}
          <div className="flex mb-2 text-xs text-gray-500">
            <div className="w-8" />
            <div className="flex-1 flex">
              {monthLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-left"
                  style={{
                    marginLeft: i === 0 ? `${label.weekIndex * 14}px` : `${((label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 14) - 24}px`,
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex">
            {/* Day Labels */}
            <div className="flex flex-col justify-between pr-2 text-xs text-gray-500 h-[98px]">
              <span className="h-[11px]"></span>
              <span className="h-[11px] leading-[11px]">Mon</span>
              <span className="h-[11px]"></span>
              <span className="h-[11px] leading-[11px]">Wed</span>
              <span className="h-[11px]"></span>
              <span className="h-[11px] leading-[11px]">Fri</span>
              <span className="h-[11px]"></span>
            </div>

            {/* Weeks Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[11px] h-[11px] rounded-sm transition-all duration-200 ${day.level >= 0
                        ? `${levelColors[day.level]} hover:scale-125 hover:ring-2 hover:ring-yellow-400/50 cursor-pointer`
                        : 'bg-transparent'
                        }`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-start gap-2 mt-4 text-xs text-gray-500">
        <span>Sedikit</span>
        {levelColors.map((color, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-sm ${color}`} />
        ))}
        <span>Banyak</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && hoveredDay.date && (
        <div
          className="fixed z-[100] px-3 py-2 bg-gray-900 border border-white/20 rounded-lg shadow-xl pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-white text-sm font-semibold">
            {hoveredDay.total_seconds > 0
              ? (hoveredDay.text || formatTime(hoveredDay.total_seconds))
              : 'No activity'
            }
          </div>
          <div className="text-gray-400 text-xs">
            {formatDateShort(hoveredDay.date)}
          </div>
        </div>
      )}
    </div>
  );
}

// Wakatime Stats Component - New Layout sesuai gambar
function WakatimeStats() {
  const { stats, loading } = useWakatimeStats();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-white/5 rounded-xl" />
          <div className="h-24 bg-white/5 rounded-xl" />
          <div className="h-24 bg-white/5 rounded-xl" />
          <div className="h-24 bg-white/5 rounded-xl" />
        </div>
        <div className="h-40 bg-white/5 rounded-xl" />
        <div className="h-32 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  const { weeklyStats, allTimeTotal, calendarData } = stats;

  // Format best day date
  const formatBestDayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Transform calendar data jika ada
  const getActivityLevel = (seconds: number): number => {
    if (seconds === 0) return 0;
    if (seconds < 1800) return 1;      // < 30 min
    if (seconds < 7200) return 2;      // < 2 hrs
    if (seconds < 14400) return 3;     // < 4 hrs
    return 4;                          // 4+ hrs
  };

  // Transform calendar data dari API
  const transformedCalendar: WakatimeCalendarDay[] = (calendarData || []).map((day: { date: string; grand_total?: { total_seconds?: number; text?: string } }) => ({
    date: day.date,
    total_seconds: day.grand_total?.total_seconds || 0,
    level: getActivityLevel(day.grand_total?.total_seconds || 0),
    text: day.grand_total?.text
  }));

  // Split languages into two columns
  const topLanguages = weeklyStats.languages.slice(0, 6);
  const leftColumn = topLanguages.filter((_, i) => i % 2 === 0);
  const rightColumn = topLanguages.filter((_, i) => i % 2 === 1);

  return (
    <div className="space-y-4">
      {/* Stats Cards - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rata-rata Waktu Coding Harian */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
          <div className="text-gray-400 text-sm mb-2">Rata-rata Waktu Coding Harian</div>
          <div className="text-2xl font-bold text-white">{weeklyStats.human_readable_daily_average}</div>
        </div>

        {/* Total Minggu Ini */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
          <div className="text-gray-400 text-sm mb-2">Total Minggu Ini</div>
          <div className="text-2xl font-bold text-white">{weeklyStats.human_readable_total}</div>
        </div>

        {/* Hari Terbaik */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
          <div className="text-gray-400 text-sm mb-2">Hari Terbaik</div>
          <div className="text-xl font-bold text-white">
            {weeklyStats.best_day ? (
              <>
                {formatBestDayDate(weeklyStats.best_day.date)}
                <span className="text-base font-normal text-gray-400 ml-2">
                  ({weeklyStats.best_day.text})
                </span>
              </>
            ) : (
              'N/A'
            )}
          </div>
        </div>

        {/* Total Coding Sejak Bergabung */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
          <div className="text-gray-400 text-sm mb-2">Total Coding Sejak Bergabung</div>
          <div className="text-2xl font-bold text-white">{allTimeTotal}</div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      {transformedCalendar.length > 0 && (
        <WakatimeCalendarHeatmap data={transformedCalendar} />
      )}

      {/* Bahasa Teratas */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="text-gray-400 text-sm mb-6">Bahasa Teratas</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumn.map((lang) => (
              <div key={lang.name} className="flex items-center gap-3">
                <span className="text-gray-300 w-24 truncate">{lang.name}</span>
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                    style={{ width: `${lang.percent}%` }}
                  />
                </div>
                <span className="text-gray-400 text-sm w-12 text-right">{Math.round(lang.percent)}%</span>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightColumn.map((lang) => (
              <div key={lang.name} className="flex items-center gap-3">
                <span className="text-gray-300 w-24 truncate">{lang.name}</span>
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                    style={{ width: `${lang.percent}%` }}
                  />
                </div>
                <span className="text-gray-400 text-sm w-12 text-right">{Math.round(lang.percent)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Section - GitHub
function GitHubStatsSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="github" className="py-32 px-6 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <span className={`text-emerald-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            GitHub
          </span>
          <h2 className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Contributions & Activity
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <GitHubContributions />
        </div>
      </div>
    </section>
  );
}

// Stats Section - Wakatime
function WakatimeStatsSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="stats" className="py-32 px-6 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-16">
          <span className={`text-cyan-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            Wakatime
          </span>
          <h2 className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Coding Activity
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <WakatimeStats />
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { ref, isInView } = useInView();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
    alert('Message sent! (This is a demo)');
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className={`text-emerald-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            Get In Touch
          </span>
          <h2 className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Let's Work Together
          </h2>
          <p className={`text-gray-400 mt-4 max-w-xl mx-auto transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
          </p>
        </div>

        <div className={`grid md:grid-cols-2 gap-12 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Email</h4>
                <a href={`mailto:${personalInfo.email}`} className="text-gray-400 hover:text-emerald-400 transition-colors">
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Location</h4>
                <p className="text-gray-400">{personalInfo.location}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h4 className="text-white font-semibold mb-4">Follow Me</h4>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    aria-label={link.name}
                  >
                    <SocialIcon name={link.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none resize-none"
                placeholder="Your message..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm">
          Built with <span className="text-red-400">♥</span> using React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

// Main App Component
export default function App() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <AnimatedBackground />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <GitHubStatsSection />
        <WakatimeStatsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}