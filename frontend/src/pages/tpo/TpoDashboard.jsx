import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { driveEndpoints } from '../../api/endpoints';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, Building, Users, TrendingUp, Calendar, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';

const mockAnalyticsData = [
    { name: 'CSE', eligible: 140, applied: 125, placed: 65 },
    { name: 'IT', eligible: 95, applied: 82, placed: 48 },
    { name: 'ECE', eligible: 110, applied: 75, placed: 32 },
    { name: 'EEE', eligible: 60, applied: 40, placed: 18 },
    { name: 'MECH', eligible: 50, applied: 35, placed: 14 },
];

const TpoDashboard = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDrives = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(driveEndpoints.getAllDrives);
            setDrives(response.data);
        } catch (error) {
            console.warn("API fallback to mock drives", error);
            setDrives([
                { id: 101, companyName: 'Zoho Corporation', role: 'Software Engineer', applicationDeadline: '2026-11-15' },
                { id: 102, companyName: 'Freshworks', role: 'Frontend Developer', applicationDeadline: '2026-11-20' },
                { id: 103, companyName: 'Amazon', role: 'SDE Intern', applicationDeadline: '2026-11-28' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrives();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                            CAMPUS PLACEMENT GOVERNANCE
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-600 font-semibold">Institutional TPO Cell</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Placement Operations & Analytics
                    </h1>
                    <p className="text-xs text-slate-600 mt-1">
                        Monitor college-wide drive conversion, branch-wise placement ratios, and company registrations.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs cursor-pointer">
                        <PlusCircle className="mr-1.5 h-4 w-4" />
                        Create Drive Notice
                    </button>
                </div>
            </div>

            {/* KPI Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500">Total Placement Drives</span>
                        <div className="text-3xl font-extrabold text-slate-900 mt-1">{drives.length}</div>
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-1.5">
                            <TrendingUp className="w-3 h-3" /> +4 drives this month
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs">
                        <Building className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500">Registered Students</span>
                        <div className="text-3xl font-extrabold text-slate-900 mt-1">455</div>
                        <span className="text-[11px] font-medium text-slate-600 mt-1.5 block">
                            94% Profile Verification Rate
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs">
                        <Users className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500">Offers Extended</span>
                        <div className="text-3xl font-extrabold text-slate-900 mt-1">177</div>
                        <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 mt-1.5">
                            <Award className="w-3.5 h-3.5" /> 38.9% Placement Conversion
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
                        <Award className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* Drives List */}
                <div className="lg:col-span-1 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">
                        Active Campus Drives ({drives.length})
                    </h3>
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {loading ? (
                            <div className="p-4 text-center text-xs text-slate-500">Loading active drives...</div>
                        ) : drives.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">No active drives posted.</div>
                        ) : (
                            drives.map(drive => (
                                <div 
                                    key={drive.id}
                                    className="p-3.5 bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70 rounded-xl transition-all cursor-pointer group shadow-2xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {drive.companyName}
                                        </h4>
                                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-slate-400" />
                                            {drive.applicationDeadline}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium mt-1">{drive.role}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Analytics Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-900">
                            Branch-Wise Placement Funnel
                        </h3>
                        <span className="text-[11px] text-slate-500 font-mono font-medium">CSE • IT • ECE • EEE • MECH</span>
                    </div>

                    <div className="h-80 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={mockAnalyticsData}
                                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff', 
                                        borderColor: '#e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar dataKey="eligible" name="Eligible Pool" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="applied" name="Applied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="placed" name="Placed & Offered" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default TpoDashboard;
