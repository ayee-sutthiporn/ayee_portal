import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-card.component.html',
  styleUrls: ['./link-card.component.css']
})
export class LinkCardComponent {
  @Input() title = '';
  @Input() url = '';
  @Input() description = '';
  @Input() icon = ''; // URL to icon or emoji
  @Input() category = '';
}
