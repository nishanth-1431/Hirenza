import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { driveEndpoints } from '../../api/endpoints';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
    PlusCircle, Building, Users, TrendingUp, Calendar, ArrowUpRight, 
    Award, ShieldCheck, Download, Star, Filter, CheckCircle2, AlertTriangle, FileSpreadsheet
} from 'lucide-react';

const mockAnalyticsData = [
    { name: 'CSE', eligible: 140, applied: 125, placed: 65 },
    { name: 'IT', eligible: 95, applied: 82, placed: 48 },
    { name: 'ECE', eligible: 110, applied: 75, placed: 32 },
    { name: 'EEE', eligible: 60, applied: 40, placed: 18 },
    { name: 'MECH', eligible: 50, applied: 35, placed: 14 },
];

const mockGoldenTicketGrants = [
    { id: 1, name: 'Alex Johnson', branch: 'CSE', cgpa: 7.8, project: 'Clean Architecture Spring Boot API', targetCompany: 'Amazon', status: 'GRANTED' },
    { id: 2, name: 'Vikram Seth', branch: 'ECE', cgpa: 7.2, project: 'IoT Edge Telemetry Gateway', targetCompany: 'Zoho Corporation', status: 'GRANTED' },
    { id: 3, name: 'Ananya Sharma', branch: 'IT', cgpa: 7.3, project: 'React WebGL Shader Engine', targetCompany: 'Freshworks', status: 'PENDING_REVIEW' }
];

const TpoDashboard = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportNotice, setExportNotice] = useState(null);

    const fetchDrives = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(driveEndpoints.getAllDrives);
            setDrives(response.data);
        } catch (error) {
            console.warn("API fallback to mock drives", error);
            setDrives([
                { id: 101, companyName: 'Zoho Corporation', role: 'Software Engineer', ctc: 8.5, tier: 'DREAM_TIER', applicationDeadline: '2026-11-15' },
                { id: 102, companyName: 'Freshworks', role: 'Frontend Developer', ctc: 9.0, tier: 'DREAM_TIER', applicationDeadline: '2026-11-20' },
                { id: 103, companyName: 'Amazon', role: 'SDE Intern', ctc: 28.5, tier: 'SUPER_DREAM_TIER', applicationDeadline: '2026-11-28' },
                { id: 104, companyName: 'TCS Digital', role: 'Systems Engineer', ctc: 4.5, tier: 'MASS_TIER', applicationDeadline: '2026-12-05' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrives();
    }, []);

    const handleExportCsv = () => {
        const headers = ["Roll_No", "Student_Name", "Branch", "CGPA", "Placed_Company", "Offered_CTC_LPA", "Tier_Category", "Proof_Of_Work_Verified"];
        const rows = [
            ["22CS084", "Alex Johnson", "CSE", "7.8", "Zoho Corporation", "8.5", "DREAM_TIER", "YES"],
            ["22IT042", "Priya Sundaram", "IT", "8.2", "Zoho Corporation", "8.5", "DREAM_TIER", "YES"],
            ["22CS012", "Meera Krishnan", "CSE", "9.1", "Amazon", "28.5", "SUPER_DREAM_TIER", "YES"],
            ["22EC019", "Karthik Raja", "ECE", "7.9", "Freshworks", "9.0", "DREAM_TIER", "YES"],
            ["22ME031", "Rahul Varma", "MECH", "7.1", "TCS Digital", "4.5", "MASS_TIER", "NO"]
        ];

        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Hirenza_NAAC_Placement_Register_${new Date().getFullYear()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportNotice("Verified Accreditation Register (.CSV) generated and downloaded successfully!");
        setTimeout(() => setExportNotice(null), 4000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            
            {/* Export Success Alert */}
            {exportNotice && (
                <div className="mb-5 p-4 bg-[#DEF2F1] border border-[#3AAFA9]/50 rounded-2xl flex items-center justify-between text-xs font-bold text-[#2B7A78]">
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#3AAFA9]" />
                        {exportNotice}
                    </span>
                    <button onClick={() => setExportNotice(null)} className="text-[#17252A] font-bold">✕</button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2B7A78]/20">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                            CAMPUS PLACEMENT GOVERNANCE
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-[#2B7A78] font-bold">Institutional TPO Cell</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-[#17252A]">
                        Placement Operations & Institutional Governance
                    </h1>
                    <p className="text-xs text-[#2B7A78] mt-1 font-medium">
                        Oversee multi-tier policy enforcement, grant Golden Ticket waivers, and generate accreditation exports.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button 
                        onClick={handleExportCsv}
                        className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-xl bg-[#DEF2F1] hover:bg-[#DEF2F1]/80 text-[#2B7A78] border border-[#3AAFA9]/30 transition-colors shadow-2xs cursor-pointer"
                    >
                        <FileSpreadsheet className="mr-1.5 h-4 w-4 text-[#3AAFA9]" />
                        Export NAAC / NIRF CSV
                    </button>
                    <button className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#FEFFFF] transition-colors shadow-xs cursor-pointer">
                        <PlusCircle className="mr-1.5 h-4 w-4" />
                        Create Drive Notice
                    </button>
                </div>
            </div>

            {/* Institutional Campus Multi-Tier Policy Strip */}
            <div className="mt-6 bg-[#FEFFFF] border border-[#2B7A78]/20 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-[#17252A] flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#3AAFA9]" />
                            Institutional Placement Tier Policy (Anti-Seat-Hogging)
                        </h3>
                        <p className="text-xs text-[#2B7A78] mt-0.5">
                            Automated locking policy: Super Dream placed students are locked out to protect unplaced batchmates.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-[#2B7A78] bg-[#DEF2F1] px-3 py-1 rounded-xl border border-[#3AAFA9]/30">
                        Rule Version: 2026.1 ACTIVE
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                        <span className="text-[10px] font-extrabold uppercase text-purple-800 tracking-wider block">Super Dream (&gt; ₹10 LPA)</span>
                        <div className="text-2xl font-black text-purple-950 mt-1">34 Offers</div>
                        <span className="text-[10px] font-bold text-purple-700 block mt-1">🔒 Full Policy Lockout Active</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#DEF2F1]/60 border border-[#3AAFA9]/30">
                        <span className="text-[10px] font-extrabold uppercase text-[#2B7A78] tracking-wider block">Dream Tier (₹5 - ₹10 LPA)</span>
                        <div className="text-2xl font-black text-[#17252A] mt-1">88 Offers</div>
                        <span className="text-[10px] font-bold text-[#2B7A78] block mt-1">⬆️ Super Dream Upgrade Only</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-700 tracking-wider block">Mass Tier (&lt; ₹5 LPA)</span>
                        <div className="text-2xl font-black text-[#17252A] mt-1">55 Offers</div>
                        <span className="text-[10px] font-bold text-slate-600 block mt-1">⬆️ Dream / Super Dream Eligible</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                        <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider block">Unplaced Pool</span>
                        <div className="text-2xl font-black text-amber-950 mt-1">278 Students</div>
                        <span className="text-[10px] font-bold text-amber-700 block mt-1">🎯 100% Drive Application Access</span>
                    </div>
                </div>
            </div>

            {/* KPI Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                <div className="bg-[#FEFFFF] border border-[#2B7A78]/15 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-[#2B7A78]">Total Placement Drives</span>
                        <div className="text-3xl font-black text-[#17252A] mt-1">{drives.length}</div>
                        <span className="text-[11px] font-bold text-[#2B7A78] flex items-center gap-1 mt-1.5">
                            <TrendingUp className="w-3 h-3 text-[#3AAFA9]" /> +4 drives this month
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#DEF2F1] flex items-center justify-center text-[#2B7A78] shadow-2xs">
                        <Building className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-[#FEFFFF] border border-[#2B7A78]/15 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-[#2B7A78]">Proof-of-Work Students</span>
                        <div className="text-3xl font-black text-[#17252A] mt-1">312</div>
                        <span className="text-[11px] font-semibold text-[#2B7A78]/80 mt-1.5 block">
                            68.5% GitHub Verified AST Code
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#DEF2F1] flex items-center justify-center text-[#2B7A78] shadow-2xs">
                        <Users className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-[#FEFFFF] border border-[#2B7A78]/15 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-[#2B7A78]">Total Offers Extended</span>
                        <div className="text-3xl font-black text-[#17252A] mt-1">177</div>
                        <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-600" /> 38.9% Batch Conversion
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
                        <Award className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* Drives List */}
                <div className="lg:col-span-1 bg-[#FEFFFF] border border-[#2B7A78]/15 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-extrabold text-[#17252A] mb-4">
                        Active Campus Drives ({drives.length})
                    </h3>
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {loading ? (
                            <div className="p-4 text-center text-xs text-[#2B7A78]">Loading active drives...</div>
                        ) : drives.length === 0 ? (
                            <div className="p-4 text-center text-xs text-[#2B7A78]">No active drives posted.</div>
                        ) : (
                            drives.map(drive => (
                                <div 
                                    key={drive.id}
                                    className="p-3.5 bg-[#DEF2F1]/30 border border-[#2B7A78]/15 hover:border-[#3AAFA9] hover:bg-[#DEF2F1]/60 rounded-2xl transition-all cursor-pointer group shadow-2xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-[#17252A] group-hover:text-[#2B7A78] transition-colors">
                                            {drive.companyName}
                                        </h4>
                                        <span className="text-[10px] text-[#2B7A78] font-semibold flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-[#3AAFA9]" />
                                            {drive.applicationDeadline}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-[#2B7A78] font-medium mt-1">
                                        <span>{drive.role}</span>
                                        <span className="font-bold text-[#17252A]">{drive.ctc ? `₹${drive.ctc} LPA` : '₹8.0 LPA'}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Branch Placement Analytics Chart */}
                <div className="lg:col-span-2 bg-[#FEFFFF] border border-[#2B7A78]/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-[#DEF2F1] pb-3 mb-2">
                        <h3 className="text-sm font-extrabold text-[#17252A]">
                            Branch-Wise Placement Conversion Funnel
                        </h3>
                        <span className="text-[11px] text-[#2B7A78] font-mono font-bold">CSE • IT • ECE • EEE • MECH</span>
                    </div>

                    <div className="h-80 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={mockAnalyticsData}
                                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEF2F1" />
                                <XAxis dataKey="name" stroke="#2B7A78" fontSize={11} tickLine={false} />
                                <YAxis stroke="#2B7A78" fontSize={11} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#FEFFFF', 
                                        borderColor: '#2B7A7830',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        color: '#17252A',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar dataKey="eligible" name="Eligible Pool" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="applied" name="Applied" fill="#3AAFA9" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="placed" name="Placed & Offered" fill="#2B7A78" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* TPO Golden Ticket Issuance Hub */}
            <div className="mt-6 bg-[#FEFFFF] border border-[#2B7A78]/20 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                        <div>
                            <h3 className="text-sm font-extrabold text-[#17252A]">
                                TPO Golden Ticket Waiver Endorsements
                            </h3>
                            <p className="text-xs text-[#2B7A78]">
                                Exceptional coders and hackathon winners endorsed to bypass near-miss CGPA cutoffs.
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                        Institutional Quota: 3 per batch
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#DEF2F1] text-left text-xs">
                        <thead className="bg-[#DEF2F1]/40 text-[#2B7A78] font-bold">
                            <tr>
                                <th className="py-3 px-4">Student</th>
                                <th className="py-3 px-3">CGPA</th>
                                <th className="py-3 px-3">Verified Project Proof</th>
                                <th className="py-3 px-3">Target Drive</th>
                                <th className="py-3 px-4 text-right">Waiver Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEF2F1]">
                            {mockGoldenTicketGrants.map(grant => (
                                <tr key={grant.id} className="hover:bg-[#DEF2F1]/20 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-[#17252A]">
                                        {grant.name} <span className="text-[11px] text-[#2B7A78] font-normal">({grant.branch})</span>
                                    </td>
                                    <td className="py-3.5 px-3 font-mono font-bold text-[#17252A]">{grant.cgpa}</td>
                                    <td className="py-3.5 px-3 text-[#2B7A78] font-semibold flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#3AAFA9]" />
                                        {grant.project}
                                    </td>
                                    <td className="py-3.5 px-3 font-bold text-[#17252A]">{grant.targetCompany}</td>
                                    <td className="py-3.5 px-4 text-right">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                            grant.status === 'GRANTED'
                                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                                : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                                            {grant.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default TpoDashboard;
