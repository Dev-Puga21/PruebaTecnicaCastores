namespace Innovatube.Models
{
    public class UserFavoriteVideo
    {
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public string? VideoId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
