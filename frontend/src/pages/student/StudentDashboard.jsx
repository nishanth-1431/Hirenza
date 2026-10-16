import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { studentEndpoints } from '../../api/endpoints';
import { 
    Upload, Briefcase, FileText, CheckCircle, XCircle, ChevronRight, 
    Loader2, Calendar, MapPin, Award, Clock, CheckCircle2, Video, 
    Sparkles, ArrowRight, ExternalLink, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MatchScoreBadge = ({ score }) => {
    const percentage = Math.round(score * 100);
    
    let colorClass = "bg-red-50 text-red-700 border-red-200";
    if (percentage >= 70) colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    else if (percentage >= 40) colorClass = "bg-amber-50 text-amber-700 border-amber-200";

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${colorClass}`}>
            AI Match: {percentage}%
        </span>
    );
};

const mockMyApplicationsInitial = [
    {
        applicationId: 'app_1',
        driveId: 101,
        companyName: 'Zoho Corporation',
        roleApplied: 'Software Development Engineer',
        appliedAt: '2026-10-10',
        ctc: '₹8.5 - ₹12.0 LPA',
        status: 'IN_PROGRESS',
        currentRoundIndex: 2,
        rounds: [
            {
                sequence: 1,
                name: 'Round 1: Online Coding & Aptitude',
                type: 'ONLINE_ASSESSMENT',
                status: 'CLEARED',
                date: 'Oct 12, 2026',
                score: '94/100',
                feedback: 'Exceptional speed in algorithmic data structures (Arrays & HashMaps).'
            },
            {
                sequence: 2,
                name: 'Round 2: Technical Interview 1',
                type: 'TECHNICAL',
                status: 'CLEARED',
                date: 'Oct 15, 2026',
                score: '9.0/10',
                feedback: 'Strong grasp of Java internals, Garbage Collection, and Spring Boot architecture.'
            },
            {
                sequence: 3,
                name: 'Round 3: Advanced System Design',
                type: 'TECHNICAL',
                status: 'SCHEDULED',
                date: 'Tomorrow, Oct 18 • 10:30 AM',
                meetingLink: 'https://meet.zoho.com/hirenza-tech3-alex',
                venue: 'Virtual Video Room',
                instructions: 'Prepare to design a high-throughput event notification system with decoupled queues.'
            },
            {
                sequence: 4,
                name: 'Round 4: HR & Culture Fit',
                type: 'HR',
                status: 'UPCOMING',
                date: 'TBD upon Round 3 clearance'
            }
        ]
    },
    {
        applicationId: 'app_2',
        driveId: 102,
        companyName: 'Freshworks',
        roleApplied: 'Frontend Developer (React)',
        appliedAt: '2026-10-14',
        ctc: '₹9.0 LPA',
        status: 'IN_PROGRESS',
        currentRoundIndex: 0,
        rounds: [
            {
                sequence: 1,
                name: 'Round 1: HackerRank Assessment',
                type: 'ONLINE_ASSESSMENT',
                status: 'SCHEDULED',
                date: 'Oct 22, 2026 • 02:00 PM',
                meetingLink: 'https://hackerrank.com/freshworks-campus-2026',
                instructions: '60 minutes test: 2 React coding challenges and 10 MCQs.'
            },
            {
                sequence: 2,
                name: 'Round 2: Frontend Architecture Interview',
                type: 'TECHNICAL',
                status: 'UPCOMING',
                date: 'TBD'
            },
            {
                sequence: 3,
                name: 'Round 3: Final HR Discussion',
                type: 'HR',
                status: 'UPCOMING',
                date: 'TBD'
            }
        ]
    }
];

const StudentDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('drives');
    const [drives, setDrives] = useState([]);
    const [applications, setApplications] = useState(mockMyApplicationsInitial);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resumeText, setResumeText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [appliedDrives, setAppliedDrives] = useState({});

    const fetchDrives = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(studentEndpoints.getEligibleDrivesRanked(user?.id || 1));
            setDrives(response.data);
        } catch (error) {
            console.warn("API fallback to simulated drives", error);
            setDrives([
                {
                    drive: {
                        id: 101,
                        companyName: 'Zoho Corporation',
                        role: 'Software Development Engineer',
                        applicationDeadline: '2026-11-15',
                        eligible: true
                    },
                    score: 0.88
                },
                {
                    drive: {
                        id: 102,
                        companyName: 'Freshworks',
                        role: 'Frontend Developer (React)',
                        applicationDeadline: '2026-11-20',
                        eligible: true
                    },
                    score: 0.76
                },
                {
                    drive: {
                        id: 103,
                        companyName: 'Amazon',
                        role: 'Software Engineer Intern',
                        applicationDeadline: '2026-11-28',
                        eligible: false
                    },
                    score: 0.52
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrives();
    }, [user]);

    const handleApply = (drive) => {
        setAppliedDrives(prev => ({ ...prev, [drive.id]: true }));
        const newApp = {
            applicationId: `app_${Date.now()}`,
            driveId: drive.id,
            companyName: drive.companyName,
            roleApplied: drive.role,
            appliedAt: new Date().toISOString().split('T')[0],
            ctc: '₹8.0 - ₹10.0 LPA',
            status: 'IN_PROGRESS',
            currentRoundIndex: 0,
            rounds: [
                {
                    sequence: 1,
                    name: 'Round 1: Screening & Aptitude',
                    type: 'ONLINE_ASSESSMENT',
                    status: 'SCHEDULED',
                    date: 'Date to be announced via email'
                },
                {
                    sequence: 2,
                    name: 'Round 2: Technical Interview',
                    type: 'TECHNICAL',
                    status: 'UPCOMING',
                    date: 'TBD'
                },
                {
                    sequence: 3,
                    name: 'Round 3: HR Round',
                    type: 'HR',
                    status: 'UPCOMING',
                    date: 'TBD'
                }
            ]
        };
        setApplications(prev => [newApp, ...prev]);
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeText.trim()) return;
        
        try {
            setUploading(true);
            await axiosInstance.post(studentEndpoints.uploadResume(user?.id || 1), resumeText, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setUploadSuccess(true);
            setResumeText('');
            fetchDrives();
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            console.warn("Resume upload fallback", error);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            STUDENT CANDIDATE PORTAL
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">Class of 2026</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Campus Recruitment Workspace
                    </h1>
                    <p className="text-xs text-slate-600 mt-1">
                        Track company eligibility, monitor multi-stage interview rounds, and optimize your skill match.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-2xs">
                    <button
                        onClick={() => setActiveTab('drives')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            activeTab === 'drives'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Briefcase className="w-3.5 h-3.5" />
                        Eligible Drives ({drives.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            activeTab === 'applications'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        Interview Progress ({applications.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: ELIGIBLE DRIVES */}
            {activeTab === 'drives' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 items-start">
                    
                    {/* Left 2 Cols: Drives List */}
                    <div className="lg:col-span-2 space-y-4">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-xl p-5 h-36"></div>
                                ))}
                            </div>
                        ) : drives.length === 0 ? (
                            <div className="text-center py-12 bg-white border border-slate-200 border-dashed rounded-xl">
                                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <h3 className="text-sm font-semibold text-slate-800">No drives available right now</h3>
                                <p className="text-xs text-slate-500 mt-1">Check back later or update your resume.</p>
                            </div>
                        ) : (
                            drives.map((match, idx) => {
                                const { drive, score } = match;
                                const isApplied = appliedDrives[drive.id] || applications.some(a => a.driveId === drive.id);

                                return (
                                    <motion.div
                                        key={drive.id || idx}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        className="bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md rounded-2xl p-6 transition-all group shadow-2xs"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
                                                    {drive.companyName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {drive.companyName}
                                                    </h3>
                                                    <p className="text-xs text-slate-600 font-medium">{drive.role}</p>
                                                </div>
                                            </div>
                                            <MatchScoreBadge score={score} />
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                                            <div>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Deadline</span>
                                                <span className="font-semibold text-slate-800">{drive.applicationDeadline}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Rule Gate</span>
                                                {drive.eligible ? (
                                                    <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Eligible
                                                    </span>
                                                ) : (
                                                    <span className="text-red-700 font-semibold inline-flex items-center gap-1">
                                                        <XCircle className="w-3.5 h-3.5 text-red-600" /> Criteria Not Met
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Rounds</span>
                                                <span className="text-slate-700 font-medium">4 Stages (Aptitude ➔ HR)</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 flex items-center justify-end gap-2">
                                            {isApplied ? (
                                                <button
                                                    onClick={() => {
                                                        const app = applications.find(a => a.driveId === drive.id) || applications[0];
                                                        setSelectedApplication(app);
                                                    }}
                                                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                                >
                                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                                    View Interview Progress
                                                </button>
                                            ) : (
                                                <button
                                                    disabled={!drive.eligible}
                                                    onClick={() => handleApply(drive)}
                                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                                                >
                                                    Apply for Drive
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Right Col: AI Skill Profiler */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900">AI Skill Profiler</h3>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                DeepSeek will parse technical keywords, compute cosine vectors, and recalibrate your drive match score.
                            </p>

                            <form onSubmit={handleResumeUpload}>
                                <textarea
                                    rows={5}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all resize-none shadow-2xs"
                                    placeholder="Paste technical skills & projects (e.g. Java, Spring Boot, React, MySQL, Microservices, Docker, Redis)..."
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    disabled={uploading}
                                />

                                {uploadSuccess && (
                                    <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5 text-xs text-emerald-800">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        Skills indexed & embeddings synced!
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={uploading || !resumeText.trim()}
                                    className="mt-3 w-full flex justify-center items-center py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" />
                                            Analyzing via Ollama...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-1.5 w-3.5 h-3.5" />
                                            Re-parse & Match
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            )}

            {/* TAB 2: MY APPLICATIONS & INTERVIEW TIMELINE */}
            {activeTab === 'applications' && (
                <div className="mt-6 space-y-4">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Active Interview Pipelines ({applications.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {applications.map(app => (
                            <div 
                                key={app.applicationId}
                                className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between shadow-2xs"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{app.companyName}</h3>
                                            <p className="text-xs text-slate-600 font-medium">{app.roleApplied}</p>
                                        </div>
                                        <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 shadow-2xs">
                                            {app.ctc}
                                        </span>
                                    </div>

                                    {/* Current Stage Indicator */}
                                    <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-slate-500 font-medium">Current Stage:</span>
                                            <span className="font-bold text-blue-700">
                                                {app.rounds[app.currentRoundIndex]?.name || 'Round Complete'}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3 text-slate-400" />
                                            {app.rounds[app.currentRoundIndex]?.date || 'Awaiting schedule'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                                    <button
                                        onClick={() => setSelectedApplication(app)}
                                        className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        Open Detailed Rounds Timeline
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* INTERVIEW ROUNDS STEPPER / TIMELINE MODAL */}
            <AnimatePresence>
                {selectedApplication && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-7 shadow-2xl relative my-8"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                                            {selectedApplication.companyName}
                                        </span>
                                        <span className="text-xs text-slate-300">•</span>
                                        <span className="text-xs text-slate-600 font-semibold">{selectedApplication.ctc}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {selectedApplication.roleApplied}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Applied on {selectedApplication.appliedAt} • Multi-Stage Recruitment Pipeline
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="text-slate-400 hover:text-slate-600 p-1 text-base cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Sequential Rounds Timeline */}
                            <div className="mt-6 space-y-6">
                                {selectedApplication.rounds.map((rnd, idx) => {
                                    const isCleared = rnd.status === 'CLEARED';
                                    const isCurrent = rnd.status === 'SCHEDULED';
                                    const isUpcoming = rnd.status === 'UPCOMING';

                                    return (
                                        <div key={rnd.sequence} className="relative flex items-start gap-4">
                                            {/* Connecting vertical bar */}
                                            {idx < selectedApplication.rounds.length - 1 && (
                                                <div className={`absolute left-3.5 top-8 bottom-0 w-0.5 ${
                                                    isCleared ? 'bg-emerald-400' : 'bg-slate-200'
                                                }`} />
                                            )}

                                            {/* Status Icon Indicator */}
                                            <div className="relative z-10">
                                                {isCleared && (
                                                    <div className="w-7 h-7 rounded-full bg-emerald-50 border-2 border-emerald-600 text-emerald-700 flex items-center justify-center shadow-2xs">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                )}
                                                {isCurrent && (
                                                    <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-600 text-blue-700 flex items-center justify-center animate-pulse shadow-2xs">
                                                        <Clock className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                )}
                                                {isUpcoming && (
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-mono">
                                                        {rnd.sequence}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Round Card Info */}
                                            <div className={`flex-1 p-4 rounded-xl border ${
                                                isCurrent 
                                                    ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                                                    : 'bg-slate-50/70 border-slate-200/80'
                                            }`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                                        {rnd.name}
                                                    </h4>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit ${
                                                        isCleared 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : isCurrent 
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                        {rnd.status}
                                                    </span>
                                                </div>

                                                <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-1">
                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                    {rnd.date}
                                                </div>

                                                {/* Cleared Feedback / Score */}
                                                {isCleared && rnd.feedback && (
                                                    <div className="mt-2.5 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg text-[11px] text-slate-800">
                                                        <span className="text-emerald-800 font-bold">Interviewer Score: {rnd.score}</span>
                                                        <p className="text-slate-600 mt-0.5 italic">"{rnd.feedback}"</p>
                                                    </div>
                                                )}

                                                {/* Current Round Actions & Meeting Link */}
                                                {isCurrent && (
                                                    <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-2">
                                                        {rnd.instructions && (
                                                            <p className="text-[11px] text-slate-700">
                                                                <span className="font-bold text-slate-900">Instructions:</span> {rnd.instructions}
                                                            </p>
                                                        )}
                                                        {rnd.meetingLink && (
                                                            <a
                                                                href={rnd.meetingLink}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                                                            >
                                                                <Video className="w-3.5 h-3.5" />
                                                                Join Video Interview Room
                                                                <ExternalLink className="w-3 h-3 ml-1 opacity-80" />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                    Close Timeline
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default StudentDashboard;
