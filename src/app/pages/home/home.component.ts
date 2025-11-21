import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkCardComponent } from '../../components/link-card/link-card.component';

interface Link {
  title: string;
  url: string;
  description: string;
  icon: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LinkCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  links: Link[] = [
    {
      title: 'Google',
      url: 'https://google.com',
      description: 'Search the world\'s information, including webpages, images, videos and more.',
      icon: '🔍',
      category: 'Search'
    },
    {
      title: 'YouTube',
      url: 'https://youtube.com',
      description: 'Enjoy the videos and music you love, upload original content, and share it all with friends.',
      icon: '📺',
      category: 'Entertainment'
    },
    {
      title: 'GitHub',
      url: 'https://github.com',
      description: 'GitHub is where over 100 million developers shape the future of software, together.',
      icon: '🐙',
      category: 'Development'
    },
    {
      title: 'ChatGPT',
      url: 'https://chat.openai.com',
      description: 'A conversational AI model developed by OpenAI.',
      icon: '🤖',
      category: 'AI Tools'
    },
    {
      title: 'Angular',
      url: 'https://angular.io',
      description: 'The modern web developer\'s platform.',
      icon: '🅰️',
      category: 'Development'
    },
    {
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: 'Rapidly build modern websites without ever leaving your HTML.',
      icon: '🌊',
      category: 'Design'
    }
  ];

  get categories(): string[] {
    return [...new Set(this.links.map(link => link.category))];
  }

  selectedCategory: string | null = null;

  get filteredLinks(): Link[] {
    if (!this.selectedCategory) {
      return this.links;
    }
    return this.links.filter(link => link.category === this.selectedCategory);
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
  }
}
