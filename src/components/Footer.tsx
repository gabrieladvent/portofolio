import { personalInfo } from '../data/portfolio';

export default function Footer() {
    return (
        <footer className="py-8 px-6 border-t border-white/5">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
