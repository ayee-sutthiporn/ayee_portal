import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuditLog } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly ACTION_URL = `${environment.apiUrl}/audit-logs`;

  logs = signal<AuditLog[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLogs();
    }
  }

  private loadLogs() {
    this.http.get<AuditLog[]>(this.ACTION_URL).subscribe({
      next: (data) => this.logs.set(data),
      error: (err) => console.error('Failed to load audit logs', err)
    });
  }

  getLogs() {
    // Refresh check
    if (this.logs().length === 0 && isPlatformBrowser(this.platformId)) {
      this.loadLogs();
    }
    return this.logs;
  }

  logAction(userId: string, username: string, action: string, details?: string) {
    const payload = { userId, username, action, details };
    this.http.post<AuditLog>(this.ACTION_URL, payload).subscribe({
      next: (newLog) => {
        this.logs.update(logs => [newLog, ...logs]); // Newest first
      },
      error: (err) => console.error('Failed to create audit log', err)
    });
  }
}
