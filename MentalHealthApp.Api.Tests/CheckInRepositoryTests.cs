// File: MentalHealthApp.Api.Tests/CheckInRepositoryTests.cs

using MentalHealthApp.Api.Data;
using MentalHealthApp.Api.Models;
using MentalHealthApp.Api.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CheckInRepositoryTests
{
    private readonly DbContextOptions<CheckInContext> _options;

    public CheckInRepositoryTests()
    {
        _options = new DbContextOptionsBuilder<CheckInContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Fact]
    public async Task AddCheckInAsync_ShouldAddCheckInToDatabase()
    {
        // Arrange
        using var context = new CheckInContext(_options);
        await context.Database.EnsureCreatedAsync();

        var repository = new CheckInRepository(context);
        var newCheckIn = new CheckIn { Mood = 5, Notes = "Test note", Timestamp = DateTime.UtcNow, UserId = 1 };

        // Act
        await repository.AddCheckInAsync(newCheckIn);

        // Assert
        var addedCheckIn = await context.CheckIns.FirstOrDefaultAsync(c => c.Notes == "Test note");
        Assert.NotNull(addedCheckIn);
        Assert.Equal(5, addedCheckIn.Mood);
    }
}