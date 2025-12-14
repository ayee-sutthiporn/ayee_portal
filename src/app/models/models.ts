export enum Role {
  Admin = 'Admin',
  User = 'User'
}

export interface User {
  id: string;
  username: string;
  password?: string; // Optional for display, required for auth
  role: Role;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  description?: string;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  icon?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string; // Snapshot of username
  action: string;
  details?: string;
  timestamp: Date;
}

export interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  defaultTheme: 'light' | 'dark';
}
