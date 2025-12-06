import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuditLog } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'audit_logs';

  logs = signal<AuditLog[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLogs();
    }
  }

  private loadLogs() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.logs.set(JSON.parse(stored));
    }
  }

  private saveLogs() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs()));
    }
  }

  getLogs() {
    return this.logs;
  }

  logAction(userId: string, username: string, action: string, details?: string) {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      userId,
      username,
      action,
      details,
      timestamp: new Date()
    };
    this.logs.update(logs => [newLog, ...logs]); // Newest first
    this.saveLogs();
  }
}
