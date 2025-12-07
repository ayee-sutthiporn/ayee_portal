import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Website } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'websites';

  websites = signal<Website[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadWebsites();
    }
  }

  private loadWebsites() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.websites.set(JSON.parse(stored));
    } else {
      const defaults: Website[] = [
        {
          id: '1',
          name: 'Google',
          url: 'https://google.com',
          description: 'Search the world\'s information, including webpages, images, videos and more.',
          icon: 'https://www.google.com/favicon.ico',
          categoryId: '1',
          isVisible: true,
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'YouTube',
          url: 'https://youtube.com',
          description: 'Enjoy the videos and music you love, upload original content, and share it all with friends.',
          icon: 'https://www.youtube.com/favicon.ico',
          categoryId: '4',
          isVisible: true,
          createdAt: new Date()
        },
        {
          id: '3',
          name: 'GitHub',
          url: 'https://github.com',
          description: 'GitHub is where over 100 million developers shape the future of software, together.',
          icon: 'https://github.com/favicon.ico',
          categoryId: '3',
          isVisible: true,
          createdAt: new Date()
        },
        {
          id: '4',
          name: 'ChatGPT',
          url: 'https://chat.openai.com',
          description: 'A conversational AI model developed by OpenAI.',
          icon: 'https://chat.openai.com/favicon.ico',
          categoryId: '5',
          isVisible: true,
          createdAt: new Date()
        },
        {
          id: '5',
          name: 'Angular',
          url: 'https://angular.io',
          description: 'The modern web developer\'s platform.',
          icon: 'https://angular.io/assets/images/favicons/favicon.ico',
          categoryId: '3',
          isVisible: true,
          createdAt: new Date()
        },
        {
          id: '6',
          name: 'Tailwind CSS',
          url: 'https://tailwindcss.com',
          description: 'Rapidly build modern websites without ever leaving your HTML.',
          icon: 'https://tailwindcss.com/favicons/favicon.ico',
          categoryId: '6',
          isVisible: true,
          createdAt: new Date()
        },
        {
          id: '7',
          name: 'Facebook',
          url: 'https://facebook.com',
          description: 'Connect with friends, family and other people you know.',
          icon: 'https://www.facebook.com/favicon.ico',
          categoryId: '2',
          isVisible: true,
          createdAt: new Date()
        },
        {
          id: '8',
          name: 'RaiJai',
          url: 'https://raijai.sutthiporn.dev/',
          description: 'RaiJai Project with SSO/SLO support.',
          icon: 'assets/icons/raijai.ico', // Placeholder or use a generic one if no specific icon
          categoryId: '7', // Assuming a new or existing category 'Other' or 'Internal'
          isVisible: true,
          createdAt: new Date()
        }
      ];
      this.websites.set(defaults);
      this.saveWebsites();
    }
  }

  private saveWebsites() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.websites()));
    }
  }

  getWebsites() {
    return this.websites;
  }

  getWebsiteById(id: string): Website | undefined {
    return this.websites().find(w => w.id === id);
  }

  createWebsite(website: Omit<Website, 'id' | 'createdAt'>) {
    const newWebsite: Website = {
      ...website,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    this.websites.update(sites => [...sites, newWebsite]);
    this.saveWebsites();
  }

  updateWebsite(updatedWebsite: Website) {
    this.websites.update(sites => sites.map(w => w.id === updatedWebsite.id ? updatedWebsite : w));
    this.saveWebsites();
  }

  deleteWebsite(id: string) {
    this.websites.update(sites => sites.filter(w => w.id !== id));
    this.saveWebsites();
  }
}
