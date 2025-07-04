import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
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
