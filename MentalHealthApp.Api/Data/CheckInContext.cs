// File: MentalHealthApp.Api/Data/CheckInContext.cs

using MentalHealthApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthApp.Api.Data
{
    public class CheckInContext : DbContext
    {
        public CheckInContext(DbContextOptions<CheckInContext> options)
            : base(options)
        {
        }

        public DbSet<CheckIn> CheckIns { get; set; }
        public DbSet<User> Users { get; set; }
    }
}