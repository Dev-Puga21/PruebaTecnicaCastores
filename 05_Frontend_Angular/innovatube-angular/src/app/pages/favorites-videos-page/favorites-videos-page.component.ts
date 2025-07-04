import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { AuthService } from '../../auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FavoriteSearchComponent } from '../favorite-search/favorite-search.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-favorite-videos',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FavoriteSearchComponent,
    ToastComponent,
    DatePipe
  ],
  templateUrl: './favorites-videos-page.component.html'
})
export class FavoritesVideosPageComponent implements OnInit {
  favoritos: any[] = [];
  userId: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  toastMessage = '';

  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    this.userId = decoded?.Id?.toString() ?? null;
    if (this.userId) {
      this.fetchFavoritos();
    }
  }

  fetchFavoritos(): void {
    this.http.get<any[]>(`${API_ENDPOINTS.GET_FAVORITES}/${this.userId}`)
      .subscribe({
        next: data => this.favoritos = data,
        error: err => console.error('Error al cargar favoritos:', err)
      });
  }

  handleSearch(query: string): void {
    this.http.get<any[]>(`${API_ENDPOINTS.SEARCH_FAVORITES}?userId=${this.userId}&query=${query}`)
      .subscribe({
        next: data => this.favoritos = data,
        error: err => console.error('Error al buscar favoritos:', err)
      });
  }

  removeFavorite(videoId: string): void {
    this.http.delete(`${API_ENDPOINTS.REMOVE_FAVORITE}/${this.userId}/${videoId}`)
      .subscribe({
        next: () => {
          this.fetchFavoritos();
          this.toastMessage = 'Video eliminado de favoritos';
        },
        error: err => {
          this.toastMessage = 'Error al eliminar favorito';
          console.error('Error al eliminar favorito:', err);
        }
      });
  }

  handleShare(videoId: string): void {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Mira este video',
        url
      }).catch(error => console.log('Error compartiendo:', error));
    } else {
      navigator.clipboard.writeText(url)
        .then(() => this.toastMessage = 'Enlace copiado al portapapeles');
    }
  }

  closeToast() {
    this.toastMessage = '';
  }
}
