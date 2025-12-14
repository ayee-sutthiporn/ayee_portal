import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Website } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly ACTION_URL = `${environment.apiUrl}/websites`;

  websites = signal<Website[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadWebsites();
    }
  }

  private loadWebsites() {
    this.http.get<Website[]>(this.ACTION_URL).subscribe({
      next: (data) => this.websites.set(data),
      error: (err) => console.error('Failed to load websites', err)
    });
  }

  getWebsites() {
    if (this.websites().length === 0 && isPlatformBrowser(this.platformId)) {
      this.loadWebsites();
    }
    return this.websites;
  }

  getWebsiteById(id: string): Website | undefined {
    return this.websites().find(w => w.id === id);
  }

  createWebsite(website: Omit<Website, 'id' | 'createdAt'>) {
    this.http.post<Website>(this.ACTION_URL, website).subscribe({
      next: (newWebsite) => {
        this.websites.update(sites => [...sites, newWebsite]);
      },
      error: (err) => console.error('Failed to create website', err)
    });
  }

  updateWebsite(updatedWebsite: Website) {
    this.http.put<Website>(`${this.ACTION_URL}/${updatedWebsite.id}`, updatedWebsite).subscribe({
      next: (data) => {
        this.websites.update(sites => sites.map(w => w.id === data.id ? data : w));
      },
      error: (err) => console.error('Failed to update website', err)
    });
  }

  deleteWebsite(id: string) {
    this.http.delete(`${this.ACTION_URL}/${id}`).subscribe({
      next: () => {
        this.websites.update(sites => sites.filter(w => w.id !== id));
      },
      error: (err) => console.error('Failed to delete website', err)
    });
  }
}
