using Microsoft.AspNetCore.Mvc;
using Innovatube.Context;
using Innovatube.Models;
using System;
using Microsoft.Data.SqlClient;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Innovatube.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public class RegisterUserRequest
        {
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? Username { get; set; }
            public string? Email { get; set; }
            public string? accessPassword { get; set; }
            public string recaptchaToken { get; set; }
        }

        public class ReCaptchaResponse
        {
            public bool Success { get; set; }
            public string[]? ErrorCodes { get; set; }
        }

        [HttpPost]
        [Route("RegisterUsers")]
        public async Task<ActionResult> RegisterUsers([FromBody] RegisterUserRequest userRequest)
        {
            try
            {
                var secret = _configuration["GoogleReCaptcha:SecretKey"];
                using var httpClient = new HttpClient();
                var response = await httpClient.PostAsync(
                    $"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={userRequest.recaptchaToken}",
                    null
                );
                var resultString = await response.Content.ReadAsStringAsync();
                var captchaResponse = JsonSerializer.Deserialize<ReCaptchaResponse>(resultString, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (captchaResponse == null || !captchaResponse.Success)
                    return BadRequest("reCAPTCHA inválido.");

                using SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection();
                using SqlCommand comando = conexion.CreateCommand();

                conexion.Open();
                comando.CommandType = System.Data.CommandType.StoredProcedure;
                comando.CommandText = "Sp_RegisterUser";

                comando.Parameters.Add("@FirstName", System.Data.SqlDbType.NVarChar).Value = userRequest.FirstName ?? "";
                comando.Parameters.Add("@LastName", System.Data.SqlDbType.NVarChar).Value = userRequest.LastName ?? "";
                comando.Parameters.Add("@Username", System.Data.SqlDbType.NVarChar).Value = userRequest.Username ?? "";
                comando.Parameters.Add("@Email", System.Data.SqlDbType.NVarChar).Value = userRequest.Email ?? "";

                string passwordEncrypt = BCrypt.Net.BCrypt.HashPassword(userRequest.accessPassword ?? "", 12);
                comando.Parameters.Add("@accessPassword", System.Data.SqlDbType.NVarChar).Value = passwordEncrypt;

                comando.ExecuteNonQuery();
                conexion.Close();

                return Ok("Usuario registrado correctamente.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
