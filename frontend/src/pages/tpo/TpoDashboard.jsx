import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { driveEndpoints } from '../../api/endpoints';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, Building, Users } from 'lucide-react';

const mockAnalyticsData = [
    { name: 'CSE', eligible: 120, applied: 95, placed: 40 },
    { name: 'IT', eligible: 80, applied: 70, placed: 35 },
    { name: 'ECE', eligible: 100, applied: 60, placed: 20 },
    { name: 'EEE', eligible: 40, applied: 30, placed: 10 },
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
            console.error("Failed to fetch drives", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrives();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">TPO Dashboard</h1>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Drive
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                    <div className="p-5 flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Drives</dt>
                            <dd className="text-2xl font-semibold text-gray-900">{drives.length}</dd>
                        </div>
                    </div>
                </div>
                
                {/* Mock stat cards for UI presentation */}
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                    <div className="p-5 flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                            <dd className="text-2xl font-semibold text-gray-900">340</dd>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                    <div className="p-5 flex items-center">
                        <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 truncate">Overall Placement</dt>
                            <dd className="text-2xl font-semibold text-gray-900">32%</dd>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Drives List */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Active Drives</h3>
                        </div>
                        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-sm text-gray-500">Loading drives...</div>
                            ) : drives.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">No active drives.</div>
                            ) : (
                                drives.map(drive => (
                                    <li key={drive.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                                        <div className="flex space-x-3">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">{drive.companyName}</h3>
                                                    <p className="text-sm text-gray-500">{new Date(drive.applicationDeadline).toLocaleDateString()}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">{drive.role}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Analytics Chart */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Branch-wise Analytics (Mock Data)</h3>
                        <div className="h-80 w-full">
                            {/* TODO: Fetch real analytics data when backend endpoint is ready */}
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={mockAnalyticsData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="eligible" name="Eligible" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="applied" name="Applied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="placed" name="Placed" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default TpoDashboard;
