import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard, redirectIfAuthenticated } from './core/guards/auth-guard';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/main-ui/main-ui').then(m => m.MainUi),
    },
    {
        path: 'app',
        canActivate: [authGuard],
        component: MainLayout,
        children: [
            {
                path: 'admin-dashboard',
                loadComponent: () => import('./pages/dashboards/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
                canActivate: [authGuard],
            },
            {
                path: 'doctor-dashboard',
                loadComponent: () => import('./pages/dashboards/doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboard),
                canActivate: [authGuard],
            },
            {
                path: 'pharmacist-dashboard',
                loadComponent: () => import('./pages/dashboards/pharmacist-dashboard/pharmacist-dashboard').then(m => m.PharmacistDashboard),
                canActivate: [authGuard],
            },
            {
                path: 'dietician-dashboard',
                loadComponent: () => import('./pages/dashboards/dietician-dashboard/dietician-dashboard').then(m => m.DieticianDashboard),
                canActivate: [authGuard],
            },
            {
                path: 'physiotherapist-dashboard',
                loadComponent: () => import('./pages/dashboards/doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboard),
                canActivate: [authGuard],
            },
            {
                path: 'psychiatrist-dashboard',
                loadComponent: () => import('./pages/dashboards/pharmacist-dashboard/pharmacist-dashboard').then(m => m.PharmacistDashboard),
                canActivate: [authGuard],
            },
            {
                path: 'default-dashboard',
                loadComponent: () => import('./pages/dashboards/default-dashboard/default-dashboard').then(m => m.DefaultDashboard),
                canActivate: [authGuard],
            },
            {
                path: 'client',
                loadComponent: () => import('./pages/client/client').then(m => m.Client),
                canActivate: [authGuard],
            },
            {
                path: 'staff',
                loadComponent: () => import('./pages/staff/staff').then(m => m.Staff),
                canActivate: [authGuard],
            },
            {
                path: 'doctor',
                loadComponent: () => import('./pages/doctor/doctor').then(m => m.Doctor),
                canActivate: [authGuard],
            },
            {
                path: 'pharmacist',
                loadComponent: () => import('./pages/pharmacist/pharmacist').then(m => m.Pharmacist),
                canActivate: [authGuard],
            },
            {
                path: 'pharmaceuticals',
                loadComponent: () => import('./pages/pharmaceuticals/pharmaceuticals').then(m => m.Pharmaceuticals),
                canActivate: [authGuard],
            },
            {
                path: 'manage-accounts',
                loadChildren: () => import('./pages/manage-accounts/manage-accounts-module').then(m => m.ManageAccountsModule),
                canActivate: [authGuard],
            },
            {
                path: 'bookings',
                loadComponent: () => import('./pages/booking/booking').then(m => m.Booking),
                canActivate: [authGuard],
            },
            {
                path: 'duty-logs',
                loadComponent: () => import('./pages/duty-logs/duty-logs').then(m => m.DutyLogs),
                canActivate: [authGuard],
            },
            {
                path: 'gps-live-monitoring',
                loadComponent: () => import('./pages/gps-live-monitoring/gps-live-monitoring').then(m => m.GPSLiveMonitoring),
                canActivate: [authGuard],
            },
            {
                path: 'bulk-assignments',
                loadComponent: () => import('./pages/bulk-assignment/bulk-assignment').then(m => m.BulkAssignment),
                canActivate: [authGuard],
            },
            {
                path: 'devices-and-addresses',
                loadComponent: () => import('./pages/devices-and-addresses/devices-and-addresses').then(m => m.DevicesAndAddresses),
                canActivate: [authGuard],
            },
            {
                path: 'complaint',
                loadComponent: () => import('./pages/complaint/complaint').then(m => m.Complaint),
                canActivate: [authGuard],
            },
            {
                path: 'override-Duties',
                loadComponent: () => import('./pages/override-duties/override-duties').then(m => m.OverrideDuties),
                canActivate: [authGuard],
            },
            {
                path: 'overtime-approval',
                loadComponent: () => import('./pages/overtime-approval/overtime-approval').then(m => m.OvertimeApproval),
                canActivate: [authGuard],
            },
            {
                path: 'payout',
                loadComponent: () => import('./pages/payout/payout').then(m => m.Payout),
                canActivate: [authGuard],
            },
            {
                path: 'refund-handling',
                loadComponent: () => import('./pages/refund-handling/refund-handling').then(m => m.RefundHandling),
                canActivate: [authGuard],
            },
            {
                path: 'AI-logs',
                loadComponent: () => import('./pages/ai-logs/ai-logs').then(m => m.AiLogs),
                canActivate: [authGuard],
            },
            {
                path: 'gps-live-deviation',
                loadComponent: () => import('./pages/gps-live-deviatian/gps-live-deviatian').then(m => m.GpsLiveDeviatian),
                canActivate: [authGuard],
            },
            {
                path: 'dietician',
                loadComponent: () => import('./pages/dietician/dietician').then(m => m.Dietician),
                canActivate: [authGuard],
            },
            {
                path: 'dietician-reports',
                loadComponent: () => import('./pages/dietician-reports/dietician-reports').then(m => m.DieticianReports),
                canActivate: [authGuard],
            },
            {
                path: 'support',
                loadComponent: () => import('./pages/support/support').then(m => m.Support),
                canActivate: [authGuard],
            },
            {
                path: 'tools',
                loadComponent: () => import('./pages/tools/tools').then(m => m.Tools),
                canActivate: [authGuard],
            },
            {
                path: 'marketing',
                loadComponent: () => import('./pages/marketing/marketing').then(m => m.Marketing),
                canActivate: [authGuard],   
            },
            {
                path: 'documents',
                loadComponent: () => import('./pages/documents/documents').then(m => m.Documents),
                canActivate: [authGuard],
            },
            {
                path: 'roles',
                loadComponent: () => import('./pages/roles/roles').then(m => m.Roles),
                canActivate: [authGuard],
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings').then(m => m.Settings),
                canActivate: [authGuard],
            }
        ]
    }
];
