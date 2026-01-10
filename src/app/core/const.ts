export const API_URL = 'https://vitoxyzcrm-bosc.onrender.com';
export const googleMapsApiKey = 'AIzaSyBwkoBuGelQUiN2YSN-pqGhNv1KJE8CFNs';
// export const API_URL = 'http://localhost:8081';

export const ENDPOINTS = {

    // Authorization
    LOGIN: '/login',
    SIGNUP: '/signup',
    RESET_PASSWORD: '/forgot-password',

    // Users
    GET_USERS: '/getAllUser',
    GET_ORGANIZATIONS: '/getAllOrganizations',

    // Staffs
    GET_STAFFS: '/getAllStaff',
    GET_DUTY_LOGS: '/getDutyLog',
    GET_STAFF_FILTER: '/api/staff/filter/advanced',
    GET_SUB_CATEGORIES: '/api/staff/subcategories',
    GET_STATES: '/api/staff/states',
    GET_ACTIVE_STAFF: '/api/staff/filter',
    VERIFY_STAFF: '/api/staff/bulk/verification',
    DISABLE_STAFF: '/api/staff/bulk/active-status',

    // Staff Wallet
    GET_STAFF_WALLET: '/api/v1/staff-wallet/all',

    // Doctors
    GET_DOCTORS: '/getAllDoctor',

    // Diet plans
    CREATE_DIETPLAN: '/api/dietplans/create',
    UPDATE_DIETPLAN: '/api/dietplans/',
    DELETE_DIETPLAN: '/api/dietplans/',
    GET_DIETPLAN: '/getAllDietPlan',

    // Diet Plans Subscription Plans
    CREATE_DIET_SUBSCRIPTION: '/api/dieticians/subscription/plan-create',
    UPDATE_DIET_SUBSCRIPTION: '/api/dieticians/subscription/plan-update/',
    DELETE_DIET_SUBSCRIPTION: '/api/dieticians/subscription/plan-delete',
    GET_DIET_SUBSCRIPTION: '/api/dieticians/subscription/plans',
    GET_DIET_USERS: '/api/subscriptions/users-with-subscriptions',
    GET_DIET_USERS_BY_PAYMENT_STATUS: '/api/subscriptions/status/',

    // Roles & Permissions
    GET_ROLES: '/getAllRoles',
    CREATE_ROLE: '/createRole',
    UPDATE_ROLE: '/updateRole/',
    DELETE_ROLE: '/DeleteRole/',
    GET_ROLE_PERMISSIONS: '/getRolePermit',
    UPDATE_ROLE_PERMISSIONS: '/assignRolePermit',
    GET_SUBROLES: '/api/admin/subroles/subroleonly',
    CREATE_SUB_ROLE: '/api/admin/subroles/createsubrole',
    UPDATE_SUB_ROLE: '/api/admin/subroles/',
    DELETE_SUB_ROLE: '/api/admin/subroles/',

    // Get Accounts
    GET_ACCOUNTS: '/getAllAccounts',
    UPDATE_ACCOUNT: '/updateAccount',
    DELETE_ACCOUNT: '/deleteAccount/',
    GET_ACCOUNT_BY_ROLE: '/getAccountByRole',
    GET_LOGGED_IN_USER_DETAILS: '/profile',

    // Get Bookings
    GET_PREVIOUS_BOOKINGS: '/api/admin/bookings/past',
    GET_ONGOING_BOOKINGS: '/api/admin/bookings/ongoing',
    GET_UPCOMING_BOOKINGS: '/api/admin/bookings/upcoming',
    GET_BULK_BOOKINGS: '/getAcceptedUserBookings',

    // GPS
    GET_GPS_MONITORING: '/api/locations/active-staff-locations',
    GET_GPS_DEVIATION_ALERTS: '/api/distance-alerts/current-alerts',

    // Devices and Addresses
    GET_USER_DEVICES_ADDRESS: '/getAllUserIpOrDeviceName',
    GET_STAFF_DEVICES_ADDRESS: '/allAllStaffIpDeviceName',

    // Get complaints
    GET_COMPLAINTS: '/getAllComplain',

    // get details of admin dashboards
    GET_ROLES_COUNT: '/getRoleCount',
    GET_ACCOUNTS_COUNT: '/staffCategoryOrSubcategory',
    GET_ACTIVE_DIET_PLANS: '/getAllActiveDietPlan',
    GET_CLIENT_STAFF_COUNT: '/getClientAndStaffCount',
    GET_BOOKING_COUNTS: '/bookingStatus-Counts',

    // Get dietician dashboard
    GET_USERS_ONBOARD_DIET: '/getAllOnBoardUser',
    GET_ALL_ACTIVE_DIET_PLANS: '/getAllActiveDietPlan', //Get all diet plans which are active or not
    GET_DIET_PLANS: '/getAllDietPlan', // get all diet plans which are active to show on client app
    GET_ALL_LOGGEDIN_DIETICIAN_DIET_PLANS: '/api/dieticians/getAllDietPlan',
    GET_SCHEDULED_CALLS_COUNT: '/getDietScheduleCallCount',
    GET_SCHEDULED_CALL: '/getDietScheduleCall',

    UPDATE_VERIFICATION_ACCESS: '/documentverification',
    GET_ADMIN_BY_ID: '/getAdminById/',
    UPDATE_MEDICINE_PERMISSION: '/api/admin-management/givepharmacist/',
    // get pharmacy dashboard
    GET_CART_ITEM_COUNT: '/api/admin/cart/items/count',
    SUBMIT_KYC_DOCUMENTS: '/api/pharmacist/kyc-verification', //APIs are pending
    GET_ALL_MEDICINES_COUNT: '/api/admin/dbmedicine/count',
    GET_ORDERS_COUNT: '/api/admin/counts/orders',
    GET_COUNT_OF_MY_PRODUCTS: '/api/admin/counts/my-products',
    GET_MY_ORDERS: '/api/admin/counts/dashboard',

    // Pharmacy
    GET_ORDERS_IN_CART: '/api/admin/cart/items',
    GET_ORDER_STATUSES: '/api/admin/orders/statuses',
    GET_ORDERS_BY_STATUS: '/api/admin/orders/items/order-status/filter',

    //Super Admin - Pharmaceuticals
    GET_ALL_CART: "/api/super-admin/cart/items",
    GET_ALL_ORDER_STATUS: "/api/super-admin/orders/statuses",
    GET_ORDERS_BY_STATUS_ADMIN: "/api/super-admin/orderswithdetails/status/",
    GET_PRODUCT_BY_PRODUCTNAME: "/api/super-admin/cart/search/product", // GET BY PRODUCT NAME

    // medicines
    GET_OTC_MEDICINES: '/api/products', // otc medicines
    GET_PRESCRIBED_MEDICINES: '/api/medicines/getMedicine', // prescribed/drug
    GET_MY_MEDICINES: '/api/medicines/my-medicines', // manually added medicines by pharma admin
    CREATE_MEDICINE: '/api/medicines/add-with-images', // create medicine by pharmacist with images
    CREATE_MEDICINE_NO_IMAGE: '/api/medicines/add', // create medicine by pharmacist without image
    UPDATE_MEDICINE: '/api/medicines',
    DELETE_MEDICINE: '/api/medicines/',  // delete medicine create by pharmacist

    UPDATE_DISCOUNT_MEDICINE: '/api/admin/medicines/toggle', // Update discount and get actual price / remove price
    GET_DISCOUNTED_MEDICINES: '/api/admin/medicine-reports/my-managed-with-details', // Get all discounted medicines

    GET_SEARCH_OTC_MEDICINES: '/api/products/search',
    GET_SEARCH_PRESCRIBED_MEDICINES: '/api/medicines/search',
    GET_SEARCH_MY_MEDICINES: '/api/medicines/search-by-name',

    //Account
    ADD_ADDRESS: '/api/admin/addresses',
    UPDATE_ADDRESS: '/api/admin/addresses/',
    DELETE_ADDRESS: '/api/admin/addresses/',
    GET_ADDRESSES: '/api/admin/addresses',

    // prescriptions
    GET_PRESCRIPTIONS: '/api/admin/prescriptions',
    GET_PRESCRIPTION_STATUSES: '/api/admin/prescriptions/statuses',
    UPDATE_PRESCRIPTION_STATUS: '/api/admin/prescriptions/', //{prescriptionId}/status

    // bulk/SINGLE update medicines
    BULK_AVAILABILITY_TOGGLE: '/api/medicines/bulk-show-in-app',
    BULK_DISCOUNT: '/api/admin/medicines/bulk/discount',

    // available/non-available medicines
    GET_MY_AVAILABLE_MEDICINES: '/api/pharmacists/medicines/pharmacist/my/available',
    GET_OTHER_PHARMACIST_AVAILABLE_MEDICINES: '/api/pharmacists/medicines/otherpharmacist/highest-discount',
    UPDATE_BULK_AVAILABILITY_DISCOUNT: '/api/pharmacists/medicines/bulk/disscountandisavailable',
    GET_AVAILABLE_TOGGLE: '/api/medicines/checkmedicineavailibility/bypharmacistmedicine',

    ALL_AVAILABLE_MEDICINE: '/api/medicines/allmedicine/pharmacistdiscountadded',
    DISABLE_MEDICINE_PERMANENTLY: '/api/medicines/disable/anymedicine',
    GET_PHARMACIST_MEDICINE: '/api/medicines/pharmacists/',
    GET_PHARMACISTS_MEDICINE: '/api/medicines/getallpharmacists/byproductid/',

    TOP_DISCOUNTED_MEDICINES: '/api/medicines/pharmacistsmedicine/top-discounted',

    // Super Admin: Available medicines
    GET_ALL_PHARMACY_AVAILABLE_MEDICINE: '/api/medicines/getmedicine/bypharmacist/',

    UPDATE_MEDICINE_AVAILABILITY: '/api/pharmacists/medicines/pharmacist/myvailable/bulktoggle',

    // push-notifications
    SUBSCRIBEAPI: '/api/admin/subscribe',
    UPDATE_FCM_TOKEN: '/update-fcm-token',

    GET_BOOKING_PAYMENTS: '/api/admin/payments/all',
    GET_PAYMENT_STATUSES: '/api/admin/payments/statuses',
    GET_PAYMENT_BY_FILTER: '/api/admin/payments/filter',

    // bulk assignments
    GET_BULK_PREVIOUS_BOOKINGS: '/api/paymentbookings/previous',
    GET_BULK_ONGOING_BOOKINGS: '/api/paymentbookings/ongoing',
    GET_BULK_UPCOMING_BOOKINGS: '/api/paymentbookings/upcoming',

    // override duty
    GET_OVERRIDE_DUTY: '/api/override-duties/overridden',

    // Cancel Bookings
    BOOKINGS_CANCELLED_BY_STAFF: '/api/bookings/cancelled-by-staff',
    BOOKINGS_CANCELLED_BY_USER: '/api/cancellation-records',
    GET_REASSIGN_DUTY: '/api/bookings/',
    REASSIGNED_BOOKINGS: '/api/reassignments/all',

    // SOS
    GET_SOS_FROM_STAFF: '/api/sos/staff-with-contacts',
    GET_SOS: '/api/sos/all',
    GET_SOS_PENDING: '/api/sos/pending',
    GET_SOS_RESOLVED: '/api/sos/resolved',

    // Other Subcategory
    GET_OTHER_SUBCATEGORY: '/api/other-sub-category/getAllOtherSubcategory',

};