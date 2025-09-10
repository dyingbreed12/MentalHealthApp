// File: MentalHealthApp.Api/Data/DesignTimeDbContextFactory.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MentalHealthApp.Api.Data
{
    // This factory is a simple way for the 'dotnet ef' tools to create a DbContext
    // without running the full application.
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<CheckInContext>
    {
        public CheckInContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var builder = new DbContextOptionsBuilder<CheckInContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            builder.UseSqlite(connectionString);

            return new CheckInContext(builder.Options);
        }
    }
}