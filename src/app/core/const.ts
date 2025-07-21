export const API_URL = 'https://vitoxyzbackend.onrender.com';
export const ENDPOINTS = {

    // Authorization
    LOGIN: '/loginWithPasswordAdmin',
    SIGNUP: '/createAdmin',
    RESET_PASSWORD: '/auth/reset-password',

    // Users
    GET_USERS: '/api/user/alluser',

    // Staffs
    GET_STAFFS: '/getAllStaff',

    // Doctors
    GET_DOCTORS: '/getAllDoctor',

    // Diet plans
    CREATE_DIETPLAN: '/api/dietplans/create',
    UPDATE_DIETPLAN: '/api/dietplans/',
    DELETE_DIETPLAN: '/api/dietplans/',
    GET_DIETPLAN: '/api/dietplans/getall'

    // Roles
}