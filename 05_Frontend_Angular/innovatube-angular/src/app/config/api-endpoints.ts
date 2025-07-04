// src/app/config/api-endpoints.ts
export const API_BASE_URL = 'https://innovatube20250629202212.azurewebsites.net/api';
// export const API_BASE_URL = 'https://localhost:7186/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER_USER: `${API_BASE_URL}/RegisterUsers`,
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,

  ADD_FAVORITE: `${API_BASE_URL}/videos/favorites`,
  GET_FAVORITES: `${API_BASE_URL}/videos/favorites`,
  SEARCH_FAVORITES: `${API_BASE_URL}/videos/favorites/search`,
  REMOVE_FAVORITE: `${API_BASE_URL}/videos/favorites`,
};

export const YOUTUBE_API_KEY = 'AIzaSyBm0HZ1W1Yd7rt-DNMWOyUGjjUfV9YNL2Y';
