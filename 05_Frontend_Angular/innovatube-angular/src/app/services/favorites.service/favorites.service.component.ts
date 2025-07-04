// src/app/services/favorites.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  constructor(private http: HttpClient) {}

  getFavorites(userId: string) {
    return this.http.get(`${API_ENDPOINTS.GET_FAVORITES}?userId=${userId}`);
  }

  addFavorite(video: any) {
    return this.http.post(API_ENDPOINTS.ADD_FAVORITE, video);
  }

  removeFavorite(videoId: string, userId: string) {
    return this.http.delete(`${API_ENDPOINTS.REMOVE_FAVORITE}?videoId=${videoId}&userId=${userId}`);
  }

  searchFavorites(query: string, userId: string) {
    return this.http.get(`${API_ENDPOINTS.SEARCH_FAVORITES}?q=${query}&userId=${userId}`);
  }
}
