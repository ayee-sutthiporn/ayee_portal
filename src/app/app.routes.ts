import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PortalLayoutComponent } from './layouts/portal-layout/portal-layout.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { WebsiteListComponent } from './pages/admin/websites/website-list/website-list.component';
import { WebsiteFormComponent } from './pages/admin/websites/website-form/website-form.component';
import { CategoryListComponent } from './pages/admin/categories/category-list/category-list.component';
import { CategoryFormComponent } from './pages/admin/categories/category-form/category-form.component';
import { UserListComponent } from './pages/admin/users/user-list/user-list.component';
import { UserFormComponent } from './pages/admin/users/user-form/user-form.component';
import { SettingsComponent } from './pages/admin/settings/settings.component';
import { AuditLogsComponent } from './pages/admin/audit-logs/audit-logs.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  // Public Routes (wrapped in PortalLayout)
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [authGuard] },
      { path: 'about', component: AboutComponent, canActivate: [authGuard] },
      { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    ]
  },
  
  // Admin Routes (wrapped in AdminLayout)
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'websites', component: WebsiteListComponent },
      { path: 'websites/new', component: WebsiteFormComponent },
      { path: 'websites/:id', component: WebsiteFormComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/:id', component: CategoryFormComponent },
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/:id', component: UserFormComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'audit-logs', component: AuditLogsComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];
