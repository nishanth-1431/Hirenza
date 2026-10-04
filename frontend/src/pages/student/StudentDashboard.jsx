import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { studentEndpoints } from '../../api/endpoints';
import { Upload, Briefcase, FileText, CheckCircle, XCircle } from 'lucide-react';

const MatchScoreBadge = ({ score }) => {
    // Score is 0.0 to 1.0. 
    const percentage = Math.round(score * 100);
    
    let colorClass = "bg-red-100 text-red-800";
    if (percentage >= 70) colorClass = "bg-green-100 text-green-800";
    else if (percentage >= 40) colorClass = "bg-yellow-100 text-yellow-800";

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            AI Match: {percentage}%
        </span>
    );
};

const DriveCard = ({ driveMatch }) => {
    const { drive, score } = driveMatch;
    
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 transition-all hover:shadow-md">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                            <Briefcase className="mr-2 h-5 w-5 text-gray-400" />
                            {drive.companyName}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {drive.role}
                        </p>
                    </div>
                    <MatchScoreBadge score={score} />
                </div>
                
                <div className="mt-4 border-t border-gray-100 pt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                            <dd className="mt-1 text-sm text-gray-900">{new Date(drive.applicationDeadline).toLocaleDateString()}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {drive.eligible ? (
                                    <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Eligible</span>
                                ) : (
                                    <span className="text-red-600 flex items-center"><XCircle className="w-4 h-4 mr-1"/> Not Eligible</span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
                
                <div className="mt-5">
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                        View Details & Apply
                    </button>
                </div>
            </div>
        </div>
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
            // Refresh drives to get updated AI match scores
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Student Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Drives */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-lg shadow">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Eligible Drives
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Ranked by AI semantic match against your resume.
                        </p>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="h-32 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    ) : drives.length === 0 ? (
                        <div className="text-center py-10 bg-white shadow rounded-lg text-gray-500">
                            No drives match your profile right now.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {drives.map((match, idx) => (
                                <DriveCard key={match.drive.id || idx} driveMatch={match} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Profile & Actions */}
                <div className="space-y-6">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                                <FileText className="mr-2 w-5 h-5 text-gray-400" />
                                Update Resume
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Upload your latest resume text to improve your AI match accuracy.</p>
                            </div>
                            <form className="mt-5" onSubmit={handleResumeUpload}>
                                <textarea
                                    rows={4}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="Paste resume text here..."
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    disabled={uploading}
                                />
                                <button
                                    type="submit"
                                    disabled={uploading || !resumeText.trim()}
                                    className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 sm:text-sm w-full disabled:opacity-50"
                                >
                                    {uploading ? 'Processing via Ollama...' : (
                                        <>
                                            <Upload className="mr-2 w-4 h-4" />
                                            Update Resume
                                        </>
                                    )}
                                </button>
                                {uploadSuccess && (
                                    <p className="mt-2 text-sm text-green-600 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Resume updated!
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
