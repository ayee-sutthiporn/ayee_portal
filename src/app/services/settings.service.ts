import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { SystemSettings } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly ACTION_URL = `${environment.apiUrl}/settings`;

  settings = signal<SystemSettings>({
    siteName: 'Ayee Portal',
    maintenanceMode: false,
    defaultTheme: 'light'
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSettings();
    }
  }

  private loadSettings() {
    this.http.get<SystemSettings>(this.ACTION_URL).subscribe({
      next: (data) => this.settings.set(data),
      error: (err) => console.error('Failed to load settings', err)
    });
  }

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings: Partial<SystemSettings>) {
    // Optimistic update
    const current = this.settings();
    const updated = { ...current, ...newSettings };
    this.settings.set(updated);

    this.http.put<SystemSettings>(this.ACTION_URL, updated).subscribe({
      next: (data) => this.settings.set(data),
      error: (err) => {
        console.error('Failed to update settings', err);
        this.settings.set(current); // Revert on error
      }
    });
  }
}
