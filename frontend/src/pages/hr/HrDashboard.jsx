import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, Users, PlusCircle, CheckCircle, XCircle, Clock, 
    ArrowRight, Star, Search, Filter, Calendar, MapPin, 
    ChevronRight, Award, FileText, Send, Building2, CheckCircle2
} from 'lucide-react';

const mockDrivesInitial = [
    {
        id: 101,
        companyName: 'Zoho Corporation',
        title: 'Zoho Campus Drive 2026',
        deadline: '2026-11-15',
        cgpaCutoff: 7.5,
        allowedBranches: ['CSE', 'IT', 'ECE'],
        maxArrears: 0,
        roles: [
            { id: 'r1', title: 'Software Development Engineer', ctc: '₹8.5 - ₹12.0 LPA', openings: 15 },
            { id: 'r2', title: 'QA Automation Engineer', ctc: '₹6.5 - ₹8.0 LPA', openings: 8 }
        ],
        rounds: [
            { sequence: 1, name: 'Round 1: Online Coding & Aptitude', type: 'ONLINE_TEST', date: '2026-11-18' },
            { sequence: 2, name: 'Round 2: Technical Interview 1', type: 'TECHNICAL', date: '2026-11-20' },
            { sequence: 3, name: 'Round 3: Advanced System Design', type: 'TECHNICAL', date: '2026-11-22' },
            { sequence: 4, name: 'Round 4: HR & Cultural Fit', type: 'HR', date: '2026-11-24' }
        ]
    },
    {
        id: 102,
        companyName: 'Freshworks',
        title: 'Graduate Tech Hiring 2026',
        deadline: '2026-11-25',
        cgpaCutoff: 7.0,
        allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        maxArrears: 1,
        roles: [
            { id: 'r3', title: 'Frontend Developer (React)', ctc: '₹9.0 LPA', openings: 10 }
        ],
        rounds: [
            { sequence: 1, name: 'Round 1: HackerRank Assessment', type: 'ONLINE_TEST', date: '2026-11-28' },
            { sequence: 2, name: 'Round 2: Frontend Practical Interview', type: 'TECHNICAL', date: '2026-11-30' },
            { sequence: 3, name: 'Round 3: Managerial & HR', type: 'HR', date: '2026-12-02' }
        ]
    }
];

const mockCandidatesInitial = [
    {
        id: 'c1',
        name: 'Alex Johnson',
        email: 'alex.j@college.edu',
        branch: 'CSE',
        cgpa: 8.8,
        arrears: 0,
        driveId: 101,
        roleTitle: 'Software Development Engineer',
        matchScore: 92,
        currentRoundSeq: 2,
        status: 'SCHEDULED',
        skills: ['Java', 'Spring Boot', 'MySQL', 'React', 'Docker'],
        evaluations: [
            { roundSeq: 1, roundName: 'Round 1: Online Coding & Aptitude', score: 9, notes: 'Scored 100/100 in coding section (DSA & Dynamic Programming).' }
        ]
    },
    {
        id: 'c2',
        name: 'Priya Sundaram',
        email: 'priya.s@college.edu',
        branch: 'IT',
        cgpa: 8.2,
        arrears: 0,
        driveId: 101,
        roleTitle: 'Software Development Engineer',
        matchScore: 86,
        currentRoundSeq: 1,
        status: 'CLEARED',
        skills: ['Java', 'Spring Boot', 'REST APIs', 'SQL'],
        evaluations: [
            { roundSeq: 1, roundName: 'Round 1: Online Coding & Aptitude', score: 8, notes: 'Good aptitude score and solid Java problem-solving.' }
        ]
    },
    {
        id: 'c3',
        name: 'Karthik Raja',
        email: 'karthik.r@college.edu',
        branch: 'ECE',
        cgpa: 7.9,
        arrears: 0,
        driveId: 101,
        roleTitle: 'QA Automation Engineer',
        matchScore: 78,
        currentRoundSeq: 2,
        status: 'SCHEDULED',
        skills: ['Java', 'Selenium', 'JUnit', 'Linux'],
        evaluations: [
            { roundSeq: 1, roundName: 'Round 1: Online Coding & Aptitude', score: 7.5, notes: 'Passed online test.' }
        ]
    },
    {
        id: 'c4',
        name: 'Meera Krishnan',
        email: 'meera.k@college.edu',
        branch: 'CSE',
        cgpa: 9.1,
        arrears: 0,
        driveId: 101,
        roleTitle: 'Software Development Engineer',
        matchScore: 95,
        currentRoundSeq: 4,
        status: 'OFFER_EXTENDED',
        skills: ['Java', 'Spring Cloud', 'Kafka', 'React', 'AWS'],
        evaluations: [
            { roundSeq: 1, roundName: 'Round 1: Online Coding', score: 9.5, notes: 'Top 1% score' },
            { roundSeq: 2, roundName: 'Round 2: Tech Interview 1', score: 9.0, notes: 'Exceptional in Java Concurrency and Collections internals' },
            { roundSeq: 3, roundName: 'Round 3: Advanced System Design', score: 9.0, notes: 'Designed an idempotent notification pipeline effortlessly' },
            { roundSeq: 4, roundName: 'Round 4: HR & Cultural Fit', score: 10, notes: 'Great team player, culture fit approved' }
        ]
    }
];

const HrDashboard = () => {
    const [drives, setDrives] = useState(mockDrivesInitial);
    const [selectedDriveId, setSelectedDriveId] = useState(101);
    const [candidates, setCandidates] = useState(mockCandidatesInitial);
    const [filterRole, setFilterRole] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [evaluatingCandidate, setEvaluatingCandidate] = useState(null);
    const [evalScore, setEvalScore] = useState(8);
    const [evalNotes, setEvalNotes] = useState('');
    const [blindMode, setBlindMode] = useState(false);

    const [newDrive, setNewDrive] = useState({
        companyName: 'Zoho Corporation',
        title: '',
        deadline: '',
        cgpaCutoff: 7.0,
        allowedBranches: 'CSE, IT, ECE',
        maxArrears: 0,
        roles: [{ title: 'Software Engineer', ctc: '₹8.0 LPA', openings: 10 }],
        rounds: [
            { sequence: 1, name: 'Round 1: Online Assessment', type: 'ONLINE_TEST', date: '' },
            { sequence: 2, name: 'Round 2: Technical Interview', type: 'TECHNICAL', date: '' },
            { sequence: 3, name: 'Round 3: HR Discussion', type: 'HR', date: '' }
        ]
    });

    const activeDrive = drives.find(d => d.id === selectedDriveId) || drives[0];

    const filteredCandidates = candidates.filter(c => {
        if (c.driveId !== selectedDriveId) return false;
        if (filterRole !== 'ALL' && c.roleTitle !== filterRole) return false;
        if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
            return false;
        }
        return true;
    });

    const handleAdvanceRound = (candidate) => {
        const totalRounds = activeDrive?.rounds.length || 4;
        const nextSeq = candidate.currentRoundSeq + 1;

        if (nextSeq > totalRounds) {
            setCandidates(prev => prev.map(c => 
                c.id === candidate.id 
                    ? { ...c, status: 'OFFER_EXTENDED' } 
                    : c
            ));
        } else {
            setCandidates(prev => prev.map(c => 
                c.id === candidate.id 
                    ? { 
                        ...c, 
                        currentRoundSeq: nextSeq, 
                        status: 'SCHEDULED',
                        evaluations: [
                            ...c.evaluations,
                            { 
                                roundSeq: candidate.currentRoundSeq, 
                                roundName: activeDrive.rounds.find(r => r.sequence === candidate.currentRoundSeq)?.name || `Round ${candidate.currentRoundSeq}`, 
                                score: Number(evalScore), 
                                notes: evalNotes || 'Cleared successfully.' 
                            }
                        ]
                    } 
                    : c
            ));
        }
        setEvaluatingCandidate(null);
        setEvalNotes('');
    };

    const handleReject = (candidateId) => {
        setCandidates(prev => prev.map(c => 
            c.id === candidateId ? { ...c, status: 'REJECTED' } : c
        ));
    };

    const addRoleRow = () => {
        setNewDrive(prev => ({
            ...prev,
            roles: [...prev.roles, { title: '', ctc: '', openings: 5 }]
        }));
    };

    const handleCreateDriveSubmit = (e) => {
        e.preventDefault();
        const created = {
            id: Date.now(),
            companyName: newDrive.companyName,
            title: newDrive.title,
            deadline: newDrive.deadline,
            cgpaCutoff: Number(newDrive.cgpaCutoff),
            allowedBranches: newDrive.allowedBranches.split(',').map(s => s.trim()),
            maxArrears: Number(newDrive.maxArrears),
            roles: newDrive.roles.map((r, i) => ({ ...r, id: `r_${Date.now()}_${i}` })),
            rounds: newDrive.rounds
        };
        setDrives(prev => [created, ...prev]);
        setSelectedDriveId(created.id);
        setShowCreateModal(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            
            {/* Top Recruiter Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2B7A78]/20">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded bg-[#DEF2F1] text-[#2B7A78] border border-[#3AAFA9]/30 shadow-2xs">
                            ENTERPRISE ATS RECRUITER PORTAL
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs font-bold text-[#2B7A78]">{activeDrive.companyName}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#17252A]">
                        Campus Recruitment Command Hub
                    </h1>
                    <p className="text-xs text-[#2B7A78] mt-1">
                        Manage multi-role drives, customize interview round sequence, and advance qualified candidates.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setBlindMode(!blindMode)}
                        className={`inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-xl transition-all border shadow-xs cursor-pointer ${
                            blindMode
                                ? 'bg-purple-900 text-purple-100 border-purple-700 shadow-purple-900/20'
                                : 'bg-[#FEFFFF] text-[#2B7A78] border-[#2B7A78]/30 hover:bg-[#DEF2F1]'
                        }`}
                    >
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-purple-400" />
                        {blindMode ? 'Blind Protocol ACTIVE (Unbiased)' : 'Enable Blind Protocol'}
                    </button>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#FEFFFF] transition-colors shadow-xs group cursor-pointer"
                    >
                        <PlusCircle className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform" />
                        Post New Drive
                    </button>
                </div>
            </div>

            {/* Drive Selector Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
                <div className="md:col-span-1 space-y-3">
                    <h2 className="text-xs font-bold text-[#2B7A78] uppercase tracking-wider mb-2">
                        Your Active Drives
                    </h2>
                    {drives.map(drive => (
                        <div
                            key={drive.id}
                            onClick={() => { setSelectedDriveId(drive.id); setFilterRole('ALL'); }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                drive.id === selectedDriveId
                                    ? 'bg-[#DEF2F1]/50 border-[#3AAFA9] shadow-xs ring-1 ring-[#3AAFA9]/50'
                                    : 'bg-[#FEFFFF] border-[#2B7A78]/20 hover:border-[#3AAFA9] shadow-2xs'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-bold text-[#17252A]">{drive.companyName}</h3>
                                <span className="text-[10px] font-mono text-[#2B7A78] font-bold">{drive.rounds.length} Rounds</span>
                            </div>
                            <p className="text-xs text-[#2B7A78] mb-2 font-medium">{drive.title}</p>
                            <div className="flex items-center justify-between text-[11px] text-[#2B7A78]/80 pt-2 border-t border-[#DEF2F1]">
                                <span>Min CGPA: {drive.cgpaCutoff}</span>
                                <span>{drive.roles.length} Roles</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main ATS Pipeline for Selected Drive */}
                <div className="md:col-span-3 space-y-6">
                    
                    {/* Selected Drive Details Card */}
                    <div className="bg-[#FEFFFF] border border-[#2B7A78]/15 rounded-2xl p-6 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DEF2F1]">
                            <div>
                                <h2 className="text-lg font-bold text-[#17252A]">{activeDrive.title}</h2>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#2B7A78]">
                                    <span className="flex items-center gap-1 font-semibold">
                                        <Calendar className="w-3.5 h-3.5 text-[#3AAFA9]" />
                                        Deadline: {activeDrive.deadline}
                                    </span>
                                    <span>•</span>
                                    <span>Branches: {activeDrive.allowedBranches.join(', ')}</span>
                                    <span>•</span>
                                    <span>Max Arrears: {activeDrive.maxArrears}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#DEF2F1] text-[#2B7A78] border border-[#3AAFA9]/30">
                                    Active Hiring
                                </span>
                            </div>
                        </div>

                        {/* Roles Under this Drive */}
                        <div className="mt-4">
                            <span className="text-xs font-bold text-[#17252A] block mb-2">Hiring For Roles:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {activeDrive.roles.map(role => (
                                    <div key={role.id} className="p-3.5 bg-[#DEF2F1]/30 border border-[#2B7A78]/15 rounded-xl flex justify-between items-center">
                                        <div>
                                            <h4 className="text-xs font-bold text-[#17252A]">{role.title}</h4>
                                            <span className="text-[11px] text-[#2B7A78] font-semibold">{role.openings} open positions</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-[#2B7A78] bg-[#DEF2F1] px-2 py-0.5 rounded border border-[#3AAFA9]/30">
                                            {role.ctc}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interview Rounds Sequence */}
                        <div className="mt-5 pt-4 border-t border-[#DEF2F1]">
                            <span className="text-xs font-bold text-[#17252A] block mb-2.5">
                                Configured Interview Process ({activeDrive.rounds.length} Stages):
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {activeDrive.rounds.map((rnd, idx) => (
                                    <div key={rnd.sequence} className="flex items-center">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#DEF2F1]/50 border border-[#2B7A78]/20 text-xs">
                                            <span className="w-4 h-4 rounded-full bg-[#2B7A78] text-[#FEFFFF] flex items-center justify-center text-[10px] font-mono font-bold">
                                                {rnd.sequence}
                                            </span>
                                            <span className="text-[#17252A] font-bold">{rnd.name}</span>
                                            <span className="text-[10px] text-[#2B7A78] font-medium">({rnd.type})</span>
                                        </div>
                                        {idx < activeDrive.rounds.length - 1 && (
                                            <ChevronRight className="w-3.5 h-3.5 text-[#2B7A78]/50 mx-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Candidate Pipeline Section */}
                    <div className="bg-[#FEFFFF] border border-[#2B7A78]/15 rounded-2xl shadow-2xs overflow-hidden">
                        <div className="p-4 border-b border-[#DEF2F1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#2B7A78]" />
                                <h3 className="text-sm font-bold text-[#17252A]">
                                    Applicant Pipeline ({filteredCandidates.length})
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Role filter */}
                                <div className="flex items-center gap-1.5 bg-[#DEF2F1]/50 border border-[#2B7A78]/20 rounded-lg px-2.5 py-1 text-xs">
                                    <Filter className="w-3 h-3 text-[#2B7A78]" />
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="bg-transparent text-[#17252A] font-semibold focus:outline-none text-xs"
                                    >
                                        <option value="ALL">All Roles</option>
                                        {activeDrive.roles.map(r => (
                                            <option key={r.id} value={r.title}>{r.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-[#2B7A78] absolute left-2.5 top-2" />
                                    <input
                                        type="text"
                                        placeholder="Search candidate or skill..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 pr-3 py-1 text-xs bg-[#DEF2F1]/30 border border-[#2B7A78]/20 rounded-lg text-[#17252A] focus:outline-none focus:ring-1 focus:ring-[#3AAFA9] focus:bg-[#FEFFFF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Candidates Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#DEF2F1] text-left text-xs">
                                <thead className="bg-[#DEF2F1]/40 text-[#2B7A78] font-bold">
                                    <tr>
                                        <th className="py-3 px-4">Student</th>
                                        <th className="py-3 px-3">Role Applied</th>
                                        <th className="py-3 px-3">AI Skill Match</th>
                                        <th className="py-3 px-3">Current Round</th>
                                        <th className="py-3 px-3">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#DEF2F1]">
                                    {filteredCandidates.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-[#2B7A78] font-medium">
                                                No candidates match the selected criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCandidates.map(candidate => (
                                            <tr key={candidate.id} className="hover:bg-[#DEF2F1]/20 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-[#17252A]">
                                                                {blindMode ? `CANDIDATE-${800 + candidate.id.charCodeAt(candidate.id.length - 1) * 7}` : candidate.name}
                                                            </span>
                                                            {blindMode && (
                                                                <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded-full font-mono font-bold">
                                                                    Blind Masked
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-[#2B7A78] font-medium mt-0.5">
                                                            {candidate.branch} • CGPA: {candidate.cgpa}
                                                            <span className="ml-2 text-[#3AAFA9] font-bold">✓ Code Verified</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-3 text-[#17252A] font-medium">
                                                    {candidate.roleTitle}
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                                                        candidate.matchScore >= 85 
                                                            ? 'bg-[#DEF2F1] text-[#2B7A78] border-[#3AAFA9]/40'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                        {candidate.matchScore}% Match
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <div className="text-[#17252A] font-bold">
                                                        Round {candidate.currentRoundSeq} of {activeDrive.rounds.length}
                                                    </div>
                                                    <div className="text-[10px] text-[#2B7A78] font-semibold">
                                                        {activeDrive.rounds.find(r => r.sequence === candidate.currentRoundSeq)?.name}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    {candidate.status === 'OFFER_EXTENDED' && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2B7A78] bg-[#DEF2F1] px-2.5 py-0.5 rounded border border-[#3AAFA9]/40">
                                                            <Award className="w-3 h-3 text-[#3AAFA9]" /> Offer Made
                                                        </span>
                                                    )}
                                                    {candidate.status === 'SCHEDULED' && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2B7A78] bg-[#DEF2F1]/60 px-2 py-0.5 rounded border border-[#2B7A78]/25">
                                                            <Clock className="w-3 h-3 text-[#3AAFA9]" /> Round Scheduled
                                                        </span>
                                                    )}
                                                    {candidate.status === 'CLEARED' && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2B7A78] bg-[#DEF2F1] px-2 py-0.5 rounded border border-[#3AAFA9]/40">
                                                            <CheckCircle2 className="w-3 h-3 text-[#3AAFA9]" /> Round Cleared
                                                        </span>
                                                    )}
                                                    {candidate.status === 'REJECTED' && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                                            <XCircle className="w-3 h-3 text-red-600" /> Rejected
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    {candidate.status !== 'REJECTED' && candidate.status !== 'OFFER_EXTENDED' ? (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => setEvaluatingCandidate(candidate)}
                                                                className="px-3 py-1.5 rounded-lg bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#FEFFFF] text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                                                            >
                                                                Evaluate & Advance
                                                                <ArrowRight className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(candidate.id)}
                                                                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold transition-colors cursor-pointer"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-[#2B7A78]/70 font-medium">Pipeline Finished</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Evaluate & Advance Modal */}
            <AnimatePresence>
                {evaluatingCandidate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17252A]/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#FEFFFF] border border-[#2B7A78]/20 rounded-3xl max-w-md w-full p-7 shadow-2xl relative"
                        >
                            <h3 className="text-base font-bold text-[#17252A] mb-1">
                                Evaluate Candidate: {evaluatingCandidate.name}
                            </h3>
                            <p className="text-xs text-[#2B7A78] mb-4">
                                Currently in {activeDrive.rounds.find(r => r.sequence === evaluatingCandidate.currentRoundSeq)?.name}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#17252A] mb-1">
                                        Round Score / Rating (1 to 10)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={evalScore}
                                        onChange={(e) => setEvalScore(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] focus:outline-none focus:ring-1 focus:ring-[#3AAFA9] shadow-2xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#17252A] mb-1">
                                        Interviewer Notes & Technical Feedback
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={evalNotes}
                                        onChange={(e) => setEvalNotes(e.target.value)}
                                        placeholder="e.g. Demonstrated strong problem-solving in data structures. Cleared for next round."
                                        className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] focus:outline-none focus:ring-1 focus:ring-[#3AAFA9] shadow-2xs resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-[#DEF2F1]">
                                    <button
                                        type="button"
                                        onClick={() => setEvaluatingCandidate(null)}
                                        className="px-3.5 py-1.5 text-xs font-semibold text-[#2B7A78] hover:text-[#17252A] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAdvanceRound(evaluatingCandidate)}
                                        className="px-4 py-2 text-xs font-bold bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#FEFFFF] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Pass & Advance Round
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Post New Drive Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17252A]/40 backdrop-blur-xs overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#FEFFFF] border border-[#2B7A78]/20 rounded-3xl max-w-lg w-full p-7 shadow-2xl relative my-8"
                        >
                            <h3 className="text-base font-bold text-[#17252A] mb-1">
                                Configure Campus Placement Drive
                            </h3>
                            <p className="text-xs text-[#2B7A78] mb-4">
                                Define multiple roles, eligibility cutoffs, and sequential interview rounds.
                            </p>

                            <form onSubmit={handleCreateDriveSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-[#17252A] mb-1">Company</label>
                                        <input
                                            type="text"
                                            required
                                            value={newDrive.companyName}
                                            onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#17252A] mb-1">Drive Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 2026 Tech Hiring"
                                            value={newDrive.title}
                                            onChange={(e) => setNewDrive({ ...newDrive, title: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-[#17252A] mb-1">Deadline</label>
                                        <input
                                            type="date"
                                            required
                                            value={newDrive.deadline}
                                            onChange={(e) => setNewDrive({ ...newDrive, deadline: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#17252A] mb-1">Min CGPA</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={newDrive.cgpaCutoff}
                                            onChange={(e) => setNewDrive({ ...newDrive, cgpaCutoff: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#17252A] mb-1">Max Arrears</label>
                                        <input
                                            type="number"
                                            value={newDrive.maxArrears}
                                            onChange={(e) => setNewDrive({ ...newDrive, maxArrears: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#17252A] mb-1">Allowed Branches (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={newDrive.allowedBranches}
                                        onChange={(e) => setNewDrive({ ...newDrive, allowedBranches: e.target.value })}
                                        className="w-full px-3 py-2 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                    />
                                </div>

                                {/* Multi-Role Rows */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-xs font-bold text-[#17252A]">Job Profiles / Roles</label>
                                        <button
                                            type="button"
                                            onClick={addRoleRow}
                                            className="text-[11px] text-[#2B7A78] hover:text-[#3AAFA9] font-bold cursor-pointer"
                                        >
                                            + Add Role
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {newDrive.roles.map((r, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Role Title"
                                                    value={r.title}
                                                    onChange={(e) => {
                                                        const copy = [...newDrive.roles];
                                                        copy[i].title = e.target.value;
                                                        setNewDrive({ ...newDrive, roles: copy });
                                                    }}
                                                    className="flex-2 px-3 py-1.5 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CTC (e.g. ₹8 LPA)"
                                                    value={r.ctc}
                                                    onChange={(e) => {
                                                        const copy = [...newDrive.roles];
                                                        copy[i].ctc = e.target.value;
                                                        setNewDrive({ ...newDrive, roles: copy });
                                                    }}
                                                    className="flex-1 px-3 py-1.5 text-xs bg-[#FEFFFF] border border-[#2B7A78]/30 rounded-lg text-[#17252A] shadow-2xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-[#DEF2F1]">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-3.5 py-1.5 text-xs font-semibold text-[#2B7A78] hover:text-[#17252A] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-xs font-bold bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#FEFFFF] rounded-lg transition-colors cursor-pointer shadow-xs"
                                    >
                                        Publish Drive
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default HrDashboard;
