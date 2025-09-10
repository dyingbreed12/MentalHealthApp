// File: MentalHealthApp.Api.Tests/CheckInRepositoryTests.cs

using MentalHealthApp.Api.Data;
using MentalHealthApp.Api.Models;
using MentalHealthApp.Api.Repositories;
using Microsoft.EntityFrameworkCore;

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
        var newCheckIn = new CheckIn { Mood = 5, Notes = "Test note", Timestamp = DateTime.UtcNow, UserId = 1 };

        using var context = new CheckInContext(_options);
        var repository = new CheckInRepository(context);

        // Act
        await repository.AddCheckInAsync(newCheckIn);

        // Assert
        var addedCheckIn = await context.CheckIns.FirstOrDefaultAsync(c => c.Notes == "Test note");
        Assert.NotNull(addedCheckIn);
        Assert.Equal(5, addedCheckIn.Mood);
    }

    [Fact]
    public async Task GetAllCheckInsAsync_ShouldFilterByUserId()
    {
        // Arrange
        using var context = new CheckInContext(_options);
        await context.Database.EnsureCreatedAsync();

        context.CheckIns.AddRange(
            new CheckIn { Mood = 4, Notes = "User 1 check-in", UserId = 1 },
            new CheckIn { Mood = 3, Notes = "User 2 check-in", UserId = 2 }
        );
        await context.SaveChangesAsync();

        var repository = new CheckInRepository(context);

        // Act
        // Add the new pagination parameters here with default values.
        var checkIns = await repository.GetAllCheckInsAsync(userId: 1, fromDate: null, toDate: null, pageNumber: 1, pageSize: 10);

        // Assert
        Assert.Single(checkIns);
        Assert.All(checkIns, c => Assert.Equal(1, c.UserId));
    }
}