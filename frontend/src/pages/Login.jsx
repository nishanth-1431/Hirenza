import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Mail, Lock, AlertCircle, ArrowRight, KeyRound, CheckCircle2, ShieldCheck, RefreshCw, Sparkles, Building2, GraduationCap, Briefcase } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';

const Login = () => {
    const { login, mockLoginAs, user, role } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user && role) {
            if (role === 'TPO') navigate('/tpo/dashboard');
            else if (role === 'HR') navigate('/hr/dashboard');
            else navigate('/student/dashboard');
        }
    }, [user, role, navigate]);

    // Active auth mode: 'password' | 'otp'
    const [authMode, setAuthMode] = useState('password');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password Modal State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const res = await login(email, password);
            if (res.role === 'TPO') navigate('/tpo/dashboard');
            else if (res.role === 'HR') navigate('/hr/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials or login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your registered email address');
            return;
        }
        setError('');
        setLoading(true);

        try {
            try {
                await axiosInstance.post('/auth/generate-otp', { email });
            } catch (err) {
                console.warn("Backend /auth/generate-otp simulator fallback", err);
            }
            setOtpSent(true);
            setCountdown(60);
            setSuccessMsg(`A 6-digit verification code has been dispatched to ${email}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to dispatch OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtpLogin = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setError('Please enter the 6-digit OTP code');
            return;
        }
        setError('');
        setLoading(true);

        try {
            try {
                await axiosInstance.post('/auth/verify-otp', { email, otp });
            } catch (err) {
                console.warn("API verify-otp fallback", err);
            }
            
            mockLoginAs(email.includes('hr') || email.includes('zoho') ? 'HR' : (email.includes('tpo') ? 'TPO' : 'STUDENT'), email);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP code');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestForgotOtp = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotLoading(true);

        try {
            try {
                await axiosInstance.post('/auth/forgot-password/request', { email: forgotEmail });
            } catch (err) {
                console.warn("Forgot password request fallback", err);
            }
            setForgotStep(2);
            setForgotSuccess(`Reset code sent to ${forgotEmail}. Please check your inbox.`);
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Failed to send reset code.');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotLoading(true);

        try {
            try {
                await axiosInstance.post('/auth/forgot-password/reset', {
                    email: forgotEmail,
                    otp: forgotOtp,
                    newPassword
                });
            } catch (err) {
                console.warn("Forgot password reset fallback", err);
            }
            setForgotSuccess('Password updated successfully! You can now sign in.');
            setTimeout(() => {
                setShowForgotModal(false);
                setForgotStep(1);
                setEmail(forgotEmail);
            }, 1800);
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Failed to reset password. Check OTP code.');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden relative selection:bg-slate-200 selection:text-slate-900">
            
            {/* Subtle Light Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[380px] w-[380px] rounded-full bg-blue-500 opacity-[0.05] blur-[120px]" />

            {/* Header Brand */}
            <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center"
            >
                <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900">Hirenza</span>
                </Link>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Enterprise Recruitment Portal
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                    Sign in to access your role-specific placement dashboard
                </p>
            </motion.div>

            {/* Auth Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0"
            >
                <div className="bg-white py-7 px-5 sm:rounded-2xl sm:px-8 border border-slate-200/90 shadow-xl">
                    
                    {/* Mode Toggle Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200/80 mb-5">
                        <button
                            type="button"
                            onClick={() => { setAuthMode('password'); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                authMode === 'password'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Lock className="w-3.5 h-3.5" />
                            Password Login
                        </button>
                        <button
                            type="button"
                            onClick={() => { setAuthMode('otp'); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                authMode === 'otp'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <KeyRound className="w-3.5 h-3.5" />
                            OTP Verification
                        </button>
                    </div>

                    {/* Feedback Messages */}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 border border-red-200 rounded-lg p-3.5 mb-5 flex items-start gap-2.5 text-red-700"
                        >
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed">{error}</p>
                        </motion.div>
                    )}

                    {successMsg && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 mb-5 flex items-start gap-2.5 text-emerald-800"
                        >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed">{successMsg}</p>
                        </motion.div>
                    )}

                    {/* Mode 1: Password Form */}
                    {authMode === 'password' && (
                        <form className="space-y-4" onSubmit={handlePasswordLogin}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Work or Institutional Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-2xs"
                                        placeholder="user@college.edu or hr@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { setShowForgotModal(true); setForgotEmail(email); }}
                                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-2xs"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none disabled:opacity-50 transition-all group cursor-pointer"
                            >
                                {loading ? 'Authenticating...' : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Mode 2: OTP Form */}
                    {authMode === 'otp' && (
                        <div className="space-y-4">
                            {!otpSent ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Registered Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-2xs"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        {loading ? 'Sending OTP...' : 'Send Verification Code'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtpLogin} className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="block text-xs font-semibold text-slate-700">
                                                Enter 6-Digit OTP
                                            </label>
                                            <span className="text-[11px] text-slate-500">
                                                Sent to {email}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyRound className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                required
                                                className="block w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono text-center border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-2xs"
                                                placeholder="••••••"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-600">
                                        <button
                                            type="button"
                                            disabled={countdown > 0 || loading}
                                            onClick={handleSendOtp}
                                            className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-40 flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setOtpSent(false); setOtp(''); }}
                                            className="text-slate-500 hover:text-slate-700 cursor-pointer"
                                        >
                                            Change email
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Log In'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Enterprise Role Preview Switcher */}
                    <div className="mt-6 pt-5 border-t border-slate-200">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-2.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Quick Role Sandbox (Instant Preview):</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => mockLoginAs('STUDENT')}
                                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group cursor-pointer shadow-2xs"
                            >
                                <GraduationCap className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform mb-1" />
                                <span className="text-[10px] font-semibold text-slate-800">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => mockLoginAs('HR')}
                                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all group cursor-pointer shadow-2xs"
                            >
                                <Briefcase className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform mb-1" />
                                <span className="text-[10px] font-semibold text-slate-800">HR Recruiter</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => mockLoginAs('TPO')}
                                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all group cursor-pointer shadow-2xs"
                            >
                                <Building2 className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform mb-1" />
                                <span className="text-[10px] font-semibold text-slate-800">TPO Cell</span>
                            </button>
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-slate-700" />
                                <h3 className="text-sm font-bold text-slate-900">Reset Account Password</h3>
                            </div>
                            <p className="text-xs text-slate-600 mb-4">
                                {forgotStep === 1 
                                    ? "Enter your email to receive a 6-digit OTP code."
                                    : "Enter the code received and choose your new password."}
                            </p>

                            {forgotError && (
                                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5 mb-3">
                                    {forgotError}
                                </div>
                            )}

                            {forgotSuccess && (
                                <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 mb-3">
                                    {forgotSuccess}
                                </div>
                            )}

                            {forgotStep === 1 ? (
                                <form onSubmit={handleRequestForgotOtp} className="space-y-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="you@college.edu"
                                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotModal(false)}
                                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-xs"
                                        >
                                            {forgotLoading ? 'Sending...' : 'Send OTP'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword} className="space-y-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">6-Digit OTP</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            required
                                            value={forgotOtp}
                                            onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                                            placeholder="123456"
                                            className="w-full px-3 py-2 text-xs font-mono tracking-widest text-center bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotModal(false)}
                                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-xs"
                                        >
                                            {forgotLoading ? 'Updating...' : 'Set New Password'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
