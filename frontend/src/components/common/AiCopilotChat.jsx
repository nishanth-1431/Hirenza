import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Bot, X, Send, RotateCcw, Copy, Check, ChevronDown, 
    MessageSquare, Zap, ShieldCheck, Briefcase, GraduationCap, ArrowRight, CornerDownLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

/**
 * Knowledge base for deterministic placement assistance
 * Used for instant, accurate campus recruitment guidance
 */
const KNOWLEDGE_BASE = {
    zoho: {
        company: 'Zoho Corporation',
        role: 'Software Development Engineer (SDE)',
        cgpaCutoff: 7.5,
        maxArrears: 0,
        allowedBranches: ['CSE', 'IT', 'ECE'],
        rounds: [
            'Round 1: Online Aptitude & Basic C/Java Programming (90 mins)',
            'Round 2: Advanced Data Structures & Algorithm Coding (3 problems)',
            'Round 3: System Design & Tech Interview 1',
            'Round 4: General HR & Culture Alignment'
        ],
        prepTips: 'Focus on recursion, matrix manipulation, pointers/references, and time complexity optimization.'
    },
    amazon: {
        company: 'Amazon',
        role: 'SDE 1 (Campus)',
        cgpaCutoff: 8.5,
        maxArrears: 0,
        allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        rounds: [
            'Round 1: Online Assessment (OA) - 2 Coding questions + Work Style Assessment',
            'Round 2: Technical Interview 1 - Data Structures, Trees, Graphs & Dynamic Programming',
            'Round 3: Technical Interview 2 - Object Oriented Design & System Architecture',
            'Round 4: Bar Raiser & Amazon Leadership Principles (LP)'
        ],
        prepTips: 'Master LeetCode Medium/Hard DP and Trees. Review all 16 Leadership Principles with STAR format examples.'
    },
    tcs: {
        company: 'TCS Digital / Prime',
        role: 'Systems Engineer & Digital Developer',
        cgpaCutoff: 7.0,
        maxArrears: 1,
        allowedBranches: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'],
        rounds: [
            'Round 1: National Qualifier Test (NQT) - Cognitive & Advanced Coding',
            'Round 2: Technical Interview (Core CS, DBMS, OOPs, SQL)',
            'Round 3: HR & Management Interview'
        ],
        prepTips: 'Strong fundamentals in SQL queries, indexing, normalization, and OOP concepts in Java/Python.'
    }
};

const AiCopilotChat = () => {
    const { user, role } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    // Initial message welcoming user based on role
    const getWelcomeMessage = () => {
        if (!user) {
            return "👋 Welcome to **Hirenza**! I'm your AI Placement Copilot. Ask me anything about our automated campus drives, eligibility rule engine, or interview round progression.";
        }
        if (role === 'STUDENT') {
            return `👋 Hi **${user.name || 'Student'}**! I'm your Placement Copilot. Ask me about your eligibility for active drives (Zoho, Amazon, TCS), interview round preparation, or resume feedback.`;
        }
        if (role === 'HR') {
            return `👋 Welcome **${user.name || 'HR Recruiter'}**! I can help you architect multi-role drives, structure 1..N interview rounds, or draft evaluation criteria.`;
        }
        return `👋 Welcome **${user.name || 'TPO Officer'}**! I'm here to assist with placement policy governance, drive announcements, or student progression summaries.`;
    };

    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'bot',
            text: getWelcomeMessage(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    // Role-specific quick action suggestion prompts
    const getQuickPrompts = () => {
        if (!user) {
            return [
                "How does eligibility gating work?",
                "What are the 3 portals?",
                "How does Hirenza prevent bypasses?",
                "Tell me about active campus drives"
            ];
        }
        if (role === 'STUDENT') {
            return [
                "Am I eligible for Zoho SDE?",
                "What are the rounds for Amazon?",
                "Give me 3 Java tech interview questions",
                "How do I clear technical round 1?"
            ];
        }
        if (role === 'HR') {
            return [
                "How do I create a multi-role drive?",
                "Suggest a 4-round tech evaluation pipeline",
                "What are recommended CGPA cutoffs?",
                "How to advance candidates to Round 2?"
            ];
        }
        return [
            "Draft a WhatsApp announcement for Amazon",
            "What is the standard campus placement policy?",
            "How does the automated rule engine work?",
            "Export student drive statistics"
        ];
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Intelligent context-aware offline reasoning fallback
    const generateLocalResponse = (query) => {
        const q = query.toLowerCase();

        // 1. Zoho queries
        if (q.includes('zoho')) {
            const z = KNOWLEDGE_BASE.zoho;
            return `### 🏢 ${z.company} — ${z.role}\n\n` +
                   `* **Eligibility Cutoff**: **${z.cgpaCutoff} CGPA**, maximum **${z.maxArrears} standing backlogs**.\n` +
                   `* **Eligible Branches**: ${z.allowedBranches.join(', ')}.\n\n` +
                   `**Interview Rounds Workflow:**\n` +
                   z.rounds.map(r => `* ${r}`).join('\n') + `\n\n` +
                   `💡 **Prep Recommendation:** ${z.prepTips}`;
        }

        // 2. Amazon queries
        if (q.includes('amazon')) {
            const a = KNOWLEDGE_BASE.amazon;
            return `### 📦 ${a.company} — ${a.role}\n\n` +
                   `* **Eligibility Cutoff**: **${a.cgpaCutoff} CGPA**, strictly **${a.maxArrears} standing backlogs**.\n` +
                   `* **Eligible Branches**: ${a.allowedBranches.join(', ')}.\n\n` +
                   `**Sequential Interview Pipeline:**\n` +
                   a.rounds.map(r => `* ${r}`).join('\n') + `\n\n` +
                   `💡 **Prep Recommendation:** ${a.prepTips}`;
        }

        // 3. TCS queries
        if (q.includes('tcs') || q.includes('prime') || q.includes('digital')) {
            const t = KNOWLEDGE_BASE.tcs;
            return `### 💼 ${t.company} — ${t.role}\n\n` +
                   `* **Eligibility Cutoff**: **${t.cgpaCutoff} CGPA**, max **${t.maxArrears} backlog allowed**.\n` +
                   `* **Eligible Branches**: All Engineering Branches (${t.allowedBranches.join(', ')}).\n\n` +
                   `**Hiring Stages:**\n` +
                   t.rounds.map(r => `* ${r}`).join('\n') + `\n\n` +
                   `💡 **Prep Recommendation:** ${t.prepTips}`;
        }

        // 4. Eligibility check query
        if (q.includes('eligible') || q.includes('eligibility') || q.includes('cgpa') || q.includes('am i')) {
            const studentGreeting = user?.name ? `Hello **${user.name}**, your profile is evaluated with zero manual bypass:` : `Our system applies **zero-bypass automated gating** before any candidate can submit an application:`;
            return `### 🎯 Deterministic Eligibility Engine in Hirenza\n\n` +
                   `${studentGreeting}\n\n` +
                   `1. **CGPA Gate**: Evaluates current student cumulative GPA against the drive's cutoff threshold.\n` +
                   `2. **Standing Arrears Filter**: Verifies that active backlogs equal 0 (or configured limit).\n` +
                   `3. **Branch Whitelisting**: Restricts applications strictly to allowed engineering branches.\n\n` +
                   `*Current Active Cutoffs:*\n` +
                   `* **Amazon**: ≥ 8.5 CGPA, 0 Arrears (CSE / IT / ECE / EEE)\n` +
                   `* **Zoho**: ≥ 7.5 CGPA, 0 Arrears (CSE / IT / ECE)\n` +
                   `* **TCS Digital**: ≥ 7.0 CGPA, ≤ 1 Arrear (All Branches)`;
        }

        // 5. Mock Interview / Coding Questions
        if (q.includes('question') || q.includes('mock') || q.includes('interview') || q.includes('prep')) {
            return `### 💻 Top Technical Interview Questions for Campus SDE:\n\n` +
                   `**1. Data Structures & Algorithms:**\n` +
                   `* *Problem:* Find the longest palindromic substring in $O(n^2)$ or $O(n)$ time.\n` +
                   `* *Follow-up:* Can you optimize using Manacher's Algorithm or Dynamic Programming?\n\n` +
                   `**2. Core Java & Concurrency:**\n` +
                   `* *Question:* How does Java 17 \`ConcurrentHashMap\` handle lock striping compared to \`Hashtable\`?\n` +
                   `* *Concept:* \`volatile\` memory visibility vs \`synchronized\` monitor lock.\n\n` +
                   `**3. System Design & Database:**\n` +
                   `* *Question:* How does a B-Tree index speed up range queries in MySQL InnoDB vs Hash indexing?`;
        }

        // 6. WhatsApp / Email Announcement (TPO usecase)
        if (q.includes('announcement') || q.includes('whatsapp') || q.includes('email') || q.includes('draft')) {
            return `### 📢 Draft Drive Announcement Template:\n\n` +
                   `\`\`\`text\n` +
                   `[HIRENZA PLACEMENT ALERT]\n` +
                   `Company: Amazon Campus Drive 2026\n` +
                   `Role: Software Development Engineer (SDE 1)\n` +
                   `Eligibility: CGPA >= 8.5 | 0 Active Arrears | CSE, IT, ECE\n` +
                   `Application Deadline: 25 Oct 2026, 11:59 PM\n\n` +
                   `Action Required: Eligible candidates please login to Hirenza to confirm slot.\n` +
                   `\`\`\`\n\n` +
                   `*Can be dispatched via Hirenza's Twilio WhatsApp and JavaMail asynchronous queues.*`;
        }

        // 7. General Platform queries
        return `### 🤖 Hirenza AI Placement Assistant\n\n` +
               `I can assist you with:\n\n` +
               `* **Live Drive Eligibility**: Ask *"Am I eligible for Zoho?"* or *"Check cutoff for Amazon"*\n` +
               `* **Interview Preparation**: Ask *"Give me 3 Java questions"* or *"How to prepare for Round 1"*\n` +
               `* **HR Recruitment Pipelines**: Ask *"How to structure 4 interview rounds"*\n` +
               `* **TPO Governance**: Ask *"Draft announcement"* or *"How does rule engine work"*\n\n` +
               `What specific topic would you like to explore?`;
    };

    const handleSend = async (textToSend = input) => {
        const query = textToSend.trim();
        if (!query || isTyping) return;

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
            // Attempt backend call to Spring Boot Spring AI endpoint
            const res = await axios.post('/api/ai/chat', {
                message: query,
                role: role || 'GUEST',
                userId: user?.id || null,
                email: user?.email || null
            }, { timeout: 3500 });

            if (res.data && res.data.reply) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        sender: 'bot',
                        text: res.data.reply,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ]);
                setIsTyping(false);
                return;
            }
        } catch (err) {
            // Graceful fallback to client knowledge engine
        }

        // Simulate fast, natural typing delay
        setTimeout(() => {
            const botReply = generateLocalResponse(query);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: botReply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setIsTyping(false);
        }, 550);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const clearChat = () => {
        setMessages([
            {
                id: 'welcome-reset',
                sender: 'bot',
                text: getWelcomeMessage(),
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
                            {/* Animated glowing ring */}
                            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity animate-pulse" />
                            
                            <div className="relative flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
                                </div>
                                <span className="font-montserrat font-bold text-xs sm:text-sm tracking-wide text-white">
                                    AI Copilot
                                </span>
                                <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-white/20 text-cyan-100">
                                    {role ? role : 'Ask'}
                                </span>
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Chatbox Window */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-[calc(100vw-2rem)] sm:w-[420px] max-w-[430px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-[#041c26]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(3,18,26,0.85)] overflow-hidden font-poppins"
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
                                                {role ? `${role} Portal` : 'Public Knowledge'}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-white/70">
                                    <button
                                        onClick={clearChat}
                                        title="Clear conversation"
                                        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        title="Close Copilot"
                                        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Message List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
                                {messages.map((msg, index) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                                                msg.sender === 'user'
                                                    ? 'bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] text-white rounded-br-none shadow-md'
                                                    : 'bg-white/[0.07] text-[#DEF2F1] rounded-bl-none border border-white/10 shadow-sm'
                                            }`}
                                        >
                                            <div className="prose prose-invert text-xs max-w-none space-y-1.5">
                                                {msg.text.split('\n\n').map((para, pIdx) => {
                                                    // Helper to parse **bold** and `code` inline
                                                    const renderInline = (str) => {
                                                        const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
                                                        return parts.map((part, i) => {
                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                return (
                                                                    <strong key={i} className="font-semibold text-white">
                                                                        {part.slice(2, -2)}
                                                                    </strong>
                                                                );
                                                            }
                                                            if (part.startsWith('`') && part.endsWith('`')) {
                                                                return (
                                                                    <code key={i} className="px-1 py-0.5 rounded bg-black/30 text-cyan-200 font-mono text-[10px]">
                                                                        {part.slice(1, -1)}
                                                                    </code>
                                                                );
                                                            }
                                                            return part;
                                                        });
                                                    };

                                                    if (para.startsWith('### ')) {
                                                        return (
                                                            <div key={pIdx} className="font-montserrat font-bold text-white text-xs pt-1 pb-0.5 border-b border-white/10">
                                                                {renderInline(para.replace('### ', ''))}
                                                            </div>
                                                        );
                                                    }
                                                    if (para.startsWith('```')) {
                                                        const clean = para.replace(/```[a-z]*\n?/g, '');
                                                        return (
                                                            <pre key={pIdx} className="p-2 rounded bg-black/40 font-mono text-[10px] text-cyan-200 overflow-x-auto my-1 border border-white/10">
                                                                {clean}
                                                            </pre>
                                                        );
                                                    }
                                                    return (
                                                        <p key={pIdx} className="m-0 leading-relaxed">
                                                            {para.split('\n').map((line, lIdx) => (
                                                                <React.Fragment key={lIdx}>
                                                                    {line.startsWith('* ') ? (
                                                                        <span className="block pl-2 text-white/90">
                                                                            • {renderInline(line.replace('* ', ''))}
                                                                        </span>
                                                                    ) : (
                                                                        renderInline(line)
                                                                    )}
                                                                    {lIdx < para.split('\n').length - 1 && <br />}
                                                                </React.Fragment>
                                                            ))}
                                                        </p>
                                                    );
                                                })}
                                            </div>

                                            {/* Footer metadata */}
                                            <div className="mt-2 flex items-center justify-between text-[10px] text-white/50 border-t border-white/5 pt-1.5">
                                                <span>{msg.timestamp}</span>
                                                {msg.sender === 'bot' && (
                                                    <button
                                                        onClick={() => handleCopy(msg.text, index)}
                                                        className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                                                    >
                                                        {copiedIndex === index ? (
                                                            <>
                                                                <Check className="w-3 h-3 text-emerald-400" />
                                                                <span className="text-emerald-400">Copied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-3 h-3" />
                                                                <span>Copy</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
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

                            {/* Quick Action Suggestion Chips */}
                            <div className="px-4 py-2 border-t border-white/10 bg-black/20 flex gap-2 overflow-x-auto scrollbar-none">
                                {getQuickPrompts().map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(prompt)}
                                        className="shrink-0 text-[11px] font-medium px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        {prompt}
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
                                        role === 'STUDENT' 
                                            ? "Ask about eligibility, interview rounds, prep..." 
                                            : "Ask Hirenza Copilot anything..."
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
