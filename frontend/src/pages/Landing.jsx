import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Briefcase, Zap, ShieldCheck, CheckCircle2, Users, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user, role } = useAuth();
    
    const getAccessRoute = () => {
        if (!user) return "/login";
        if (role === 'TPO') return "/tpo/dashboard";
        if (role === 'HR') return "/hr/dashboard";
        return "/student/dashboard";
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-slate-200 selection:text-slate-900">
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[380px] w-[380px] rounded-full bg-blue-500 opacity-[0.05] blur-[120px]" />

            {/* Navigation */}
            <nav className="relative z-50 flex justify-between items-center px-6 py-5 max-w-7xl mx-auto border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Hirenza</span>
                </div>
                <div className="flex gap-4 items-center">
                    <Link 
                        to="/login" 
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        {user ? 'My Workspace' : 'Sign In'}
                    </Link>
                    <Link 
                        to={getAccessRoute()} 
                        className="text-xs font-semibold bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-xs flex items-center gap-1.5"
                    >
                        {user ? 'Open Dashboard' : 'Get Started'}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-24 pb-28">
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-700 mb-6 shadow-2xs"
                    >
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        <span>AI-Powered Campus Recruitment & Placement Automation</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900"
                    >
                        Precision Placement. <br />
                        <span className="text-blue-600">Zero Administrative Friction.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="text-base sm:text-lg text-slate-600 mb-9 max-w-2xl mx-auto leading-relaxed"
                    >
                        Automated eligibility evaluation, multi-stage interview tracking, and local AI resume-matching built for modern colleges and tier-1 corporate recruiters.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
                    >
                        <Link 
                            to={getAccessRoute()} 
                            className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center shadow-sm group"
                        >
                            Access Platform
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs"
                        >
                            Explore Role Sandbox
                        </Link>
                    </motion.div>

                    {/* Trust Micro-Metrics */}
                    <div className="mt-14 pt-8 border-t border-slate-200/80 flex flex-wrap justify-center gap-8 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="font-medium text-slate-700">Deterministic Rule Engine</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-slate-700">Tripartite RBAC (Student / HR / TPO)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                            <span className="font-medium text-slate-700">Multi-Channel Instant Notifications</span>
                        </div>
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="max-w-7xl mx-auto px-6 mt-20 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard 
                            delay={0.4}
                            icon={<Brain className="w-5 h-5 text-blue-600" />}
                            title="Semantic AI Matching"
                            description="DeepSeek parses candidate skills and computes high-dimensional embeddings stored in MySQL for instant cosine relevance scoring."
                        />
                        <FeatureCard 
                            delay={0.5}
                            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
                            title="Automated Rule Gate"
                            description="Strict zero-bypass evaluation against CGPA cutoffs, standing backlogs, and branch eligibility before candidates can submit."
                        />
                        <FeatureCard 
                            delay={0.6}
                            icon={<Briefcase className="w-5 h-5 text-amber-600" />}
                            title="Multi-Stage ATS Pipeline"
                            description="End-to-end interview round progression (Online Coding ➔ Tech 1 ➔ Tech 2 ➔ HR) with live candidate transparency."
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className="bg-white border border-slate-200/90 rounded-xl p-7 hover:border-slate-300 hover:shadow-md transition-all cursor-default relative overflow-hidden group shadow-2xs"
        >
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-5 group-hover:bg-slate-200/70 transition-colors">
                {icon}
            </div>
            <h3 className="text-base font-bold mb-2 text-slate-900">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-xs">
                {description}
            </p>
        </motion.div>
    );
};

export default Landing;
