import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Bot, X, Send, RotateCcw, Copy, Check, ChevronDown, 
    MessageSquare, Zap, ShieldCheck, Briefcase, GraduationCap, ArrowRight,
    CheckCircle2, AlertCircle, Calendar, DollarSign, Clock, User, Filter,
    ChevronRight, ExternalLink, Award, FileCode, CheckCheck, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

/**
 * Enterprise Campus Recruitment Drives Database
 * Deterministic eligibility gating parameters and chronological deadlines
 */
const CAMPUS_DRIVES = [
    {
        id: 'zoho',
        company: 'Zoho Corporation',
        role: 'Software Development Engineer (SDE)',
        ctc: '₹8.5 - ₹12.0 LPA',
        cgpaCutoff: 7.5,
        maxArrears: 0,
        allowedBranches: ['CSE', 'IT', 'ECE'],
        deadline: '2026-10-25',
        deadlineLabel: 'Oct 25, 2026 (Closing in 8 days)',
        isUpcoming: false,
        status: 'ACTIVE',
        roundsCount: 4,
        rounds: [
            { sequence: 1, name: 'Round 1: Online Aptitude & C/Java Programming', type: 'OA', duration: '90 mins', focus: 'Aptitude, basic syntax, pointers, recursion' },
            { sequence: 2, name: 'Round 2: Advanced Coding & Data Structures', type: 'Coding', duration: '3 Problems', focus: 'Matrices, dynamic programming, string algorithms' },
            { sequence: 3, name: 'Round 3: System Design & Technical Interview 1', type: 'Technical', duration: '45 mins', focus: 'Low-level design, OOP, database schema' },
            { sequence: 4, name: 'Round 4: General HR & Culture Alignment', type: 'HR', duration: '30 mins', focus: 'Communication, attitude, company culture' }
        ],
        prepTips: 'Focus on recursion, matrix manipulation, pointers, and time complexity optimization.'
    },
    {
        id: 'freshworks',
        company: 'Freshworks',
        role: 'Frontend Developer (React)',
        ctc: '₹9.0 LPA',
        cgpaCutoff: 7.0,
        maxArrears: 0,
        allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        deadline: '2026-11-20',
        deadlineLabel: 'Nov 20, 2026 (Upcoming)',
        isUpcoming: true,
        status: 'UPCOMING',
        roundsCount: 3,
        rounds: [
            { sequence: 1, name: 'Round 1: HackerRank Coding Assessment', type: 'OA', duration: '60 mins', focus: '2 React coding challenges & 10 core JS MCQs' },
            { sequence: 2, name: 'Round 2: Frontend Architecture Interview', type: 'Technical', duration: '45 mins', focus: 'React lifecycle, state management, web performance' },
            { sequence: 3, name: 'Round 3: Final HR Discussion', type: 'HR', duration: '30 mins', focus: 'Teamwork, behavioral questions, culture fit' }
        ],
        prepTips: 'Review React component lifecycle, custom hooks, state management, and CSS Flex/Grid.'
    },
    {
        id: 'amazon',
        company: 'Amazon',
        role: 'SDE 1 (Campus)',
        ctc: '₹28.0 - ₹32.0 LPA',
        cgpaCutoff: 8.5,
        maxArrears: 0,
        allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        deadline: '2026-11-28',
        deadlineLabel: 'Nov 28, 2026 (Upcoming)',
        isUpcoming: true,
        status: 'UPCOMING',
        roundsCount: 4,
        rounds: [
            { sequence: 1, name: 'Round 1: Online Assessment (OA)', type: 'OA', duration: '90 mins', focus: '2 LeetCode Medium/Hard problems + Work Style Survey' },
            { sequence: 2, name: 'Round 2: Technical Interview 1', type: 'Technical', duration: '60 mins', focus: 'Data structures, trees, graphs, and dynamic programming' },
            { sequence: 3, name: 'Round 3: Technical Interview 2', type: 'Technical', duration: '60 mins', focus: 'Object-oriented design and system architecture' },
            { sequence: 4, name: 'Round 4: Bar Raiser & Leadership Principles', type: 'Bar Raiser', duration: '60 mins', focus: 'STAR format examples for 16 Leadership Principles' }
        ],
        prepTips: 'Master LeetCode Medium/Hard DP and Trees. Review all 16 Leadership Principles with STAR format examples.'
    },
    {
        id: 'microsoft',
        company: 'Microsoft',
        role: 'Software Engineer Intern / FTE',
        ctc: '₹24.0 LPA (₹1.25L/mo stipend)',
        cgpaCutoff: 8.0,
        maxArrears: 0,
        allowedBranches: ['CSE', 'IT'],
        deadline: '2026-11-15',
        deadlineLabel: 'Nov 15, 2026 (Upcoming)',
        isUpcoming: true,
        status: 'UPCOMING',
        roundsCount: 3,
        rounds: [
            { sequence: 1, name: 'Round 1: Codility Online Assessment', type: 'OA', duration: '90 mins', focus: '3 algorithmic problems on array manipulation and graphs' },
            { sequence: 2, name: 'Round 2: Technical Problem Solving', type: 'Technical', duration: '45 mins', focus: 'Code optimization, edge case testing, time/space trade-offs' },
            { sequence: 3, name: 'Round 3: System Architecture & Culture Fit', type: 'Technical/HR', duration: '45 mins', focus: 'Scalable system principles and growth mindset' }
        ],
        prepTips: 'Deep dive into Binary Search, Sliding Window, and Graph traversals (BFS/DFS).'
    },
    {
        id: 'tcs',
        company: 'TCS Digital / Prime',
        role: 'Systems Engineer & Digital Specialist',
        ctc: '₹7.0 - ₹9.0 LPA',
        cgpaCutoff: 7.0,
        maxArrears: 1,
        allowedBranches: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'],
        deadline: '2026-10-30',
        deadlineLabel: 'Oct 30, 2026 (Closing in 13 days)',
        isUpcoming: false,
        status: 'ACTIVE',
        roundsCount: 3,
        rounds: [
            { sequence: 1, name: 'Round 1: National Qualifier Test (NQT)', type: 'OA', duration: '120 mins', focus: 'Cognitive abilities, quantitative skills & advanced coding' },
            { sequence: 2, name: 'Round 2: Technical Interview', type: 'Technical', duration: '45 mins', focus: 'Core CS, DBMS, OOPs, SQL indexing, and web basics' },
            { sequence: 3, name: 'Round 3: HR & Management Discussion', type: 'HR', duration: '30 mins', focus: 'Willingness to relocate, communication, problem-solving' }
        ],
        prepTips: 'Strong fundamentals in SQL indexing, normalization, and OOP concepts in Java/Python.'
    }
];

// Helper to evaluate eligibility deterministically
const evaluateProfile = (profile, drive) => {
    if (!profile || profile.cgpa === null || profile.cgpa === undefined) {
        return { 
            isEligible: false, 
            hasMetrics: false,
            reason: `Cutoff: CGPA ≥ ${drive.cgpaCutoff} • Max ${drive.maxArrears} Arrears • ${drive.allowedBranches.join(', ')}`,
            gap: ''
        };
    }

    const cgpaOk = profile.cgpa >= drive.cgpaCutoff;
    const arrearsOk = profile.arrears <= drive.maxArrears;
    const branchOk = drive.allowedBranches.includes(profile.branch) || 
                     drive.allowedBranches.includes('All Branches') || 
                     drive.allowedBranches.includes('ALL');

    const isEligible = cgpaOk && arrearsOk && branchOk;
    let reason = '';
    let gap = '';

    if (isEligible) {
        reason = `You meet all criteria (CGPA ≥ ${drive.cgpaCutoff}, 0 arrears, ${profile.branch} branch eligible).`;
    } else {
        const issues = [];
        if (!cgpaOk) {
            const diff = (drive.cgpaCutoff - profile.cgpa).toFixed(1);
            issues.push(`Requires ${drive.cgpaCutoff} CGPA (Your CGPA: ${profile.cgpa})`);
            gap = `+${diff} CGPA needed`;
        }
        if (!arrearsOk) {
            issues.push(`Max ${drive.maxArrears} standing arrears allowed (You have ${profile.arrears})`);
        }
        if (!branchOk) {
            issues.push(`${profile.branch} is not in allowed branches (${drive.allowedBranches.join(', ')})`);
        }
        reason = issues.join(' • ');
    }

    return { isEligible, hasMetrics: true, reason, gap };
};

// Clean formatted text sanitizer that replaces raw markdown stars with clean typography
const renderCleanText = (text) => {
    if (!text) return null;

    const paragraphs = text.split('\n\n');

    return paragraphs.map((para, pIdx) => {
        const cleanPara = para.replace(/\*\*/g, '').replace(/\*/g, '');

        if (para.startsWith('### ')) {
            return (
                <div key={pIdx} className="font-montserrat font-bold text-white text-xs pt-1 pb-0.5 border-b border-white/10 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{cleanPara.replace('### ', '')}</span>
                </div>
            );
        }

        if (para.startsWith('```')) {
            const cleanCode = para.replace(/```[a-z]*\n?/g, '');
            return (
                <pre key={pIdx} className="p-2.5 rounded-xl bg-black/40 font-mono text-[10px] text-cyan-200 overflow-x-auto my-1.5 border border-white/10">
                    {cleanCode}
                </pre>
            );
        }

        return (
            <div key={pIdx} className="space-y-1">
                {para.split('\n').map((line, lIdx) => {
                    const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
                    if (!cleanLine) return null;

                    const isBullet = line.startsWith('• ') || line.startsWith('* ') || line.startsWith('- ');
                    const content = isBullet ? cleanLine.replace(/^[•*-]\s*/, '') : cleanLine;

                    return (
                        <div key={lIdx} className={`flex items-start gap-1.5 leading-relaxed ${isBullet ? 'pl-1' : ''}`}>
                            {isBullet && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            )}
                            <span className="text-white/90 text-[11px] sm:text-xs">
                                {content}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    });
};

const AiCopilotChat = () => {
    const { user, role } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'eligible' | 'upcoming'
    const [appliedDrives, setAppliedDrives] = useState({});
    const messagesEndRef = useRef(null);

    // Guest profile metrics entered via conversation
    const [guestMetrics, setGuestMetrics] = useState({
        cgpa: null,
        arrears: 0,
        branch: 'CSE'
    });

    // Active candidate profile (logged in student OR guest metrics)
    const activeProfile = (user && role === 'STUDENT') ? {
        isAuthenticated: true,
        name: user.name || 'Student',
        cgpa: user.cgpa !== undefined ? user.cgpa : 8.2,
        branch: user.branch || 'CSE',
        arrears: user.arrearsCount !== undefined ? user.arrearsCount : 0,
        email: user.email || 'student@college.edu'
    } : {
        isAuthenticated: false,
        name: 'Guest Explorer',
        cgpa: guestMetrics.cgpa,
        branch: guestMetrics.branch,
        arrears: guestMetrics.arrears,
        email: null
    };

    // Initial greeting based on authentication status
    const getInitialMessage = () => {
        if (user && role === 'STUDENT') {
            return `👋 Hello **${activeProfile.name}**! I'm your Personal AI Placement Copilot.\n\nI have loaded your student profile (**${activeProfile.cgpa} CGPA**, **${activeProfile.arrears} Arrears**, **${activeProfile.branch}**). I can match you against all active campus drives, check upcoming deadlines, or guide you through interview rounds.`;
        }
        return `👋 Welcome to **Hirenza AI Placement Copilot**!\n\nI can read all available campus recruitment drives and deadlines with zero manual bypass.\n\n💡 **Tip**: To evaluate your eligibility personally, simply tell me your CGPA and branch (e.g. *"I have 8.2 CGPA in CSE with 0 arrears"*).`;
    };

    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'bot',
            type: 'welcome',
            text: getInitialMessage(),
            suggestedFunctions: (user && role === 'STUDENT') ? [
                { label: 'Show My Eligible Drives', action: 'show_eligible', icon: '🎯' },
                { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' },
                { label: 'Zoho Interview Rounds', action: 'rounds_zoho', icon: '🏢' },
                { label: 'What do I need for Amazon?', action: 'gap_amazon', icon: '📦' }
            ] : [
                { label: 'What are the active drives?', action: 'show_all_drives', icon: '🚀' },
                { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' },
                { label: 'Zoho Interview Rounds', action: 'rounds_zoho', icon: '🏢' },
                { label: 'Amazon Requirements', action: 'gap_amazon', icon: '📦' }
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    // Update greeting if user logs in
    useEffect(() => {
        if (user && role === 'STUDENT') {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    sender: 'bot',
                    type: 'text',
                    text: `🎓 Logged in as **${user.name || 'Student'}** (${user.cgpa || 8.2} CGPA, ${user.arrearsCount || 0} Arrears, ${user.branch || 'CSE'}).\n\nYour profile is now linked to live drive eligibility gating.`,
                    suggestedFunctions: [
                        { label: 'Show My Eligible Drives', action: 'show_eligible', icon: '🎯' },
                        { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' }
                    ],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [user, role]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Card-level action buttons (Apply, Rounds, Prep, Gap)
    const handleCardAction = (actionType, drive) => {
        if (actionType === 'apply') {
            setAppliedDrives(prev => ({ ...prev, [drive.id]: true }));
            const replyMsg = {
                id: Date.now().toString(),
                sender: 'bot',
                type: 'text',
                text: `🎉 Slot Confirmed for ${drive.company}!\n\nYour application for **${drive.role}** has been confirmed.\n\n• Verified CGPA: ${activeProfile.cgpa || drive.cgpaCutoff} (Cutoff: ${drive.cgpaCutoff})\n• Active Backlogs: ${activeProfile.arrears}\n• Assigned Test Slot: Online Round 1 on ${drive.deadlineLabel}\n\nGood luck! Head to your Student Dashboard to track your round progression telemetry.`,
                suggestedFunctions: [
                    { label: `View ${drive.company} Rounds`, action: () => handleCardAction('rounds', drive), icon: '📋' },
                    { label: `Practice Prep Questions`, action: () => handleCardAction('prep', drive), icon: '💻' }
                ],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, replyMsg]);
        } else if (actionType === 'rounds') {
            const replyMsg = {
                id: Date.now().toString(),
                sender: 'bot',
                type: 'rounds',
                company: drive.company,
                roleTitle: drive.role,
                roundsList: drive.rounds,
                prepTips: drive.prepTips,
                suggestedFunctions: [
                    { label: `Apply to ${drive.company}`, action: () => handleCardAction('apply', drive), icon: '⚡' },
                    { label: 'Back to All Drives', action: 'show_all_drives', icon: '🚀' }
                ],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, replyMsg]);
        } else if (actionType === 'prep') {
            const replyMsg = {
                id: Date.now().toString(),
                sender: 'bot',
                type: 'text',
                text: `💡 Interview Preparation Strategy for ${drive.company} (${drive.role})\n\n• Key Technical Topics: ${drive.prepTips}\n\nTop Practice Questions:\n1. Array Optimization: Given an integer array, find the maximum subarray sum in O(n) time (Kadane's Algorithm).\n2. Tree Traversal: Print the bottom view of a Binary Tree using vertical order traversal with TreeMap.\n3. Core Concept: Explain difference between volatile keyword and atomic variables in Java memory model.`,
                suggestedFunctions: [
                    { label: `View ${drive.company} Rounds`, action: () => handleCardAction('rounds', drive), icon: '📋' },
                    { label: 'Show My Eligible Drives', action: 'show_eligible', icon: '🎯' }
                ],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, replyMsg]);
        } else if (actionType === 'gap') {
            const evalResult = evaluateProfile(activeProfile, drive);
            const replyMsg = {
                id: Date.now().toString(),
                sender: 'bot',
                type: 'text',
                text: `📊 Gap Analysis for ${drive.company} (${drive.role})\n\n• Target Cutoff: ${drive.cgpaCutoff} CGPA\n• Standing Backlogs Limit: Max ${drive.maxArrears}\n• Eligible Branches: ${drive.allowedBranches.join(', ')}\n\n${activeProfile.cgpa ? `Verdict: ${evalResult.reason}` : `To see if you qualify, enter your CGPA in chat (e.g. 'My CGPA is 8.5')`}`,
                suggestedFunctions: [
                    { label: 'Show All Active Drives', action: 'show_all_drives', icon: '🚀' },
                    { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' }
                ],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, replyMsg]);
        }
    };

    // Central function dispatcher
    const handleExecuteFunction = (fn) => {
        if (!fn) return;
        const action = typeof fn === 'string' ? fn : fn.action;

        if (action === 'show_eligible') {
            handleSend("Tell me my eligible drives");
        } else if (action === 'show_upcoming') {
            handleSend("Show all upcoming drives and deadlines");
        } else if (action === 'show_all_drives') {
            handleSend("What are all the active drives?");
        } else if (action === 'rounds_zoho') {
            handleSend("What are the interview rounds for Zoho?");
        } else if (action === 'gap_amazon') {
            handleSend("What do I need to be eligible for Amazon?");
        } else if (action === 'java_questions') {
            handleSend("Give me 3 Java technical interview questions");
        } else if (action === 'compare_ctc') {
            handleSend("Compare CTC and packages of all drives");
        }
    };

    // Generate local rich structured response with personal awareness
    const generatePersonalResponse = (query, currentCandidate) => {
        const q = query.toLowerCase();

        // 1. Check for Active / Upcoming / Available Drives queries (with typo tolerance like "tyhe active drives")
        const isDriveQuery = q.includes('driv') || q.includes('compani') || q.includes('activ') || 
                             q.includes('upcom') || q.includes('avail') || q.includes('open') || 
                             q.includes('job') || q.includes('role') ||
                             (q.includes('what') && (q.includes('there') || q.includes('list') || q.includes('tyhe') || q.includes('the')));

        const isOnlyUpcoming = q.includes('upcom') && !q.includes('eligib');
        const isOnlyEligible = q.includes('eligib') || q.includes('am i') || q.includes('can i');

        if (isDriveQuery || isOnlyEligible) {
            let filter = 'all';
            if (isOnlyEligible) filter = 'eligible';
            if (isOnlyUpcoming) filter = 'upcoming';

            const hasCgpa = currentCandidate.cgpa !== null && currentCandidate.cgpa !== undefined;
            const eligibleCount = hasCgpa 
                ? CAMPUS_DRIVES.filter(d => evaluateProfile(currentCandidate, d).isEligible).length 
                : null;

            let headerText = '';
            if (hasCgpa) {
                headerText = `Here are the campus recruitment drives evaluated for **${currentCandidate.name}** (${currentCandidate.cgpa} CGPA, ${currentCandidate.arrears} Arrears, ${currentCandidate.branch}).\n\n🎯 **Eligibility Verdict**: You qualify for **${eligibleCount} out of ${CAMPUS_DRIVES.length} active drives**.`;
            } else {
                headerText = `Here are the active and upcoming campus recruitment drives on Hirenza.\n\n💡 *Tip: To check your personalized eligibility status, type your CGPA in chat (e.g. 'I have 8.2 CGPA in CSE').*`;
            }

            return {
                type: 'drives',
                text: headerText,
                drivesData: CAMPUS_DRIVES,
                filter,
                suggestedFunctions: [
                    { label: 'Show Only Eligible', action: 'show_eligible', icon: '🎯' },
                    { label: 'Show All Upcoming Deadlines', action: 'show_upcoming', icon: '📅' },
                    { label: 'Zoho Interview Rounds', action: 'rounds_zoho', icon: '🏢' },
                    { label: 'What do I need for Amazon?', action: 'gap_amazon', icon: '📦' }
                ]
            };
        }

        // 2. Specific company: Zoho
        if (q.includes('zoho')) {
            const z = CAMPUS_DRIVES.find(d => d.id === 'zoho');
            const evalResult = evaluateProfile(currentCandidate, z);
            return {
                type: 'rounds',
                company: z.company,
                roleTitle: z.role,
                roundsList: z.rounds,
                prepTips: z.prepTips,
                statusText: currentCandidate.cgpa 
                    ? (evalResult.isEligible ? `✅ ${currentCandidate.name} is ELIGIBLE for Zoho SDE!` : `⚠️ Not Eligible: ${evalResult.reason}`)
                    : `Cutoff: 7.5 CGPA, strictly 0 backlogs (CSE, IT, ECE)`,
                suggestedFunctions: [
                    { label: 'Apply to Zoho SDE', action: () => handleCardAction('apply', z), icon: '⚡' },
                    { label: 'Practice Zoho DSA Questions', action: () => handleCardAction('prep', z), icon: '💻' },
                    { label: 'Show All Active Drives', action: 'show_all_drives', icon: '🚀' }
                ]
            };
        }

        // 3. Specific company: Amazon
        if (q.includes('amazon')) {
            const a = CAMPUS_DRIVES.find(d => d.id === 'amazon');
            const evalResult = evaluateProfile(currentCandidate, a);
            return {
                type: 'rounds',
                company: a.company,
                roleTitle: a.role,
                roundsList: a.rounds,
                prepTips: a.prepTips,
                statusText: currentCandidate.cgpa 
                    ? (evalResult.isEligible ? `✅ ${currentCandidate.name} is ELIGIBLE for Amazon SDE 1!` : `⚠️ Cutoff Requirement: ${evalResult.reason}`)
                    : `Cutoff: 8.5 CGPA, strictly 0 standing backlogs (CSE, IT, ECE, EEE)`,
                suggestedFunctions: [
                    { label: 'What do I need for Amazon?', action: 'gap_amazon', icon: '📦' },
                    { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' },
                    { label: 'Show My Eligible Drives', action: 'show_eligible', icon: '🎯' }
                ]
            };
        }

        // 4. Specific company: TCS
        if (q.includes('tcs') || q.includes('prime') || q.includes('digital')) {
            const t = CAMPUS_DRIVES.find(d => d.id === 'tcs');
            return {
                type: 'rounds',
                company: t.company,
                roleTitle: t.role,
                roundsList: t.rounds,
                prepTips: t.prepTips,
                statusText: `Cutoff: 7.0 CGPA, max 1 standing backlog (All Branches)`,
                suggestedFunctions: [
                    { label: 'Apply to TCS Digital', action: () => handleCardAction('apply', t), icon: '⚡' },
                    { label: 'Show All Active Drives', action: 'show_all_drives', icon: '🚀' }
                ]
            };
        }

        // 5. Technical Questions / Mock
        if (q.includes('question') || q.includes('mock') || q.includes('java') || q.includes('prep')) {
            return {
                type: 'text',
                text: `💻 Top Technical Interview Questions for SDE Campus Drives:\n\n1. Concurrency: How does ConcurrentHashMap achieve thread safety without locking the entire map in Java 17? Explain Lock Striping vs CAS (Compare-And-Swap).\n\n2. Algorithms: Given a stream of integers, how do you find the median dynamically? Explain dual Heap (Max-Heap and Min-Heap) approach in O(log n).\n\n3. Database Internals: Why does B+ Tree perform better than Hash Indexing for range queries in MySQL InnoDB?`,
                suggestedFunctions: [
                    { label: 'Zoho Interview Rounds', action: 'rounds_zoho', icon: '🏢' },
                    { label: 'Show My Eligible Drives', action: 'show_eligible', icon: '🎯' }
                ]
            };
        }

        // 6. CTC Comparison
        if (q.includes('ctc') || q.includes('salary') || q.includes('package') || q.includes('compare')) {
            return {
                type: 'text',
                text: `📊 CTC Package Comparison Across Active Drives:\n\n• Amazon SDE 1: ₹28.0 - ₹32.0 LPA (Highest Tier)\n• Microsoft SWE: ₹24.0 LPA (₹1.25L/month stipend)\n• Zoho Corporation SDE: ₹8.5 - ₹12.0 LPA\n• Freshworks Frontend: ₹9.0 LPA\n• TCS Digital / Prime: ₹7.0 - ₹9.0 LPA\n\nAll drives enforce zero-bypass academic cutoffs before slot allocation.`,
                suggestedFunctions: [
                    { label: 'Show All Active Drives', action: 'show_all_drives', icon: '🚀' },
                    { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' }
                ]
            };
        }

        // 7. General fallback
        return {
            type: 'text',
            text: `👋 I'm your Personal AI Placement Copilot.\n\nI can assist you with:\n• Checking your exact eligibility for Zoho, Amazon, Microsoft, Freshworks, and TCS\n• Showing all upcoming drives and deadlines sorted chronologically\n• Guiding you through 1-to-N interview rounds and syllabus\n• Providing mock technical questions and preparation roadmaps\n\nWhat would you like to explore?`,
            suggestedFunctions: [
                { label: 'What are the active drives?', action: 'show_all_drives', icon: '🚀' },
                { label: 'Show My Eligible Drives', action: 'show_eligible', icon: '🎯' },
                { label: 'Upcoming Deadlines', action: 'show_upcoming', icon: '📅' }
            ]
        };
    };

    const handleSend = async (textToSend = input) => {
        const query = textToSend.trim();
        if (!query || isTyping) return;

        // Check if query contains CGPA, Arrears, or Branch metrics from user
        let updatedProfile = { ...activeProfile };
        const cgpaMatch = query.match(/(\d\.\d+|\d{1,2}(?:\.\d+)?)\s*(?:cgpa|gpa)/i) || 
                          query.match(/(?:cgpa|gpa)\s*(?:is|of|:)?\s*(\d\.\d+|\d{1,2}(?:\.\d+)?)/i);
        const arrearsMatch = query.match(/(\d+)\s*(?:arrear|backlog|standing|arrears|backlogs)/i);
        const branchMatch = query.match(/\b(cse|it|ece|eee|mech|civil|aids|cs|electrical|mechanical)\b/i);

        if (cgpaMatch || arrearsMatch || branchMatch) {
            const newCgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : (updatedProfile.cgpa || 8.0);
            const newArrears = arrearsMatch ? parseInt(arrearsMatch[1]) : (updatedProfile.arrears || 0);
            const newBranch = branchMatch ? branchMatch[1].toUpperCase() : (updatedProfile.branch || 'CSE');

            setGuestMetrics({
                cgpa: newCgpa,
                arrears: newArrears,
                branch: newBranch
            });

            updatedProfile.cgpa = newCgpa;
            updatedProfile.arrears = newArrears;
            updatedProfile.branch = newBranch;
        }

        const userMsg = {
            id: Date.now().toString(),
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Attempt Spring Boot backend call
            const res = await axios.post('/api/ai/chat', {
                message: query,
                role: role || (updatedProfile.isAuthenticated ? 'STUDENT' : 'GUEST'),
                userId: updatedProfile.isAuthenticated ? (user?.id || 1) : null,
                email: updatedProfile.email
            }, { timeout: 3500 });

            // Check if backend returned structured text
            if (res.data && res.data.reply) {
                // If query is about drives or contains metrics, provide the interactive drive deck
                const isDrive = /driv|activ|upcom|eligib|compani|tyhe|cgpa/i.test(query);
                if (isDrive) {
                    const localStructured = generatePersonalResponse(query, updatedProfile);
                    setMessages(prev => [
                        ...prev,
                        {
                            id: (Date.now() + 1).toString(),
                            sender: 'bot',
                            ...localStructured,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    ]);
                    setIsTyping(false);
                    return;
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        sender: 'bot',
                        type: 'text',
                        text: res.data.reply,
                        suggestedFunctions: [
                            { label: 'Show My Eligible Drives', action: 'show_eligible', icon: '🎯' },
                            { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' },
                            { label: 'Zoho Interview Rounds', action: 'rounds_zoho', icon: '🏢' }
                        ],
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ]);
                setIsTyping(false);
                return;
            }
        } catch (err) {
            // Fallback gracefully to client personal engine
        }

        // Fast simulated response
        setTimeout(() => {
            const localReply = generatePersonalResponse(query, updatedProfile);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    ...localReply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setIsTyping(false);
        }, 450);
    };

    const clearChat = () => {
        setMessages([
            {
                id: 'welcome-reset',
                sender: 'bot',
                type: 'welcome',
                text: getInitialMessage(),
                suggestedFunctions: [
                    { label: 'What are the active drives?', action: 'show_all_drives', icon: '🚀' },
                    { label: 'View Upcoming Deadlines', action: 'show_upcoming', icon: '📅' }
                ],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    return (
        <>
            {/* Floating Trigger Dock (Bottom-Right) */}
            <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setIsOpen(true)}
                            aria-label="Open Hirenza AI Placement Copilot"
                            className="relative group flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] text-white shadow-[0_8px_30px_rgba(58,175,169,0.4)] border border-white/25 hover:shadow-[0_12px_40px_rgba(58,175,169,0.6)] transition-all cursor-pointer"
                        >
                            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity animate-pulse" />
                            
                            <div className="relative flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
                                </div>
                                <span className="font-montserrat font-bold text-xs sm:text-sm tracking-wide text-white">
                                    AI Copilot
                                </span>
                                <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-white/20 text-cyan-100">
                                    Personal
                                </span>
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Chatbox Window */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 25 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 25 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-[calc(100vw-1.5rem)] sm:w-[460px] max-w-[480px] h-[620px] max-h-[88vh] flex flex-col rounded-3xl bg-[#041c26]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(3,18,26,0.9)] overflow-hidden font-poppins"
                        >
                            {/* Header */}
                            <div className="px-5 py-3.5 bg-gradient-to-r from-[#062633] to-[#0a3847] border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2B7A78] to-[#3AAFA9] flex items-center justify-center text-white shadow-md">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#041c26]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-montserrat font-bold text-sm text-white tracking-tight">
                                                Hirenza Copilot
                                            </h3>
                                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 uppercase">
                                                DeepSeek AI
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#DEF2F1]/70 font-light flex items-center gap-1.5">
                                            <span>Active Context:</span>
                                            <span className="font-semibold text-white/90">
                                                Personal Placement Engine
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-white/70">
                                    <button
                                        onClick={clearChat}
                                        title="Clear conversation"
                                        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        title="Close Copilot"
                                        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Candidate Profile / Context Banner */}
                            <div className="px-4 py-2 bg-[#02131b] border-b border-white/10 flex items-center justify-between text-xs">
                                {activeProfile.isAuthenticated ? (
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-5 h-5 rounded-full bg-[#2B7A78] flex items-center justify-center text-white shrink-0">
                                            <GraduationCap className="w-3 h-3" />
                                        </div>
                                        <span className="font-semibold text-white truncate max-w-[130px]">
                                            {activeProfile.name}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                                            {activeProfile.cgpa} CGPA
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-[10px] shrink-0">
                                            {activeProfile.arrears} Arrears
                                        </span>
                                        <span className="hidden xs:inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] shrink-0">
                                            {activeProfile.branch}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 w-full justify-between">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                                            {activeProfile.cgpa ? (
                                                <span className="text-white font-medium">
                                                    Candidate Metrics: <strong className="text-cyan-300 font-mono">{activeProfile.cgpa} CGPA</strong> • <strong className="text-emerald-300 font-mono">{activeProfile.arrears} Arrears</strong> • <strong className="text-white/90">{activeProfile.branch}</strong>
                                                </span>
                                            ) : (
                                                <span>Public Placement Explorer • Zero-Bypass Eligibility Gating</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[95%] sm:max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                                                msg.sender === 'user'
                                                    ? 'bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] text-white rounded-br-none shadow-md'
                                                    : 'bg-white/[0.07] text-[#DEF2F1] rounded-bl-none border border-white/10 shadow-sm'
                                            }`}
                                        >
                                            {/* Text Content */}
                                            {msg.text && (
                                                <div className="space-y-2">
                                                    {renderCleanText(msg.text)}
                                                </div>
                                            )}

                                            {/* Specialized Interactive Drive Cards Deck */}
                                            {msg.type === 'drives' && msg.drivesData && (
                                                <div className="mt-3 space-y-3">
                                                    {/* Filter Tabs */}
                                                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/30 border border-white/10 text-[10px]">
                                                        <button
                                                            onClick={() => setActiveTabFilter('all')}
                                                            className={`flex-1 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                                                                activeTabFilter === 'all' 
                                                                    ? 'bg-[#2B7A78] text-white' 
                                                                    : 'text-white/60 hover:text-white'
                                                            }`}
                                                        >
                                                            All ({msg.drivesData.length})
                                                        </button>
                                                        {activeProfile.cgpa !== null && (
                                                            <button
                                                                onClick={() => setActiveTabFilter('eligible')}
                                                                className={`flex-1 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                                                                    activeTabFilter === 'eligible' 
                                                                        ? 'bg-emerald-600 text-white' 
                                                                        : 'text-white/60 hover:text-white'
                                                                }`}
                                                            >
                                                                Eligible ({msg.drivesData.filter(d => evaluateProfile(activeProfile, d).isEligible).length})
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setActiveTabFilter('upcoming')}
                                                            className={`flex-1 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                                                                activeTabFilter === 'upcoming' 
                                                                    ? 'bg-cyan-600 text-white' 
                                                                    : 'text-white/60 hover:text-white'
                                                            }`}
                                                        >
                                                            Upcoming ({msg.drivesData.filter(d => d.isUpcoming).length})
                                                        </button>
                                                    </div>

                                                    {/* Drive Cards List */}
                                                    <div className="space-y-2.5">
                                                        {msg.drivesData
                                                            .filter(d => {
                                                                if (activeTabFilter === 'eligible') {
                                                                    return evaluateProfile(activeProfile, d).isEligible;
                                                                }
                                                                if (activeTabFilter === 'upcoming') {
                                                                    return d.isUpcoming;
                                                                }
                                                                return true;
                                                            })
                                                            .map(drive => {
                                                                const evalRes = evaluateProfile(activeProfile, drive);
                                                                const isApplied = appliedDrives[drive.id];

                                                                return (
                                                                    <div 
                                                                        key={drive.id}
                                                                        className={`p-3 rounded-2xl border transition-all ${
                                                                            evalRes.isEligible 
                                                                                ? 'bg-white/[0.06] border-emerald-500/30 hover:border-emerald-400' 
                                                                                : 'bg-white/[0.03] border-white/10'
                                                                        }`}
                                                                    >
                                                                        {/* Card Top Row */}
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <div>
                                                                                <h4 className="font-montserrat font-bold text-white text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                                                                                    <Briefcase className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                                                                                    {drive.company}
                                                                                </h4>
                                                                                <p className="text-[11px] text-cyan-200/90 font-medium">
                                                                                    {drive.role}
                                                                                </p>
                                                                            </div>

                                                                            {evalRes.hasMetrics ? (
                                                                                evalRes.isEligible ? (
                                                                                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                                                        Eligible
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                                                        <AlertCircle className="w-3 h-3 text-amber-400" />
                                                                                        Cutoff Gap
                                                                                    </span>
                                                                                )
                                                                            ) : (
                                                                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                                                                    Cutoff: {drive.cgpaCutoff}+
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        {/* Badges */}
                                                                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                                                                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-semibold flex items-center gap-1">
                                                                                <DollarSign className="w-3 h-3 text-emerald-300" />
                                                                                {drive.ctc}
                                                                            </span>
                                                                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 flex items-center gap-1">
                                                                                <Calendar className="w-3 h-3 text-cyan-300" />
                                                                                {drive.deadlineLabel}
                                                                            </span>
                                                                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/70">
                                                                                {drive.roundsCount} Rounds
                                                                            </span>
                                                                        </div>

                                                                        {/* Verdict Box */}
                                                                        <div className="mt-2 text-[10px] sm:text-[11px] px-2.5 py-1.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                                                                            <div className="text-white/60">
                                                                                Cutoff: CGPA ≥ {drive.cgpaCutoff} • Max {drive.maxArrears} Arrears • {drive.allowedBranches.join(', ')}
                                                                            </div>
                                                                            {evalRes.hasMetrics ? (
                                                                                <div className={`font-semibold ${evalRes.isEligible ? 'text-emerald-300' : 'text-amber-300'}`}>
                                                                                    {evalRes.reason}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-cyan-200/80 font-medium">
                                                                                    Enter your CGPA in chat to check personal eligibility.
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Action Buttons */}
                                                                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2">
                                                                            {evalRes.hasMetrics && evalRes.isEligible ? (
                                                                                <button
                                                                                    disabled={isApplied}
                                                                                    onClick={() => handleCardAction('apply', drive)}
                                                                                    className={`flex-1 py-1.5 px-3 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                                                                                        isApplied
                                                                                            ? 'bg-emerald-600/50 text-white cursor-default'
                                                                                            : 'bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] hover:brightness-110 text-white'
                                                                                    }`}
                                                                                >
                                                                                    {isApplied ? (
                                                                                        <>
                                                                                            <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                                                                                            <span>Slot Confirmed</span>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <Zap className="w-3.5 h-3.5 text-yellow-300" />
                                                                                            <span>Apply Now</span>
                                                                                        </>
                                                                                    )}
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => handleCardAction('gap', drive)}
                                                                                    className="flex-1 py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-medium text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                                                                >
                                                                                    <Sparkles className="w-3 h-3 text-cyan-300" />
                                                                                    <span>View Cutoff Breakdown</span>
                                                                                </button>
                                                                            )}

                                                                            <button
                                                                                onClick={() => handleCardAction('rounds', drive)}
                                                                                className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-medium text-[11px] flex items-center justify-center gap-1 transition-all border border-white/10 cursor-pointer"
                                                                            >
                                                                                Rounds
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleCardAction('prep', drive)}
                                                                                className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-medium text-[11px] flex items-center justify-center gap-1 transition-all border border-white/10 cursor-pointer"
                                                                            >
                                                                                Prep
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sequential Interview Rounds View */}
                                            {msg.type === 'rounds' && msg.roundsList && (
                                                <div className="mt-3 space-y-2.5">
                                                    <div className="font-montserrat font-bold text-white text-xs border-b border-white/10 pb-1 flex items-center justify-between">
                                                        <span>{msg.company} — {msg.roleTitle}</span>
                                                        <span className="text-[10px] text-cyan-300 font-normal">
                                                            {msg.roundsList.length} Stages
                                                        </span>
                                                    </div>

                                                    {msg.statusText && (
                                                        <div className="text-[11px] px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white font-medium">
                                                            {msg.statusText}
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        {msg.roundsList.map((round) => (
                                                            <div key={round.sequence} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                                                                <div className="flex items-center justify-between text-xs font-semibold text-white">
                                                                    <span>{round.name}</span>
                                                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-200 text-[10px] font-mono">
                                                                        {round.duration}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[10px] text-white/70">
                                                                    Focus: {round.focus}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {msg.prepTips && (
                                                        <div className="text-[10px] p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-200">
                                                            <span className="font-bold text-white">💡 Preparation Tip: </span>
                                                            {msg.prepTips}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Suggested Functions Shelf */}
                                            {msg.suggestedFunctions && msg.suggestedFunctions.length > 0 && (
                                                <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                                                    <div className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1">
                                                        <Zap className="w-3 h-3 text-cyan-300" />
                                                        <span>Suggested Functions</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {msg.suggestedFunctions.map((fn, fIdx) => (
                                                            <button
                                                                key={fIdx}
                                                                onClick={() => {
                                                                    if (typeof fn.action === 'function') {
                                                                        fn.action();
                                                                    } else {
                                                                        handleExecuteFunction(fn);
                                                                    }
                                                                }}
                                                                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/20 hover:border-cyan-400/40 transition-all flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <span>{fn.icon}</span>
                                                                <span>{fn.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Timestamp */}
                                            <div className="mt-2 text-[10px] text-white/40 flex justify-end">
                                                {msg.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex items-center gap-2 p-3 rounded-2xl rounded-bl-none bg-white/[0.06] border border-white/10 w-24">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Action Chips Footer */}
                            <div className="px-4 py-2 border-t border-white/10 bg-black/30 flex gap-2 overflow-x-auto scrollbar-none">
                                {[
                                    { label: '🎯 Eligible Drives', query: 'Show my eligible drives' },
                                    { label: '📅 All Upcoming Drives', query: 'What are all the upcoming drives?' },
                                    { label: '🏢 Zoho Interview Rounds', query: 'What are the rounds for Zoho?' },
                                    { label: '📦 Amazon Requirements', query: 'What do I need for Amazon?' },
                                    { label: '📊 CTC Comparison', query: 'Compare packages and CTC' }
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(item.query)}
                                        className="shrink-0 text-[11px] font-medium px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* Input Form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="p-3 bg-[#03151d] border-t border-white/10 flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={
                                        activeProfile.isAuthenticated 
                                            ? "Ask about your eligible drives, upcoming deadlines, rounds..." 
                                            : "Ask about drives, or type 'I have 8.2 CGPA in CSE'..."
                                    }
                                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] text-white hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default AiCopilotChat;
