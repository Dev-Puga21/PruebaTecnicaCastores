using System.ComponentModel.DataAnnotations;

namespace Innovatube.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? accessPassword { get; set; }
        public bool? FirstLogin { get; set; }
        public string? statusUser { get; set; }
        public DateTime? CreatedAt { get; set; }

        public string recaptchaToken { get; set; }


    }
}
