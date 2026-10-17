export const API_BASE_URL = '/api';

export const authEndpoints = {
    signup: `/auth/signup`,
    verifyOtp: `/auth/verify-otp`,
    login: `/auth/login`
};

export const studentEndpoints = {
    getStudent: (id) => `/students/${id}`,
    getEligibleDrives: (id) => `/students/${id}/eligible-drives`,
    getEligibleDrivesRanked: (id) => `/students/${id}/eligible-drives/ranked`,
    getDrivesAssessment: (id) => `/students/${id}/drives-assessment`,
    claimGoldenTicket: (id, driveId) => `/students/${id}/claim-golden-ticket/${driveId}`,
    getAutopsies: (id) => `/students/${id}/autopsies`,
    verifyGithub: (id) => `/students/${id}/verify-github`,
    updatePlacementTier: (id) => `/students/${id}/placement-tier`,
    uploadResume: (id) => `/students/${id}/resume`
};

export const driveEndpoints = {
    getAllDrives: `/drives`,
    createDrive: `/drives`,
    getDrive: (id) => `/drives/${id}`
};

export const applicationEndpoints = {
    apply: (studentId, driveId) => `/applications/apply?studentId=${studentId}&driveId=${driveId}`,
    updateStatus: (appId, status) => `/applications/${appId}/status?status=${status}`
};

export const aiEndpoints = {
    chat: `/ai/chat`,
    round0Start: `/ai/round0/start`,
    round0Respond: `/ai/round0/respond`
};
