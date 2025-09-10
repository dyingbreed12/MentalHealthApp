// File: MentalHealthApp.Api.Tests/CheckInControllerTests.cs

using MentalHealthApp.Api.Controllers;
using MentalHealthApp.Api.Interfaces;
using MentalHealthApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace MentalHealthApp.Api.Tests
{
    public class CheckInControllerTests
    {
        [Fact]
        public async Task GetCheckIn_ReturnsNotFound_ForNonExistentId()
        {
            // Arrange
            var mockRepo = new Mock<ICheckInRepository>();
            mockRepo.Setup(repo => repo.GetCheckInByIdAsync(999)).ReturnsAsync((CheckIn)null);
            var controller = new CheckInController(mockRepo.Object);

            // Act
            var result = await controller.GetCheckIn(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostCheckIn_ReturnsCreatedAtAction_WithValidCheckIn()
        {
            // Arrange
            var newCheckIn = new CheckIn { Mood = 5, Notes = "Feeling great!", UserId = 1 };
            var mockRepo = new Mock<ICheckInRepository>();
            // We set up the mock to do nothing and verify it's called later
            mockRepo.Setup(repo => repo.AddCheckInAsync(It.IsAny<CheckIn>())).Returns(Task.CompletedTask);
            var controller = new CheckInController(mockRepo.Object);

            // Act
            var result = await controller.PostCheckIn(newCheckIn);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(controller.GetCheckIn), createdAtActionResult.ActionName);
            Assert.Equal(201, createdAtActionResult.StatusCode);
            // Verify that the repository method was called exactly once.
            mockRepo.Verify(repo => repo.AddCheckInAsync(It.IsAny<CheckIn>()), Times.Once);
        }
    }
}