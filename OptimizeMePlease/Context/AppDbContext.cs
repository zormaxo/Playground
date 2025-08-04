using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OptimizeMePlease.Entities;

namespace OptimizeMePlease.Context
{
    public class AppDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(
                "Server=localhost;Database=OptimizeMePlease;User Id=sa;Password=Aa123456!;MultipleActiveResultSets=true;TrustServerCertificate=True"
            );
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
    }
}
