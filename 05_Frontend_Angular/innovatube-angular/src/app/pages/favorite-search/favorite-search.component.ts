import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorite-search.component.html'
})
export class FavoriteSearchComponent {
  query: string = '';

  @Output() search = new EventEmitter<string>();

  handleSearch(event: Event): void {
    event.preventDefault();
    const trimmed = this.query.trim();
    if (trimmed) {
      this.search.emit(trimmed);
    }
  }
}
