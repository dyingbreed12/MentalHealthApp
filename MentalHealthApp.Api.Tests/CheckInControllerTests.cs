// File: MentalHealthApp.Api.Tests/CheckInControllerTests.cs

using MentalHealthApp.Api.Controllers;
using MentalHealthApp.Api.Interfaces;
using MentalHealthApp.Api.Models;
using MentalHealthApp.Api.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Routing;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

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
    public async Task PostCheckIn_ReturnsCreatedAtAction_WithValidCheckInDto()
    {
        // Arrange
        var newCheckInDto = new CheckInCreateDto { Mood = 5, Notes = "Feeling great!" };
        var mockRepo = new Mock<ICheckInRepository>();

        // Mock a user context to provide a User ID.
        var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "1") };
        var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));

        var controllerContext = new ControllerContext(new ActionContext(
            new DefaultHttpContext { User = user },
            new RouteData(),
            new ControllerActionDescriptor()
        ));

        // We set up the mock to return a CheckIn model for the GetCheckInByIdAsync call.
        var createdCheckIn = new CheckIn { Id = 1, Mood = 5, Notes = "Feeling great!", UserId = 1 };
        mockRepo.Setup(repo => repo.AddCheckInAsync(It.IsAny<CheckIn>())).Returns(Task.CompletedTask);
        mockRepo.Setup(repo => repo.GetCheckInByIdAsync(It.IsAny<int>())).ReturnsAsync(createdCheckIn);

        var controller = new CheckInController(mockRepo.Object)
        {
            ControllerContext = controllerContext
        };

        // Act
        var result = await controller.PostCheckIn(newCheckInDto);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(controller.GetCheckIn), createdAtActionResult.ActionName);
        Assert.Equal(201, createdAtActionResult.StatusCode);

        mockRepo.Verify(repo => repo.AddCheckInAsync(It.IsAny<CheckIn>()), Times.Once);
    }
}