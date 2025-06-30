using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Innovatube.Context;
using Innovatube.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Innovatube.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("login")]
        public ActionResult Login(Login user)
        {
            try
            {
                SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection();
                SqlCommand comando = conexion.CreateCommand();
                conexion.Open();
                comando.CommandType = System.Data.CommandType.StoredProcedure;
                comando.CommandText = "Sp_LoginUser";

                comando.Parameters.Add("@login", SqlDbType.NVarChar).Value = user.login;
                comando.Parameters.Add("@accessPassword", SqlDbType.NVarChar).Value = user.accessPassword;

                SqlDataReader reader = comando.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        var Id = reader["Id"];
                        var statusUser = reader["StatusUser"].ToString();
                        var firstName = reader["FirstName"].ToString();
                        var lastname = reader["LastName"].ToString();
                        var passwordEncrypt = reader["PasswordHash"].ToString();
                        var firstLogin = reader["FirstLogin"].ToString();

                        if (BCrypt.Net.BCrypt.Verify(user.accessPassword, passwordEncrypt))
                        {
                            if (statusUser == "Activo")
                            {
                                var claims = new[]
                                {
                                    new Claim("Id", Id.ToString()),
                                    new Claim("FirstName", firstName),
                                    new Claim("LastName", lastname),
                                    new Claim("Username", user.login),
                                    new Claim("Email", user.login),
                                    new Claim("FirstLogin", firstLogin)
                                };
                                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("una_clave_secreta_mucho_mas_larga"));
                                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                                var token = new JwtSecurityToken(
                                    issuer: "https://localhost:7186",
                                    audience: "https://innovatube-prueba.netlify.app",
                                    claims: claims,
                                    expires: DateTime.Now.AddMinutes(30),
                                    signingCredentials: creds);

                                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                                return Ok(new
                                {
                                    message = "Login Successful",
                                    token = tokenString
                                });
                            }
                            else
                            {
                                return Unauthorized(new
                                {
                                    message = "Usuario Inactivo"
                                });
                            }
                        }
                    }
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}\nStackTrace: {ex.StackTrace}");
            }
        }





    }
}
