export const API_URL = 'https://vitoxyzcrm-bosc.onrender.com';
export const ENDPOINTS = {

    // Authorization
    LOGIN: '/login',
    SIGNUP: '/signup',
    RESET_PASSWORD: '/auth/reset-password',

    // Users
    GET_USERS: '/getAllUser',

    // Staffs
    GET_STAFFS: '/getAllStaff',

    // Doctors
    GET_DOCTORS: '/getAllDoctor',

    // Diet plans
    CREATE_DIETPLAN: '/api/dietplans/create',
    UPDATE_DIETPLAN: '/api/dietplans/',
    DELETE_DIETPLAN: '/api/dietplans/',
    GET_DIETPLAN: '/api/dieticians/getAllDietPlan',

    // Diet Plans Subscription Plans
    CREATE_DIET_SUBSCRIPTION: '/api/dieticians/subscription/plan-create',
    UPDATE_DIET_SUBSCRIPTION: '/api/dieticians/subscriptionplan-update/',
    DELETE_DIET_SUBSCRIPTION: '/api/dieticians/subscriptionplan-delete',
    GET_DIET_SUBSCRIPTION: '/api/user/subscription/plans',

    // Roles
    GET_ROLES: '/getAllRoles',
    CREATE_ROLE: '/createRole',
    UPDATE_ROLE: '/updateRole/',
    DELETE_ROLE: '/DeleteRole/',

    // Get Accounts
    GET_ACCOUNTS: '/getAllAccounts',
    UPDATE_ACCOUNT: '/updateAccount',
    DELETE_ACCOUNT: '/deleteAccount/',
    GET_ACCOUNT_BY_ROLE: '/getAccountByRole'
};