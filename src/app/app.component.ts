import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser, AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  public authService = inject(AuthService); // Public for template access

  title = 'AyeePortal';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
