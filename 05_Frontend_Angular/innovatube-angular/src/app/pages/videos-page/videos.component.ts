import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS, YOUTUBE_API_KEY } from '../../config/api-endpoints';
import { AuthService } from '../../auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
    // DatePipe,
    SearchBarComponent
  ],
  templateUrl: './videos.component.html'
})
export class VideosComponent implements OnInit {
  videos: any[] = [];
  searchQuery: string | null = null;
  toastMessage = '';
  currentPage = 0;
  nextPageToken = '';
  tokenHistory: string[] = [''];
  userId!: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const token = this.authService.getDecodedToken();
    this.userId = token?.Id?.toString() ?? '';
    this.fetchVideos();
  }

  fetchVideos(query: string | null = null, token: string = '') {
    const baseUrl = query
      ? `https://www.googleapis.com/youtube/v3/search`
      : `https://www.googleapis.com/youtube/v3/videos`;

    let params = new HttpParams()
      .set('part', 'snippet')
      .set('maxResults', '12')
      .set('key', YOUTUBE_API_KEY)
      .set('pageToken', token);

    if (query) {
      params = params.set('q', query).set('type', 'video');
    } else {
      params = params.set('chart', 'mostPopular').set('regionCode', 'MX');
    }

    this.http.get<any>(baseUrl, { params }).subscribe({
      next: (res) => {
        this.nextPageToken = res.nextPageToken || '';
        this.videos = query
          ? res.items.map((item: any) => ({
              id: item.id.videoId,
              snippet: item.snippet
            }))
          : res.items;
      },
      error: (err) => console.error('Error al cargar videos', err)
    });
  }

  goToPage(index: number) {
    const token = this.tokenHistory[index];
    this.fetchVideos(this.searchQuery, token);
    this.currentPage = index;
  }

  goToNext() {
    if (!this.nextPageToken) return;
    this.tokenHistory[this.currentPage + 1] = this.nextPageToken;
    this.fetchVideos(this.searchQuery, this.nextPageToken);
    this.currentPage++;
  }

  goToPrev() {
    if (this.currentPage === 0) return;
    const token = this.tokenHistory[this.currentPage - 1];
    this.fetchVideos(this.searchQuery, token);
    this.currentPage--;
  }

  handleSearch(query: string) {
    this.searchQuery = query;
    this.tokenHistory = [''];
    this.currentPage = 0;
    this.fetchVideos(query, '');
  }

  handleFavorite(video: any) {
    const body = {
      IdVideo: video.id,
      Title: video.snippet.title,
      ThumbnailUrl: video.snippet.thumbnails.medium.url,
      PublishedAt: video.snippet.publishedAt
    };

    this.http.post(`${API_ENDPOINTS.ADD_FAVORITE}?userId=${this.userId}`, body).subscribe({
      next: () => (this.toastMessage = 'Video agregado a favoritos'),
      error: () => (this.toastMessage = 'El video ya está en favoritos')
    });
  }

  handleShare(videoId: string) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
      navigator.share({ title: 'Mira este video', url }).catch(console.log);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        this.toastMessage = 'Enlace copiado al portapapeles';
      });
    }
  }

  closeToast() {
    this.toastMessage = '';
  }
}
