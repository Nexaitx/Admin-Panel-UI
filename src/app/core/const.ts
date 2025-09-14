export const API_URL = 'https://vitoxyzcrm-bosc.onrender.com';
export const ENDPOINTS = {

    // Authorization
    LOGIN: '/login',
    SIGNUP: '/signup',
    RESET_PASSWORD: '/forgot-password',

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
    GET_DIETPLAN: '/getAllDietPlan',

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
    GET_ACCOUNT_BY_ROLE: '/getAccountByRole',

    // Get Bookings
    GET_PREVIOUS_BOOKINGS: '/getPastBookings',
    GET_ONGOING_BOOKINGS: '/getOnGoingBookings',
    GET_UPCOMING_BOOKINGS: '/getUpcomingBookings',
    GET_BULK_BOOKINGS: '/getAcceptedUserBookings',

    // GPS
    GET_GPS_DEVIATION_ALERTS: '/gps/Deviation',
    GET_GPS_MONITORING: '/gpsMonitering',

    // Devices and Addresses
    GET_USER_DEVICES_ADDRESS: '/getAllUserIpOrDeviceName',
    GET_STAFF_DEVICES_ADDRESS: '/allAllStaffIpDeviceName',

    // get details of dashboards
    GET_ROLES_COUNT: '/getRoleCount',
    GET_ACCOUNTS_COUNT: '/staffCategoryOrSubcategory',
    GET_ACTIVE_DIET_PLANS: '/getAllActiveDietPlan',
};