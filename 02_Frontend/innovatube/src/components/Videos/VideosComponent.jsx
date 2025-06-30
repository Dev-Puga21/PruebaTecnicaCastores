import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_ADD_FAVORITE, API_KEY } from '../../services/servicesApi';
import { AuthContext } from '../../context/AuthContext';
import SearchBar from './SearchBarComponent';
import Toast from '../ToastComponent';

const VideosComponent = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [tokenHistory, setTokenHistory] = useState(['']);
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState('');

  const { getDecodedToken } = useContext(AuthContext);
  const userId = getDecodedToken()?.Id;
  

  const fetchVideos = async (query = null, token = '') => {
    try {
      const baseUrl = query
        ? `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${query}&pageToken=${token}&key=${API_KEY}`
        : `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=MX&maxResults=12&pageToken=${token}&key=${API_KEY}`;

      const res = await axios.get(baseUrl);

      const items = query
        ? res.data.items.map((item) => ({
            id: item.id.videoId,
            snippet: item.snippet,
          }))
        : res.data.items;

      setVideos(items);
      setNextPageToken(res.data.nextPageToken || '');
    } catch (error) {
      console.error('Error al cargar videos', error);
    }
  };

  const goToPage = (index) => {
    const token = tokenHistory[index];
    fetchVideos(searchQuery, token);
    setCurrentPage(index);
  };

  const goToNext = () => {
    if (!nextPageToken) return;
    const newHistory = [...tokenHistory];
    newHistory[currentPage + 1] = nextPageToken;
    setTokenHistory(newHistory);
    fetchVideos(searchQuery, nextPageToken);
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrev = () => {
    if (currentPage === 0) return;
    const token = tokenHistory[currentPage - 1];
    fetchVideos(searchQuery, token);
    setCurrentPage((prev) => prev - 1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setTokenHistory(['']);
    setCurrentPage(0);
    fetchVideos(query, '');
  };

  const handleFavorite = async (video) => {
    try {
      await axios.post(`${API_ADD_FAVORITE}?userId=${userId}`, {
        IdVideo: video.id,
        Title: video.snippet.title,
        ThumbnailUrl: video.snippet.thumbnails.medium.url,
        PublishedAt: video.snippet.publishedAt,
      });
      setToastMessage('Video agregado a favoritos');
    } catch (err) {
      setToastMessage('El video ya está en favoritos');
    }
  };

  const handleShare = (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
      navigator.share({ title: 'Mira este video', url }).catch(console.log);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setToastMessage('Enlace copiado al portapapeles');
      });
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col"
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-full">
              <h3 className="text-base font-semibold mb-2 text-gray-800 line-clamp-2">
                {video.snippet.title}
              </h3>

              <div className="flex gap-3 mt-auto justify-end">
                <button
                  onClick={() => handleFavorite(video)}
                  className="text-lg p-2 rounded hover:bg-gray-200"
                  aria-label="Agregar a favoritos"
                >
                  ❤️
                </button>

                <button
                  onClick={() => handleShare(video.id)}
                  className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 flex items-center justify-center"
                  aria-label="Compartir video"
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
      <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
        <button
          disabled={currentPage === 0}
          onClick={goToPrev}
          className={`px-3 py-1 rounded ${
            currentPage === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Anterior
        </button>

        {tokenHistory.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`px-3 py-1 rounded ${
              currentPage === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={!nextPageToken}
          onClick={goToNext}
          className={`px-3 py-1 rounded ${
            !nextPageToken
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Siguiente
        </button>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default VideosComponent;
