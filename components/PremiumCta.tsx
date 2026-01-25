import React from 'react';
import { ArrowRight, Crown, Database, Palette, Layers, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export const PremiumCta: React.FC = () => {
    return (
        <section className="relative overflow-hidden pt-20 pb-20">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none" />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/30 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 lg:p-16 max-w-5xl mx-auto shadow-2xl relative overflow-hidden group">

                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="grid md:grid-cols-1 gap-12 items-center">
                        {/* Content Side */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                                <Crown className="w-3 h-3" />
                                <span>Premium Access</span>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    The Ultimate AI Art Prompts Library
                                </h2>
                                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                                    Notion Template with Lifetime Updates
                                </p>
                            </div>

                            <p className="text-slate-400 text-base leading-relaxed">
                                Stop wasting time on weak prompts. Unlock professional-grade results instantly with this premium Notion template—the most comprehensive, constantly growing directory of hand-curated prompts battletested on Midjourney, Flux, Stable Diffusion, and more.
                            </p>

                            <div className="space-y-3 pt-2">
                                <FeatureItem icon={<Database className="text-blue-400" />} text="2,000+ Expert Prompts (Expanding Weekly)" />
                                <FeatureItem icon={<Palette className="text-purple-400" />} text="Rich Categories: Photography, Cyberpunk, 3D & More" />
                                <FeatureItem icon={<Layers className="text-green-400" />} text="Optimized for Midjourney, Flux, Stable Diffusion" />
                                <FeatureItem icon={<Sparkles className="text-amber-400" />} text="Advanced Notion Database: Search, Sort & Filter" />
                            </div>

                            <div className="pt-6">
                                <a
                                    href="https://ainsider.gumroad.com/l/aiartgallery"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full md:w-auto group/btn"
                                >
                                    <Crown className="w-5 h-5 fill-current" />
                                    <span>Get Lifetime Access</span>
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                                <p className="mt-4 text-xs text-slate-500 font-mono text-center md:text-left">
                                    One-time purchase • Constant free updates via Gumroad
                                </p>
                            </div>
                        </div>

                        {/* Visual Side */}
                        <div className="relative hidden md:block">
                            <div className="relative z-10 grid grid-cols-2 gap-4 rotate-3 hover:rotate-0 transition-transform duration-500 hover:scale-[1.02]">
                                <HeroImage color="bg-blue-500" className="mt-8" />
                                <HeroImage color="bg-purple-500" />
                                <HeroImage color="bg-amber-500" />
                                <HeroImage color="bg-pink-500" className="-mt-8" />

                                {/* Floating badge */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl text-center z-20">
                                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">2,000+</p>
                                    <p className="text-xs font-bold text-white uppercase tracking-wider">Premium Prompts</p>
                                </div>
                            </div>

                            {/* Glow behind */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[80px] rounded-full -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
        </div>
        <span className="text-slate-300 font-medium">{text}</span>
    </div>
);

const HeroImage: React.FC<{ color?: string; className?: string }> = ({ color, className }) => (
    <div className={clsx("rounded-xl overflow-hidden border border-white/10 shadow-lg bg-slate-800 aspect-[2/3] relative group", className)}>
        <div className={clsx("absolute inset-0 opacity-40 mix-blend-overlay", color || 'bg-slate-600')} />
        <img
            src={`https://placehold.co/400x600/1e293b/475569?text=Premium`}
            alt="AI Art Example"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
        />
    </div>
);
