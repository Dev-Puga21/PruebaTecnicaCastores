import { useEffect, useState, useContext } from 'react';
import FavoriteSearch from './FavoriteSearchComponent';
import {
  API_GET_FAVORITES,
  API_SEARCH_FAVORITES,
  API_REMOVE_FAVORITE,
} from '../../services/servicesApi';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Toast from '../ToastComponent';

const FavoriteVideosComponent = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const { getDecodedToken } = useContext(AuthContext);
  const userId = getDecodedToken()?.Id;

  const fetchFavoritos = async () => {
    try {
      const response = await axios.get(`${API_GET_FAVORITES}/${userId}`);
      setFavoritos(response.data);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  useEffect(() => {
    if (userId) fetchFavoritos();
  }, [userId]);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(
        `${API_SEARCH_FAVORITES}?userId=${userId}&query=${query}`
      );
      setFavoritos(response.data);
    } catch (error) {
      console.error('Error al buscar favoritos:', error);
    }
  };

  const removeFavorite = async (videoId) => {
    try {
      await axios.delete(`${API_REMOVE_FAVORITE}/${userId}/${videoId}`);
      fetchFavoritos();
      setToastMessage('Video eliminado de favoritos');
    } catch (error) {
      setToastMessage('Error al eliminar favorito');
      console.error('Error al eliminar favorito:', error);
    }
  };

  const handleShare = (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Mira este video',
          url,
        })
        .catch((error) => console.log('Error compartiendo:', error));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setToastMessage('Enlace copiado al portapapeles');
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Mis Videos Favoritos</h2>
      <FavoriteSearch onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favoritos.map((video) => (
          <div
            key={video.idVideo}
            className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow justify-between">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Publicado: {new Date(video.publishedAt).toLocaleDateString()}
              </p>

              <div className="flex gap-3 mt-auto justify-end">
                <button
                  onClick={() => removeFavorite(video.idVideo)}
                  aria-label="Eliminar de favoritos"
                  title="Eliminar de favoritos"
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center"
                >
                  {/* Icono basura SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleShare(video.idVideo)}
                  className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 flex items-center justify-center"
                  aria-label="Compartir video"
                  title="Compartir video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 8a3 3 0 10-2.83-4H7a3 3 0 100 6h2.17A3 3 0 1015 8zM9 12v7a3 3 0 11-6 0v-7m12-1v7a3 3 0 11-6 0v-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default FavoriteVideosComponent;
