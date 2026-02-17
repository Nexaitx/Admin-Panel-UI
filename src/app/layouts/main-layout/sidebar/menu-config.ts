export interface MenuItem {
  title: string;
  icon: string;
  route?: string;       // Optional for parent items (Expansion panels)
  permission?: string;  // The permission string required
  allowedRoles?: string[]; // Optional: e.g. ['Admin', 'Pharmacist']
  children?: MenuItem[]; // For nested sub-menus
}

export const MENU_DATA: MenuItem[] = [
  // --- Dashboards ---
  {
    title: 'Dashboard',
    icon: 'widgets',
    route: '/app/admin-dashboard',
    permission: 'Admin Dashboard'
  },
  {
    title: 'Dashboard',
    icon: 'widgets',
    route: '/app/doctor-dashboard',
    permission: 'Doctor dashboard'
  },
  {
    title: 'Dashboard',
    icon: 'widgets',
    route: '/app/pharmacist-dashboard',
    permission: 'Pharmacist Dashboard'
  },
  {
    title: 'Dashboard',
    icon: 'widgets',
    route: '/app/physiotherapist-dashboard',
    permission: 'Physiotherapist Dashboard'
  },
  {
    title: 'Dashboard',
    icon: 'widgets',
    route: '/app/psychiatrist-dashboard',
    permission: 'Psychiatrist Dashboard'
  },
  {
    title: 'Dashboard',
    icon: 'widgets',
    route: '/app/dietician-dashboard',
    permission: 'Dietician Dashboard'
  },

  // --- Manage (Expansion Panel) ---
  {
    title: 'Manage',
    icon: 'apps',
    permission: 'Manage',
    children: [
      { title: 'Client/User', icon: 'account_circle', route: '/app/client' },
      { title: 'Staff', icon: 'admin_panel_settings', route: '/app/staff' },
      { title: 'Pharmacist', icon: 'local_hospital', route: '/app/pharmacist' },
      { title: 'Dieticians', icon: 'medical_information', route: '/app/dietician' },
      { title: 'Main Role Accounts', icon: 'admin_panel_settings', route: '/app/role-accounts' },
      { title: 'Sub Role Accounts', icon: 'medical_information', route: '/app/sub-role-accounts' },
    ]
  },

  // --- Bookings & Payments (Expansion Panel) ---
  {
    title: 'Bookings & Payments',
    icon: 'track_changes',
    permission: 'Booking Payments',
    children: [
      { title: 'Staff Bookings', icon: 'event', route: '/app/bookings' },
      { title: 'Bulk Bookings', icon: 'group', route: '/app/bulk-bookings' },
      { title: 'Duty Assigned', icon: 'assignment', route: '/app/duty-assigned' },
      { title: 'Payments', icon: 'payment', route: '/app/booking-payments' },
    ]
  },

  // --- GPS & Staff Monitoring ---
  {
    title: 'Active Staffs',
    icon: 'spellcheck',
    route: '/app/active-staff',
    permission: 'Active Staff'
  },
  {
    title: 'GPS Live Monitoring',
    icon: 'location_on',
    route: '/app/gps-live-monitoring',
    permission: 'GPS Monitoring'
  },
  {
    title: 'GPS Live Deviation',
    icon: 'sensors',
    route: '/app/gps-live-deviation',
    permission: 'GPS Deviation'
  },
  {
    title: 'Override Duties',
    icon: 'swap_horiz',
    route: '/app/override-Duties',
    permission: 'Override Duties'
  },

  // --- Cancelled Booking (Expansion Panel) ---
  {
    title: 'Cancelled Booking',
    icon: 'cancel_presentation',
    permission: 'Cancel Booking',
    children: [
      { title: 'Cancelled By Staff', icon: 'voice_over_off', route: '/app/cancel-staff-booking' },
      { title: 'Cancelled By Client', icon: 'person_cancel', route: '/app/cancel-client-booking' },
    ]
  },

  // --- Miscellaneous Items ---
  {
    title: 'Requested SubCategories',
    icon: 'send',
    route: '/app/requested-sub-categories',
    permission: 'Requested SubCategories'
  },
  {
    title: 'Re-Assigned Bookings',
    icon: 'find_replace',
    route: '/app/re-assigned-bookings',
    permission: 'Re-Assigned Booking'
  },
  {
    title: 'SOS Staff Contacts',
    icon: 'contact_emergency',
    route: '/app/sos-staff',
    permission: 'SOS Staff'
  },
  {
    title: 'SOS Alerts',
    icon: 'add_alert',
    route: '/app/sos-alerts',
    permission: 'SOS Alerts'
  },
  {
    title: 'Staff Wallet',
    icon: 'account_balance_wallet',
    route: '/app/staff-wallet',
    permission: 'Staff Wallet'
  },
  {
    title: 'Ledgers',
    icon: 'money',
    route: '/app/ledgers',
    permission: 'Ledgers'
  },
  {
    title: 'Devices & Addresses',
    icon: 'important_devices',
    route: '/app/devices-and-addresses',
    permission: 'Devices & Addresses'
  },

  // --- Pharma (Admin View - Expansion Panel) ---
  {
    title: 'Pharma',
    icon: 'apps',
    permission: 'Pharma',
    allowedRoles: ['Admin'], // Restricts this specific block to Admins
    // children: [
    //   { title: 'Pharma Bookings', icon: 'account_circle', route: '/app/pharmaceutical/bookings' },
    //   { title: 'Vitoxyz Medicines', icon: 'healing', route: '/app/pharmaceutical/medicines' },
    //   { title: 'Pharmacists Products', icon: 'align_vertical_bottom', route: '/app/pharmaceutical/all-pharmacists-available-products' },
    //   { title: 'Top Discounts', icon: 'leaderboard', route: '/app/pharmaceutical/top-discounts' },
    //   { title: 'Available Products', icon: 'addchart', route: '/app/pharmaceutical/vitoxyz-available-products' },
    // ]
  },

  // --- Pharma (Pharmacist View - Flat Links) ---
  // {
  //   title: 'Pharma Bookings',
  //   icon: 'receipt_long',
  //   route: '/app/pharmaceutical/bookings',
  //   permission: 'Pharma',
  //   allowedRoles: ['Pharmacist']
  // },
  // {
  //   title: 'Vitoxyz Medicine Data',
  //   icon: 'medications',
  //   route: '/app/pharmaceutical/medicines',
  //   permission: 'Pharma',
  //   allowedRoles: ['Pharmacist']
  // },
  // {
  //   title: 'My Available Products',
  //   icon: 'health_and_safety',
  //   route: '/app/pharmaceutical/my-available-medicine',
  //   permission: 'Pharma',
  //   allowedRoles: ['Pharmacist']
  // },
  // {
  //   title: 'Other Pharmacist Products',
  //   icon: 'safety_divider',
  //   route: '/app/pharmaceutical/other-pharmacists-available-products',
  //   permission: 'Pharma',
  //   allowedRoles: ['Pharmacist']
  // },

  // --- Diet Section ---
  {
    title: 'Diet Users',
    icon: 'people',
    route: '/app/diet-users',
    permission: 'Diet Users'
  },
  {
    title: 'Diet Subscription',
    icon: 'egg_alt',
    route: '/app/diet-subscription',
    permission: 'Diet Subscription'
  },
  {
    title: 'Diet Plans',
    icon: 'donut_large',
    route: '/app/diet-plans',
    permission: 'Diet Plans'
  },
  {
    title: 'Dietician Reports',
    icon: 'analytics',
    route: '/app/dietician-reports',
    permission: 'Dietician Reports'
  },
  {
    title: 'Subscription Plans',
    icon: 'poll',
    route: '/app/subscription-plans',
    permission: 'Diet Subscription Plans'
  },

  // --- General App Items ---
  {
    title: 'Appointments',
    icon: 'date_range',
    route: '/app/appointments',
    permission: 'Appointments'
  },
  {
    title: 'Orders Locate',
    icon: 'pin_drop',
    route: '/app/pharmaceuticals',
    permission: 'Order Status'
  },
  {
    title: 'Prescriptions',
    icon: 'local_pharmacy',
    route: '/app/prescription',
    permission: 'Prescriptions'
  },

  {
    title: 'Roles',
    icon: 'group',
    route: '/app/roles',
    permission: 'Roles'
  },
  {
    title: 'Permissions',
    icon: 'library_books',
    route: '/app/permissions',
    permission: 'Permissions'
  },
  {
    title: 'Blogs',
    icon: 'settings',
    permission: 'Blogs',
    children: [
      { title: 'Create Blogs', icon: 'report_problem', route: '/app/create-blog' },
      { title: 'All Blogs', icon: 'access_time', route: '/app/blogs' }
    ]
  },

  // new Pharma Integration
  {
    title: 'Orders',
    icon: 'shopping_basket',
    route: '/app/orders',
    permission: 'Orders',
    allowedRoles: ['Pharmacist']
  },
  {
    title: 'Reports',
    icon: 'bar_chart',
    route: '/app/reports',
    permission: 'Reports',
    allowedRoles: ['Pharmacist']
  },
  {
    title: 'Orders Ledgers',
    icon: 'money',
    route: '/app/order-ledgers',
    permission: 'Order Ledgers',
    allowedRoles: ['Pharmacist']
  },
  {
    title: 'Account',
    icon: 'group',
    route: '/app/account',
    permission: 'Account'
  },
  // --- Settings (Expansion Panel) ---
  {
    title: 'Settings',
    icon: 'settings',
    permission: 'Settings',
    children: [
      { title: 'Complaints', icon: 'report_problem', route: '/app/complaint' },
      { title: 'Overtime Handling', icon: 'access_time', route: '/app/overtime-approval' },
      { title: 'AI Logs', icon: 'auto_fix_normal', route: '/app/AI-logs' },
      { title: 'Payout', icon: 'monetization_on', route: '/app/payout' },
      { title: 'Refund Handling', icon: 'wallet', route: '/app/refund-handling' },
      { title: 'Marketing', icon: 'campaign', route: '/app/marketing' },
      { title: 'Tools', icon: 'construction', route: '/app/tools' },
      { title: 'Documents', icon: 'library_books', route: '/app/documents' },
    ]
  }
];