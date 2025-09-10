// File: MentalHealthApp.Api/DataSeederService.cs

using MentalHealthApp.Api.Data;
using MentalHealthApp.Api.Models;
using Microsoft.EntityFrameworkCore;

public class DataSeederService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public DataSeederService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CheckInContext>();

        await context.Database.EnsureCreatedAsync();

        if (!context.Users.Any())
        {
            context.Users.AddRange(
                new User { Username = "employee", Password = "password", Role = "employee" },
                new User { Username = "manager", Password = "password", Role = "manager" }
            );
            await context.SaveChangesAsync();
        }

        if (!context.CheckIns.Any())
        {
            var employeeUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "employee");
            var managerUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "manager");

            if (employeeUser != null && managerUser != null)
            {
                for (int i = 1; i <= 5; i++)
                {
                    context.CheckIns.Add(new CheckIn
                    {
                        Mood = (i % 5) + 1,
                        Notes = $"Test note for employee {i}",
                        Timestamp = DateTime.UtcNow.AddDays(-i),
                        UserId = employeeUser.Id
                    });
                }

                for (int i = 6; i <= 10; i++)
                {
                    context.CheckIns.Add(new CheckIn
                    {
                        Mood = (i % 5) + 1,
                        Notes = $"Test note for manager {i}",
                        Timestamp = DateTime.UtcNow.AddDays(-i),
                        UserId = managerUser.Id
                    });
                }

                await context.SaveChangesAsync();
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}