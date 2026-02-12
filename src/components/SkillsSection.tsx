import { skills } from "../data/portfolio";
import { useInView } from "../utils/helpers";
import { useState, useRef } from "react";
import { Sparkles, Star } from "lucide-react";

const categoryColors: Record<string, { gradient: string; text: string; bg: string; shadow: string }> = {
    frontend: {
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        text: 'text-emerald-400',
        bg: 'from-emerald-500/30 to-teal-500/20',
        shadow: 'shadow-emerald-500/50'
    },
    backend: {
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        text: 'text-cyan-400',
        bg: 'from-cyan-500/30 to-blue-500/20',
        shadow: 'shadow-cyan-500/50'
    },
    mobile: {
        gradient: 'from-pink-500 via-red-500 to-orange-500',
        text: 'text-pink-400',
        bg: 'from-pink-500/30 to-red-500/20',
        shadow: 'shadow-pink-500/50'
    },
    tools: {
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        text: 'text-violet-400',
        bg: 'from-violet-500/30 to-purple-500/20',
        shadow: 'shadow-violet-500/50'
    }
};

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export default function SkillsSection() {
    const { ref, isInView } = useInView();
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [clickedSkill, setClickedSkill] = useState<string | null>(null);
    const [tooltipPositions, setTooltipPositions] = useState<Record<string, TooltipPosition>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const allSkills = skills;

    const handleSkillClick = (skillName: string) => {
        setClickedSkill(skillName);
        setTimeout(() => setClickedSkill(null), 600);
    };

    const detectTooltipPosition = (element: HTMLElement): TooltipPosition => {
        if (!containerRef.current) return 'bottom';
        
        const container = containerRef.current;
        const allElements = Array.from(container.children) as HTMLElement[];
        
        const yPositions = allElements.map(el => ({
            element: el,
            y: Math.round(el.getBoundingClientRect().top)
        }));
        
        const rows: HTMLElement[][] = [];
        const uniqueYPositions: number[] = [];
        
        yPositions.forEach(({ element, y }) => {
            const existingRowIndex = uniqueYPositions.findIndex(existingY => Math.abs(existingY - y) < 20);
            
            if (existingRowIndex >= 0) {
                rows[existingRowIndex].push(element);
            } else {
                uniqueYPositions.push(y);
                rows.push([element]);
            }
        });
        
        const sortedIndices = uniqueYPositions
            .map((y, index) => ({ y, index }))
            .sort((a, b) => a.y - b.y)
            .map(item => item.index);
        
        const sortedRows = sortedIndices.map(i => rows[i]);
        
        let currentRowIndex = -1;
        for (let i = 0; i < sortedRows.length; i++) {
            if (sortedRows[i].includes(element)) {
                currentRowIndex = i;
                break;
            }
        }
        
        if (currentRowIndex === -1) return 'bottom';
        
        const totalRows = sortedRows.length;
        
        if (currentRowIndex === 0) {
            return 'bottom';
        }
        
        if (currentRowIndex === totalRows - 1) {
            return 'top';
        }
        
        const currentRow = sortedRows[currentRowIndex];
        
        const rowXPositions = currentRow.map(el => el.getBoundingClientRect().left);
        const minX = Math.min(...rowXPositions);
        const maxX = Math.max(...rowXPositions);
        const midX = (minX + maxX) / 2;
        const elementX = element.getBoundingClientRect().left;
        
        if (elementX < midX) {
            return 'right';
        } else {
            return 'left';
        }
    };

    const handleMouseEnter = (skillName: string, event: React.MouseEvent<HTMLDivElement>) => {
        setHoveredSkill(skillName);
        
        const element = event.currentTarget;
        const position = detectTooltipPosition(element);
        
        setTooltipPositions(prev => ({
            ...prev,
            [skillName]: position
        }));
    };

    const getTooltipClasses = (position: TooltipPosition, isHovered: boolean) => {
        const baseClasses = "absolute transition-all duration-300 z-[9999]";
        
        const positionClasses = {
            top: "-top-20 left-1/2 -translate-x-1/2",
            bottom: "-bottom-20 left-1/2 -translate-x-1/2",
            left: "top-1/2 -translate-y-1/2 -left-44",
            right: "top-1/2 -translate-y-1/2 -right-44"
        };
        
        const hoverClasses = isHovered 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-90 pointer-events-none";
        
        const translateClasses = !isHovered ? {
            top: "-translate-y-2",
            bottom: "translate-y-2",
            left: "-translate-x-2",
            right: "translate-x-2"
        }[position] : "";
        
        return `${baseClasses} ${positionClasses[position]} ${hoverClasses} ${translateClasses}`;
    };

    const getArrowClasses = (position: TooltipPosition) => {
        const baseClasses = "absolute w-3 h-3 bg-gradient-to-br from-gray-900 to-gray-800 border-white/30";
        
        const positionClasses = {
            top: "-bottom-1.5 left-1/2 -translate-x-1/2 rotate-45 border-b border-r",
            bottom: "-top-1.5 left-1/2 -translate-x-1/2 rotate-45 border-t border-l",
            left: "-right-1.5 top-1/2 -translate-y-1/2 rotate-45 border-t border-r",
            right: "-left-1.5 top-1/2 -translate-y-1/2 rotate-45 border-b border-l"
        };
        
        return `${baseClasses} ${positionClasses[position]}`;
    };

    const getCircleTransform = (position: TooltipPosition, isHovered: boolean) => {
        if (!isHovered) return "";
        
        const transforms = {
            top: "translate-y-2",
            bottom: "-translate-y-2",
            left: "translate-x-2",
            right: "-translate-x-2"
        };
        
        return transforms[position];
    };

    const getParticlePosition = (position: TooltipPosition) => {
        const positions = {
            top: "bottom-0",
            bottom: "top-0",
            left: "right-0",
            right: "left-0"
        };
        
        return positions[position];
    };

    const getParticleAnimation = (position: TooltipPosition) => {
        const animations = {
            top: "animate-float-down",
            bottom: "animate-float-up",
            left: "animate-float-right",
            right: "animate-float-left"
        };
        
        return animations[position];
    };

    // Generate skill icon URL from skillicons.dev
    const getSkillIconUrl = (iconId: string, theme: 'light' | 'dark' = 'dark') => {
        return `https://skillicons.dev/icons?i=${iconId}&theme=${theme}`;
    };

    return (
        <section id="skills" className="relative py-10 px-6" ref={ref}>
            {/* Background gradient orbs */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm transition-all duration-700 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                            Skills & Expertise
                        </span>
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                    </div>
                    
                    <h2 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mt-6 mb-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Technologies I
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
                            Master & Love
                        </span>
                    </h2>
                </div>

                {/* Unified Skills Grid - Interactive Circular Icons */}
                <div className={`transition-all duration-700 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div ref={containerRef} className="flex flex-wrap justify-center gap-3 max-w-7xl mx-auto py-20 px-4 sm:px-8 md:px-16 lg:px-48">
                        {allSkills.map((skill, index) => {
                            const colors = categoryColors[skill.category];
                            const isHovered = hoveredSkill === skill.name;
                            const isClicked = clickedSkill === skill.name;
                            const tooltipPosition = tooltipPositions[skill.name] || 'bottom';
                            
                            return (
                                <div
                                    key={skill.name}
                                    className={`group relative ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} ${isHovered ? 'z-[100]' : 'z-10'}`}
                                    style={{ 
                                        transitionDelay: `${300 + index * 20}ms`,
                                        transition: 'opacity 500ms, transform 500ms'
                                    }}
                                    onMouseEnter={(e) => handleMouseEnter(skill.name, e)}
                                    onMouseLeave={() => setHoveredSkill(null)}
                                    onClick={() => handleSkillClick(skill.name)}
                                >
                                    {/* Skill Circle */}
                                    <div className={`relative w-20 h-20 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center
                                        ${isHovered ? 'bg-white/10 border-white/30 scale-125 shadow-2xl' : ''}
                                        ${isClicked ? 'animate-ping-once' : ''}
                                        ${getCircleTransform(tooltipPosition, isHovered)}
                                    `}>
                                        {/* Ripple effect on click */}
                                        {isClicked && (
                                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} animate-ripple`} />
                                        )}
                                        
                                        {/* Rotating gradient ring on hover */}
                                        {isHovered && (
                                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} opacity-30 animate-spin`} style={{ animationDuration: '3s' }} />
                                        )}
                                        
                                        {/* Animated background gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-0'}`} />
                                        
                                        {/* Shine effect on hover */}
                                        <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        </div>
                                        
                                        {/* Particle effects on hover - dynamic direction */}
                                        {isHovered && (
                                            <>
                                                <div className={`absolute ${getParticlePosition(tooltipPosition)} left-1/4 w-1 h-1 rounded-full bg-gradient-to-br ${colors.gradient} ${getParticleAnimation(tooltipPosition)}`} />
                                                <div className={`absolute ${getParticlePosition(tooltipPosition)} right-1/4 w-1 h-1 rounded-full bg-gradient-to-br ${colors.gradient} ${getParticleAnimation(tooltipPosition)}`} style={{ animationDelay: '0.2s' }} />
                                                <div className={`absolute ${getParticlePosition(tooltipPosition)} left-1/2 w-0.5 h-0.5 rounded-full bg-gradient-to-br ${colors.gradient} ${getParticleAnimation(tooltipPosition)}`} style={{ animationDelay: '0.4s' }} />
                                            </>
                                        )}
                                        
                                        {/* Skill Icon from skillicons.dev */}
                                        <div className="relative z-10 w-12 h-12 flex items-center justify-center">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} blur-xl transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-0'}`} />
                                            <img 
                                                src={getSkillIconUrl(skill.icon)}
                                                alt={skill.name}
                                                className={`relative w-10 h-10 transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''} ${isClicked ? 'scale-125' : ''}`}
                                                loading="lazy"
                                            />
                                        </div>
                                        
                                        {/* Level indicator ring */}
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="2"
                                            />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="url(#gradient)"
                                                strokeWidth="2"
                                                strokeDasharray={`${2 * Math.PI * 45}`}
                                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - skill.level / 100)}`}
                                                className={`transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
                                                style={{ 
                                                    transitionDelay: `${300 + index * 20 + 200}ms`,
                                                    strokeLinecap: 'round'
                                                }}
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor={skill.category === 'frontend' ? '#10b981' : skill.category === 'backend' ? '#06b6d4' : '#8b5cf6'} />
                                                    <stop offset="100%" stopColor={skill.category === 'frontend' ? '#06b6d4' : skill.category === 'backend' ? '#6366f1' : '#d946ef'} />
                                                </linearGradient>
                                                <linearGradient id="mobile-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor={skill.category === 'mobile' ? '#f97316' : '#fb923c'} />
                                                    <stop offset="100%" stopColor={skill.category === 'mobile' ? '#fb923c' : '#f97316'} />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    
                                    {/* Dynamic Tooltip - 4 directions based on actual row */}
                                    <div className={getTooltipClasses(tooltipPosition, isHovered)}>
                                        <div className={`relative px-4 py-2.5 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/30 backdrop-blur-xl shadow-2xl ${colors.shadow} whitespace-nowrap`}>
                                            {/* Glow effect */}
                                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-10 blur-md`} />
                                            
                                            <div className="relative">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <Star className={`w-3 h-3 ${colors.text} fill-current`} />
                                                    <div className="text-white font-bold text-sm">
                                                        {skill.name}
                                                    </div>
                                                    <Star className={`w-3 h-3 ${colors.text} fill-current`} />
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden min-w-[80px]">
                                                        <div 
                                                            className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-500`}
                                                            style={{ width: `${skill.level}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-bold ${colors.text} min-w-[35px] text-right`}>
                                                        {skill.level}%
                                                    </span>
                                                </div>
                                                
                                                {/* Category badge */}
                                                <div className={`mt-1.5 text-[10px] font-semibold ${colors.text} uppercase tracking-wider text-center opacity-70`}>
                                                    {skill.category}
                                                </div>
                                            </div>
                                            
                                            {/* Arrow pointing to circle - dynamic direction */}
                                            <div className={getArrowClasses(tooltipPosition)} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className={`text-center transition-all duration-700 delay-[800ms] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">
                            Always learning and exploring new technologies
                        </span>
                        <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ping-once {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
                @keyframes float-up {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-30px) scale(0); opacity: 0; }
                }
                @keyframes float-down {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(30px) scale(0); opacity: 0; }
                }
                @keyframes float-left {
                    0% { transform: translateX(0) scale(1); opacity: 1; }
                    100% { transform: translateX(-30px) scale(0); opacity: 0; }
                }
                @keyframes float-right {
                    0% { transform: translateX(0) scale(1); opacity: 1; }
                    100% { transform: translateX(30px) scale(0); opacity: 0; }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-ping-once {
                    animation: ping-once 0.6s cubic-bezier(0.4, 0, 0.6, 1);
                }
                .animate-ripple {
                    animation: ripple 0.6s cubic-bezier(0.4, 0, 0.6, 1);
                }
                .animate-float-up {
                    animation: float-up 1s ease-out infinite;
                }
                .animate-float-down {
                    animation: float-down 1s ease-out infinite;
                }
                .animate-float-left {
                    animation: float-left 1s ease-out infinite;
                }
                .animate-float-right {
                    animation: float-right 1s ease-out infinite;
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </section>
    );
}