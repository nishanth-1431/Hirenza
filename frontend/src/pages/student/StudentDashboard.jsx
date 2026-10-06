import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { studentEndpoints } from '../../api/endpoints';
import { Upload, Briefcase, FileText, CheckCircle, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MatchScoreBadge = ({ score }) => {
    const percentage = Math.round(score * 100);
    
    let colorClass = "bg-red-500/10 text-red-400 border-red-500/20";
    if (percentage >= 70) colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    else if (percentage >= 40) colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium ${colorClass}`}>
            AI Match: {percentage}%
        </span>
    );
};

const DriveCard = ({ driveMatch, index }) => {
    const { drive, score } = driveMatch;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors group"
        >
            <div className="px-6 py-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">
                                {drive.companyName}
                            </h3>
                            <p className="text-sm text-zinc-400">
                                {drive.role}
                            </p>
                        </div>
                    </div>
                    <MatchScoreBadge score={score} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800/50">
                    <div>
                        <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Deadline</dt>
                        <dd className="text-sm text-zinc-300 font-medium">
                            {new Date(drive.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Status</dt>
                        <dd className="text-sm">
                            {drive.eligible ? (
                                <span className="text-emerald-400 flex items-center font-medium">
                                    <CheckCircle className="w-4 h-4 mr-1.5"/> Eligible
                                </span>
                            ) : (
                                <span className="text-red-400 flex items-center font-medium">
                                    <XCircle className="w-4 h-4 mr-1.5"/> Not Eligible
                                </span>
                            )}
                        </dd>
                    </div>
                </div>
                
                <div className="mt-6">
                    <button className="w-full flex items-center justify-center px-4 py-2.5 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-sm font-medium rounded transition-colors group/btn">
                        View Details 
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const StudentDashboard = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resumeText, setResumeText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const fetchDrives = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(studentEndpoints.getEligibleDrivesRanked(user.id));
            setDrives(response.data);
        } catch (error) {
            console.error("Failed to fetch drives", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchDrives();
        }
    }, [user]);

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeText.trim()) return;
        
        try {
            setUploading(true);
            await axiosInstance.post(studentEndpoints.uploadResume(user.id), resumeText, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setUploadSuccess(true);
            setResumeText('');
            fetchDrives();
            
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            console.error("Resume upload failed", error);
            alert("Upload failed. Check console.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight">Student Dashboard</h1>
                <p className="mt-2 text-zinc-400">Discover AI-curated opportunities tailored to your skill set.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Drives */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                        <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-zinc-500" />
                            Eligible Drives
                        </h2>
                        <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                            {drives.length} Matches
                        </span>
                    </div>
                    
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="animate-pulse bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-zinc-800 rounded w-1/3 mb-2"></div>
                                            <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                    <div className="h-24 bg-zinc-800/50 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : drives.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-lg"
                        >
                            <div className="w-12 h-12 bg-zinc-900 rounded mx-auto flex items-center justify-center mb-4">
                                <Briefcase className="w-6 h-6 text-zinc-500" />
                            </div>
                            <h3 className="text-zinc-300 font-medium mb-1">No drives available</h3>
                            <p className="text-zinc-500 text-sm max-w-sm mx-auto">Upload your resume to let our AI match you with relevant opportunities.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {drives.map((match, idx) => (
                                <DriveCard key={match.drive.id || idx} driveMatch={match} index={idx} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Profile & Actions */}
                <div className="space-y-6 lg:sticky lg:top-24">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl"
                    >
                        <div className="px-6 py-6 border-b border-zinc-800/50">
                            <h3 className="text-base font-medium text-zinc-100 flex items-center">
                                <FileText className="mr-2 w-5 h-5 text-zinc-400" />
                                Resume Parser
                            </h3>
                            <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                                Paste your latest resume content. DeepSeek AI will extract your skills and update your match profile automatically.
                            </p>
                        </div>
                        <div className="px-6 py-6 bg-zinc-900/30">
                            <form onSubmit={handleResumeUpload}>
                                <textarea
                                    rows={6}
                                    className="block w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
                                    placeholder="e.g. I am a software engineer proficient in Java, React, Python, and SQL..."
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    disabled={uploading}
                                />
                                
                                {uploadSuccess && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-start gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-emerald-400 font-medium">Resume parsed successfully! Embeddings generated.</p>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={uploading || !resumeText.trim()}
                                    className="mt-4 w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded text-sm font-medium text-zinc-950 bg-zinc-50 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-950 disabled:opacity-50 transition-all"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                            Processing via Ollama...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 w-4 h-4" />
                                            Update Resume
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
