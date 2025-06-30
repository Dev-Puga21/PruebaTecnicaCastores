using Innovatube;
using Microsoft.EntityFrameworkCore;
using Innovatube.Models;
using System.Collections.Generic;
using System.Data;

namespace Innovatube.Context
{
    public class AppDbContext : DbContext
    {
        private const string conectionstring = "conexion";

        public AppDbContext(DbContextOptions<AppDbContext> options) :
            base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }


    }
}
