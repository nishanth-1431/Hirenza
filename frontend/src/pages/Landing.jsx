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
            <nav className="relative z-50 flex justify-between items-center px-6 sm:px-10 py-4 max-w-7xl mx-auto border-b border-white/10 backdrop-blur-md bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[#3AAFA9] shadow-lg">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-montserrat text-xl sm:text-2xl font-black tracking-tight text-white">
                        Hirenza
                    </span>
                </div>
                <div className="flex gap-4 items-center">
                    <Link 
                        to="/login" 
                        className="text-xs font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {user ? 'My Workspace' : 'Sign In'}
                    </Link>
                    <Link 
                        to={getAccessRoute()} 
                        className="text-xs font-bold bg-white text-[#17252A] hover:bg-[#DEF2F1] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-lg hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                    >
                        {user ? 'Open Dashboard' : 'Get Started'}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section - Centered in viewport to match 1522x638 and all screen heights */}
            <main className="relative min-h-[calc(100vh-68px)] flex flex-col justify-center items-center py-3 sm:py-6 px-4 sm:px-6 z-10">
                <div className="max-w-4xl mx-auto text-center w-full">
                    
                    {/* Master Display Typography with Multi-Density Weights (as shown in Image 2) */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.15rem] text-white tracking-tight leading-[1.04] mb-4 select-none"
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
                        className="font-poppins text-xs sm:text-sm md:text-base text-[#DEF2F1]/95 max-w-xl mx-auto leading-relaxed font-light mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    >
                        Deterministic eligibility gating, multi-stage interview telemetry, and real-time candidate progression built for modern campus recruitment.
                    </motion.p>

                    {/* CTA Group */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6"
                    >
                        <Link 
                            to={getAccessRoute()} 
                            className="w-full sm:w-auto px-7 py-3 bg-white text-[#17252A] hover:bg-[#DEF2F1] rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center shadow-2xl hover:scale-105 group cursor-pointer"
                        >
                            Access Platform
                            <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-7 py-3 bg-white/10 backdrop-blur-xl text-white border border-white/25 rounded-full font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all flex items-center justify-center shadow-xl cursor-pointer hover:border-white/40"
                        >
                            Explore Role Sandbox
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap justify-center gap-5 sm:gap-8 text-[11px] sm:text-xs text-[#DEF2F1]/85 font-poppins">
                        <div className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3AAFA9]" />
                            <span>Deterministic Rule Engine</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Tripartite RBAC (Student / HR / TPO)</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />
                            <span>Multi-Channel Instant Notifications</span>
                        </div>
                    </div>
                </div>

                {/* Feature Cards Grid with Glassmorphic Refraction */}
                <div className="max-w-7xl mx-auto px-6 mt-20 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard 
                            delay={0.4}
                            icon={<Brain className="w-5 h-5 text-cyan-300" />}
                            title="Semantic AI Matching"
                            description="DeepSeek parses candidate skills and computes high-dimensional embeddings stored in MySQL for instant cosine relevance scoring."
                            accent="border-cyan-500/30 hover:border-cyan-400/60"
                        />
                        <FeatureCard 
                            delay={0.5}
                            icon={<ShieldCheck className="w-5 h-5 text-emerald-300" />}
                            title="Automated Rule Gate"
                            description="Strict zero-bypass evaluation against CGPA cutoffs, standing backlogs, and branch eligibility before candidates can submit."
                            accent="border-emerald-500/30 hover:border-emerald-400/60"
                        />
                        <FeatureCard 
                            delay={0.6}
                            icon={<Briefcase className="w-5 h-5 text-purple-300" />}
                            title="Multi-Stage ATS Pipeline"
                            description="End-to-end interview round progression (Online Coding ➔ Tech 1 ➔ Tech 2 ➔ HR) with live candidate transparency."
                            accent="border-purple-500/30 hover:border-purple-400/60"
                        />
                    </div>
                </div>
            </main>
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
