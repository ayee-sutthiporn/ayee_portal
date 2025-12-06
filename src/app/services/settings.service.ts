import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SystemSettings } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'system_settings';

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
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.settings.set(JSON.parse(stored));
    }
  }

  private saveSettings() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings()));
    }
  }

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings: Partial<SystemSettings>) {
    this.settings.update(current => ({ ...current, ...newSettings }));
    this.saveSettings();
  }
}
