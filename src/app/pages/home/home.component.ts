import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkCardComponent } from '../../components/link-card/link-card.component';
import { WebsiteService } from '../../services/website.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LinkCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private websiteService = inject(WebsiteService);
  private categoryService = inject(CategoryService);

  websites = this.websiteService.getWebsites();
  categories = this.categoryService.getCategories();

  selectedCategoryId = signal<string | null>(null);

  filteredWebsites = computed(() => {
    const allSites = this.websites().filter(w => w.isVisible);
    const categoryId = this.selectedCategoryId();

    if (!categoryId) {
      return allSites;
    }
    return allSites.filter(w => w.categoryId === categoryId);
  });

  selectCategory(categoryId: string | null) {
    this.selectedCategoryId.set(categoryId);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }
}
