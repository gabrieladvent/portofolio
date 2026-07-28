import { useState } from "react";
import { motion } from "motion/react";
import { personalInfo, socialLinks } from "../data/portfolio";
import { SocialIcon } from "../utils/helpers";
import SectionHeader from "./ui/SectionHeader";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

type Status = "idle" | "sending" | "sent" | "error" | "fallback";

export default function ContactSection() {
    const [formState, setFormState] = useState({ name: "", email: "", message: "" });
    const [company, setCompany] = useState(""); // honeypot
    const [status, setStatus] = useState<Status>("idle");

    const openMailClient = () => {
        const subject = `Hello from ${formState.name || "portfolio"}`;
        const body = `${formState.message}\n\n— ${formState.name} (${formState.email})`;
        window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "sending") return;

        setStatus("sending");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formState, company }),
            });

            if (response.ok) {
                setStatus("sent");
                setFormState({ name: "", email: "", message: "" });
                return;
            }

            // 503 means delivery isn't configured — hand off to the mail client
            // rather than losing what the visitor typed.
            if (response.status === 503) {
                setStatus("fallback");
                openMailClient();
                return;
            }

            setStatus("error");
        } catch {
            setStatus("error");
        }
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl bg-white border border-black/[0.1] text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400/40 transition-all outline-none";

    return (
        <section id="contact" className="py-28 px-6">
            <div className="max-w-5xl mx-auto">
                <SectionHeader
                    index="06"
                    eyebrow="Contact"
                    title="Let's build something together"
                    description="Have a project or idea in mind? I’d be happy to hear it. Send me a message and let’s get started."
                />

                <div className="grid md:grid-cols-2 gap-12 mt-16">
                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease }}
                        className="space-y-8"
                    >
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="group flex items-start gap-4"
                        >
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-zinc-900 font-semibold mb-0.5">Email</h4>
                                <span className="text-zinc-500 group-hover:text-emerald-600 transition-colors">
                                    {personalInfo.email}
                                </span>
                            </div>
                        </a>

                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-zinc-900 font-semibold mb-0.5">Location</h4>
                                <p className="text-zinc-500">{personalInfo.location}</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-black/[0.08]">
                            <h4 className="text-zinc-900 font-semibold mb-4">Follow Me</h4>
                            <div className="flex gap-3">
                                {socialLinks.map((link) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -4 }}
                                        className="w-11 h-11 rounded-xl bg-white border border-black/[0.08] shadow-sm flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-emerald-500/50 transition-colors"
                                        aria-label={link.name}
                                    >
                                        <SocialIcon name={link.icon} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.1, ease }}
                        className="relative space-y-5"
                    >
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                className={inputClass}
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                className={inputClass}
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={5}
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                className={`${inputClass} resize-none`}
                                placeholder="Your message..."
                                required
                            />
                        </div>
                        {/* Honeypot — hidden from people, irresistible to bots. */}
                        <div className="absolute -left-[9999px]" aria-hidden="true">
                            <label htmlFor="company">Company</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                tabIndex={-1}
                                autoComplete="off"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={status === "sending"}
                            whileHover={status === "sending" ? undefined : { y: -2 }}
                            whileTap={status === "sending" ? undefined : { scale: 0.98 }}
                            className="w-full py-4 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-xl shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status === "sending" && (
                                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            )}
                            {status === "sending" ? "Sending..." : "Send Message"}
                        </motion.button>

                        <div aria-live="polite" className="min-h-[1.25rem]">
                            {status === "sent" && (
                                <p className="text-sm text-emerald-700 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Message sent — I'll get back to you soon.
                                </p>
                            )}
                            {status === "fallback" && (
                                <p className="text-sm text-zinc-500">
                                    Opening your mail app instead. If nothing happens, email me at{" "}
                                    <a
                                        href={`mailto:${personalInfo.email}`}
                                        className="text-emerald-600 hover:underline"
                                    >
                                        {personalInfo.email}
                                    </a>
                                    .
                                </p>
                            )}
                            {status === "error" && (
                                <p className="text-sm text-red-600">
                                    Couldn't send that.{" "}
                                    <button
                                        type="button"
                                        onClick={openMailClient}
                                        className="underline hover:no-underline"
                                    >
                                        Send it by email instead
                                    </button>
                                    .
                                </p>
                            )}
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
