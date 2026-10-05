import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();
    
    // Determine where 'Access Platform' goes based on auth state and role
    const getAccessRoute = () => {
        if (!user) return "/login";
        return user.role === 'TPO' ? "/tpo/dashboard" : "/student/dashboard";
    };
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
            {/* Navigation */}
            <nav className="relative z-50 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto border-b border-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-zinc-950" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight">Hirenza</span>
                </div>
                <div className="flex gap-6 items-center">
                    <Link to={getAccessRoute()} className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
                        {user ? 'Dashboard' : 'Sign In'}
                    </Link>
                    <Link to={getAccessRoute()} className="text-sm font-medium bg-zinc-50 text-zinc-950 px-5 py-2.5 rounded hover:bg-zinc-200 transition-colors">
                        {user ? 'Access Platform' : 'Get Started'}
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-32">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-zinc-500 opacity-[0.15] blur-[100px]" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 mb-8"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Powered by DeepSeek Enterprise AI</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 leading-tight text-zinc-50"
                    >
                        Precision Placement. <br className="hidden md:block" />
                        <span className="text-zinc-500">
                            Zero Compromise.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Hirenza uses semantic AI matching to instantly connect students with the right opportunities. Say goodbye to manual screening and hello to intelligent hiring.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to={getAccessRoute()} className="w-full sm:w-auto px-8 py-4 bg-zinc-50 rounded font-medium text-zinc-950 hover:bg-zinc-200 transition-all flex items-center justify-center group">
                            Access Platform
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Feature Cards Grid */}
                <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard 
                            delay={0.5}
                            icon={<Brain className="w-5 h-5 text-zinc-50" />}
                            title="Semantic Matching"
                            description="Upload your resume. Our AI automatically extracts your skills and matches you with the best fit drives."
                        />
                        <FeatureCard 
                            delay={0.6}
                            icon={<ShieldCheck className="w-5 h-5 text-zinc-50" />}
                            title="Strict Eligibility"
                            description="Real-time evaluation against company criteria ensures you only apply to roles you are qualified for."
                        />
                        <FeatureCard 
                            delay={0.7}
                            icon={<Briefcase className="w-5 h-5 text-zinc-50" />}
                            title="Enterprise Analytics"
                            description="Placement officers get a bird's-eye view of drive success, student engagement, and holistic metrics."
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
            className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 hover:border-zinc-700 transition-colors cursor-default relative overflow-hidden group"
        >
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center mb-6 group-hover:bg-zinc-800 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-medium mb-3 text-zinc-100">{title}</h3>
            <p className="text-zinc-500 leading-relaxed text-sm font-light">
                {description}
            </p>
        </motion.div>
    );
};

export default Landing;
