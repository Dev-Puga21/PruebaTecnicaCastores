using Microsoft.AspNetCore.Mvc;
using Innovatube.Context;
using Innovatube.Models;
using System;
using System.Linq;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;

namespace Innovatube.Controllers
{
    [ApiController]
    [Route("api")]
    public class PasswordController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly SmtpSettings _smtpSettings;
        public PasswordController(AppDbContext context, IOptions<SmtpSettings> smtpSettings)
        {
            _context = context;
            _smtpSettings = smtpSettings.Value;
        }

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        public class ResetPasswordRequest
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
                return NotFound("Correo no encontrado.");

            string token = Guid.NewGuid().ToString();
            DateTime expiration = DateTime.Now.AddHours(1);

            var resetToken = new PasswordResetToken
            {
                Email = request.Email,
                Token = token,
                Expiration = expiration,
                Used = false
            };

            _context.PasswordResetTokens.Add(resetToken);
            _context.SaveChanges();

            string resetLink = $"https://innovatube-prueba-angular.netlify.app/reset-password?token={token}";

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("Innovatube", _smtpSettings.User));
            emailMessage.To.Add(MailboxAddress.Parse(request.Email));
            emailMessage.Subject = "Restablecer contraseña - Innovatube";
            emailMessage.Body = new TextPart("plain")
            {
                Text = $"Haz clic en este enlace para restablecer tu contraseña: {resetLink}"
            };

            using var client = new SmtpClient();
            client.Connect(_smtpSettings.Server, _smtpSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            client.Authenticate(_smtpSettings.User, _smtpSettings.Password);
            client.Send(emailMessage);
            client.Disconnect(true);


            return Ok("Se ha enviado un enlace de recuperación al correo.");
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var tokenRecord = _context.PasswordResetTokens
                .FirstOrDefault(t => t.Token == request.Token && t.Expiration > DateTime.Now && !t.Used);

            if (tokenRecord == null)
                return BadRequest("Token inválido o expirado.");

            var user = _context.Users.FirstOrDefault(u => u.Email == tokenRecord.Email);
            if (user == null)
                return NotFound("Usuario no encontrado.");

            user.accessPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);

            tokenRecord.Used = true;

            _context.SaveChanges();

            return Ok("Contraseña actualizada correctamente.");
        }
    }
}
