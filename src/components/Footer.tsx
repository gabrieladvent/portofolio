import { personalInfo, socialLinks } from '../data/portfolio';
import { SocialIcon } from '../utils/helpers';

export default function Footer() {
    return (
        <footer className="py-10 px-6 border-t border-black/[0.08]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-sm">
                        {personalInfo.name.charAt(0)}
                    </div>
                    <p className="text-zinc-500 text-sm">
                        © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg bg-white border border-black/[0.08] shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-emerald-500/50 transition-colors"
                            aria-label={link.name}
                        >
                            <SocialIcon name={link.icon} />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
