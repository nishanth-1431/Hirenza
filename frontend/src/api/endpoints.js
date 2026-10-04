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
