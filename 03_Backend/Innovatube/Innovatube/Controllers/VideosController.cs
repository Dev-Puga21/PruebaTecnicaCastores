using Innovatube.Context;
using Innovatube.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Innovatube.Controllers
{
    [ApiController]
    [Route("api/videos")]
    public class VideosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VideosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("favorites")]
        public IActionResult AddFavorite([FromBody] Video video, [FromQuery] int userId)
        {
            using SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection();
            conexion.Open();

            using SqlCommand insertVideoCmd = conexion.CreateCommand();
            insertVideoCmd.CommandType = CommandType.StoredProcedure;
            insertVideoCmd.CommandText = "Sp_InsertVideoIfNotExists";
            insertVideoCmd.Parameters.AddWithValue("@IdVideo", video.IdVideo);
            insertVideoCmd.Parameters.AddWithValue("@Title", video.Title);
            insertVideoCmd.Parameters.AddWithValue("@ThumbnailUrl", video.ThumbnailUrl);
            insertVideoCmd.Parameters.AddWithValue("@PublishedAt", video.PublishedAt);
            insertVideoCmd.ExecuteNonQuery();

            using SqlCommand addFavoriteCmd = conexion.CreateCommand();
            addFavoriteCmd.CommandType = CommandType.StoredProcedure;
            addFavoriteCmd.CommandText = "Sp_AddFavoriteVideo";
            addFavoriteCmd.Parameters.AddWithValue("@UserId", userId);
            addFavoriteCmd.Parameters.AddWithValue("@VideoId", video.IdVideo);
            addFavoriteCmd.ExecuteNonQuery();

            return Ok(new { message = "Video agregado a favoritos." });
        }

        [HttpGet("favorites/{userId}")]
        public IActionResult GetFavorites(int userId)
        {
            var favorites = new List<Video>();
            using SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection();
            conexion.Open();

            using SqlCommand cmd = conexion.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "Sp_GetFavoriteVideosByUser";
            cmd.Parameters.AddWithValue("@UserId", userId);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                favorites.Add(new Video
                {
                    IdVideo = reader["IdVideo"].ToString(),
                    Title = reader["Title"].ToString(),
                    ThumbnailUrl = reader["ThumbnailUrl"].ToString(),
                    PublishedAt = Convert.ToDateTime(reader["PublishedAt"])
                });
            }

            return Ok(favorites);
        }

        [HttpGet("favorites/search")]
        public IActionResult SearchFavorites([FromQuery] int userId, [FromQuery] string query)
        {
            var results = new List<Video>();
            using SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection();
            conexion.Open();

            using SqlCommand cmd = conexion.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "Sp_SearchFavoriteVideosByTitle";
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@SearchText", query);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                results.Add(new Video
                {
                    IdVideo = reader["IdVideo"].ToString(),
                    Title = reader["Title"].ToString(),
                    ThumbnailUrl = reader["ThumbnailUrl"].ToString(),
                    PublishedAt = Convert.ToDateTime(reader["PublishedAt"])
                });
            }

            return Ok(results);
        }

        [HttpDelete("favorites/{userId}/{videoId}")]
        public IActionResult RemoveFavorite(int userId, string videoId)
        {
            using SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection();
            conexion.Open();

            using SqlCommand cmd = conexion.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "Sp_RemoveFavoriteVideo";
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@VideoId", videoId);
            cmd.ExecuteNonQuery();

            return Ok(new { message = "Video eliminado de favoritos." });
        }
    }
}
