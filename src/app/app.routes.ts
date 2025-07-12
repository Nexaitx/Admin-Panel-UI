import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard, redirectIfAuthenticated } from './core/guards/auth-guard';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        component: MainLayout,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
            },
             {
                path: 'client',
                loadComponent: () => import('./pages/client/client').then(m => m.Client)
            },
            {
                path: 'staff',
                loadComponent: () => import('./pages/staff/staff').then(m => m.Staff)
            },
            {
                path: 'bookings',
                loadComponent: () => import('./pages/booking/booking').then(m => m.Booking)
            },
            {
                path: 'duty-logs',
                loadComponent: () => import('./pages/duty-logs/duty-logs').then(m => m.DutyLogs)
            },
            {
                path: 'gps-live-monitoring',
                loadComponent: () => import('./pages/gps-live-monitoring/gps-live-monitoring').then(m => m.GPSLiveMonitoring)
            },
            {
                path: 'bulk-assignments',
                loadComponent: () => import('./pages/bulk-assignment/bulk-assignment').then(m => m.BulkAssignment)
            },
            {
                path: 'complaint',
                loadComponent: () => import('./pages/complaint/complaint').then(m => m.Complaint)
            },
            {
                path: 'override-Duties',
                loadComponent: () => import('./pages/override-duties/override-duties').then(m => m.OverrideDuties)
            },
            {
                path: 'overtime-approval',
                loadComponent: () => import('./pages/overtime-approval/overtime-approval').then(m => m.OvertimeApproval)
            },
            {
                path: 'payout',
                loadComponent: () => import('./pages/payout/payout').then(m => m.Payout)
            },
            {
                path: 'reassign-duties',
                loadComponent: () => import('./pages/reassign-duties/reassign-duties').then(m => m.ReassignDuties)
            },
            {
                path: 'refund-handling',
                loadComponent: () => import('./pages/refund-handling/refund-handling').then(m => m.RefundHandling)
            },
            {
                path: 'AI-logs',
                loadComponent: () => import('./pages/ai-logs/ai-logs').then(m => m.AiLogs)
            },
            {
                path: 'gps-live-deviation',
                loadComponent: () => import('./pages/gps-live-deviatian/gps-live-deviatian').then(m => m.GpsLiveDeviatian)
            },
            {
                path: 'dietician',
                loadComponent: () => import('./pages/dietician/dietician').then(m => m.Dietician)
            },
            {
                path: 'dietician-reports',
                loadComponent: () => import('./pages/dietician-reports/dietician-reports').then(m => m.DieticianReports)
            },
            {
                path: 'support',
                loadComponent: () => import('./pages/support/support').then(m => m.Support)
            },
            {
                path: 'tools',
                loadComponent: () => import('./pages/tools/tools').then(m => m.Tools)
            },
            {
                path: 'marketing',
                loadComponent: () => import('./pages/marketing/marketing').then(m => m.Marketing)
            },
            {
                path: 'documents',
                loadComponent: () => import('./pages/documents/documents').then(m => m.Documents)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings').then(m => m.Settings)
            }
        ]
    },
    {
        path: '',
        component: AuthLayout,
        canActivate: [redirectIfAuthenticated], // Use redirectIfAuthenticated guard if needed
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/login/login').then(m => m.Login),
            },
            {
                path: 'signup',
                loadComponent: () => import('./pages/signup/signup').then(m => m.Signup),
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
