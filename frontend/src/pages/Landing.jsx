import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Briefcase, Zap, ShieldCheck, CheckCircle2, Sparkles, Layers, Sliders, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FluidInteractiveGradient from '../components/common/FluidInteractiveGradient';

const Landing = () => {
    const { user, role } = useAuth();
    
    const getAccessRoute = () => {
        if (!user) return "/login";
        if (role === 'TPO') return "/tpo/dashboard";
        if (role === 'HR') return "/hr/dashboard";
        return "/student/dashboard";
    };

    return (
        <div className="min-h-screen bg-[#031722] text-white overflow-hidden font-poppins selection:bg-[#3AAFA9]/30 selection:text-white relative">
            
            {/* Interactive Fluid 3-Gradient Canvas with Mouse Physics (Cyan, Purple, Mint) */}
            <FluidInteractiveGradient className="opacity-95" />

            {/* Navigation Header */}
            <nav className="relative z-50 flex justify-between items-center px-4 sm:px-8 py-3.5 sm:py-4 max-w-7xl mx-auto border-b border-white/10 backdrop-blur-md bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[#3AAFA9] shadow-lg">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-montserrat text-xl sm:text-2xl font-black tracking-tight text-white">
                        Hirenza
                    </span>
                </div>
                <div className="flex gap-2 sm:gap-4 items-center">
                    <Link 
                        to="/login" 
                        className="hidden xs:inline-block text-xs font-medium text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {user ? 'My Workspace' : 'Sign In'}
                    </Link>
                    <Link 
                        to={getAccessRoute()} 
                        className="text-xs font-bold bg-white text-[#17252A] hover:bg-[#DEF2F1] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-lg hover:scale-105 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                        {user ? 'Open Dashboard' : 'Get Started'}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section - Dedicated full-viewport hero section centered on mobile, tablet, and desktop */}
            <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-6 sm:py-12 px-4 sm:px-6 z-10">
                <div className="max-w-4xl mx-auto text-center w-full">
                    
                    {/* Master Display Typography with Scaled Prominence for Mobile & Tablet */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="font-montserrat text-[2.5rem] xs:text-[2.85rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[4.85rem] text-white tracking-tight leading-[1.02] sm:leading-[1.04] mb-4 sm:mb-6 select-none"
                    >
                        <span className="block">
                            <span className="font-black tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">Hirenza</span>{" "}
                            <span className="font-thin tracking-wide text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">orchestrates</span>
                        </span>
                        <span className="block">
                            <span className="font-light text-white/95 tracking-normal drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">every</span>{" "}
                            <span className="font-black tracking-tighter text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">campus drive</span>
                        </span>
                        <span className="block">
                            <span className="font-extrabold text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">with fluid</span>{" "}
                            <span className="font-thin text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">precision.</span>
                        </span>
                    </motion.h1>

                    {/* Subtitle in Poppins */}
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                        className="font-poppins text-xs xs:text-sm sm:text-base md:text-lg text-[#DEF2F1]/95 max-w-sm sm:max-w-xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] px-1"
                    >
                        Deterministic eligibility gating, multi-stage interview telemetry, and real-time candidate progression built for modern campus recruitment.
                    </motion.p>

                    {/* CTA Group: Refined button width on mobile so headline remains the primary focal point */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-none mx-auto mb-6 sm:mb-8"
                    >
                        <Link 
                            to={getAccessRoute()} 
                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#17252A] hover:bg-[#DEF2F1] rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center shadow-xl hover:scale-105 group cursor-pointer whitespace-nowrap"
                        >
                            Access Platform
                            <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl text-white border border-white/25 rounded-full font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all flex items-center justify-center shadow-lg cursor-pointer hover:border-white/40 whitespace-nowrap"
                        >
                            Explore Role Sandbox
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap justify-center items-center gap-3 sm:gap-8 text-[11px] sm:text-xs text-[#DEF2F1]/85 font-poppins">
                        <div className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3AAFA9] shrink-0" />
                            <span>Deterministic Rule Engine</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Tripartite RBAC</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                            <span>Instant Alerts</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Cards Grid with Glassmorphic Refraction - Dedicated Section Below Hero */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-10 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard 
                        delay={0.1}
                        icon={<Brain className="w-5 h-5 text-cyan-300" />}
                        title="Semantic AI Matching"
                        description="DeepSeek parses candidate skills and computes high-dimensional embeddings stored in MySQL for instant cosine relevance scoring."
                        accent="border-cyan-500/30 hover:border-cyan-400/60"
                    />
                    <FeatureCard 
                        delay={0.2}
                        icon={<ShieldCheck className="w-5 h-5 text-emerald-300" />}
                        title="Automated Rule Gate"
                        description="Strict zero-bypass evaluation against CGPA cutoffs, standing backlogs, and branch eligibility before candidates can submit."
                        accent="border-emerald-500/30 hover:border-emerald-400/60"
                    />
                    <FeatureCard 
                        delay={0.3}
                        icon={<Briefcase className="w-5 h-5 text-purple-300" />}
                        title="Multi-Stage ATS Pipeline"
                        description="End-to-end interview round progression (Online Coding ➔ Tech 1 ➔ Tech 2 ➔ HR) with live candidate transparency."
                        accent="border-purple-500/30 hover:border-purple-400/60"
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay, accent = "border-white/10 hover:border-white/30" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className={`bg-white/[0.05] backdrop-blur-xl border ${accent} rounded-2xl p-7 transition-all cursor-default relative overflow-hidden group shadow-2xl hover:-translate-y-1 hover:bg-white/[0.08]`}
        >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-white/15">
                {icon}
            </div>
            <h3 className="font-montserrat text-lg font-bold mb-2 text-white">{title}</h3>
            <p className="font-poppins text-white/70 leading-relaxed text-xs font-light">
                {description}
            </p>
        </motion.div>
    );
};

export default Landing;
