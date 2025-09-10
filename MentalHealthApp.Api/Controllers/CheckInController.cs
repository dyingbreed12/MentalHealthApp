// File: MentalHealthApp.Api/Controllers/CheckInController.cs

using MentalHealthApp.Api.Interfaces;
using MentalHealthApp.Api.Models;
using MentalHealthApp.Api.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MentalHealthApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckInController : ControllerBase
    {
        private readonly ICheckInRepository _repository;

        public CheckInController(ICheckInRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Authorize(Roles = "manager,employee")]
        public async Task<ActionResult<PaginatedCheckInDto>> GetCheckIns(
                  [FromQuery] DateTime? from,
                  [FromQuery] DateTime? to,
                  [FromQuery] int pageNumber = 1,
                  [FromQuery] int pageSize = 5)
        {
            int? userId = null;
            if (User.IsInRole("employee"))
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdString, out var employeeId))
                {
                    return Unauthorized("User ID not found or invalid.");
                }
                userId = employeeId;
            }

            var checkIns = await _repository.GetAllCheckInsAsync(userId, from, to, pageNumber, pageSize);
            var totalCount = await _repository.GetTotalCheckInCountAsync(userId, from, to);

            var checkInDtos = checkIns.Select(c => new CheckInDto
            {
                Id = c.Id,
                Mood = c.Mood,
                Notes = c.Notes,
                Timestamp = c.Timestamp,
                UserId = c.UserId,
            });
            return Ok(new PaginatedCheckInDto
            {
                Items = checkInDtos,
                TotalCount = totalCount
            });
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<CheckInDto>> GetCheckIn(int id)
        {
            var checkIn = await _repository.GetCheckInByIdAsync(id);
            if (checkIn == null)
            {
                return NotFound();
            }
            var checkInDto = new CheckInDto
            {
                Id = checkIn.Id,
                Mood = checkIn.Mood,
                Notes = checkIn.Notes,
                Timestamp = checkIn.Timestamp,
                UserId = checkIn.UserId,
            };
            return Ok(checkInDto);
        }

        [HttpPost]
        [Authorize(Roles = "employee,manager")]
        public async Task<ActionResult<CheckInDto>> PostCheckIn([FromBody] CheckInCreateDto checkInDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized("User ID not found or invalid.");
            }

            var checkIn = new CheckIn
            {
                Mood = checkInDto.Mood,
                Notes = checkInDto.Notes,
                UserId = userId,
                Timestamp = DateTime.UtcNow
            };

            await _repository.AddCheckInAsync(checkIn);

            var createdCheckIn = await _repository.GetCheckInByIdAsync(checkIn.Id);
            var createdCheckInDto = new CheckInDto
            {
                Id = createdCheckIn.Id,
                Mood = createdCheckIn.Mood,
                Notes = createdCheckIn.Notes,
                Timestamp = createdCheckIn.Timestamp,
                UserId = createdCheckIn.UserId,
            };

            return CreatedAtAction(nameof(GetCheckIn), new { id = createdCheckInDto.Id }, createdCheckInDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> PutCheckIn(int id, [FromBody] CheckInCreateDto checkInDto)
        {
            var existingCheckIn = await _repository.GetCheckInByIdAsync(id);
            if (existingCheckIn == null)
            {
                return NotFound();
            }

            existingCheckIn.Mood = checkInDto.Mood;
            existingCheckIn.Notes = checkInDto.Notes;

            await _repository.UpdateCheckInAsync(existingCheckIn);
            return NoContent();
        }

        [HttpPut("mycheckin/{id}")]
        [Authorize(Roles = "employee")]
        public async Task<IActionResult> PutMyCheckIn(int id, [FromBody] CheckInCreateDto checkInDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out var userId))
            {
                return Unauthorized("User ID not found or invalid.");
            }

            var existingCheckIn = await _repository.GetCheckInByIdAsync(id);
            if (existingCheckIn == null)
            {
                return NotFound();
            }

            if (existingCheckIn.UserId != userId)
            {
                return Forbid("You can only edit your own check-ins.");
            }

            existingCheckIn.Mood = checkInDto.Mood;
            existingCheckIn.Notes = checkInDto.Notes;

            await _repository.UpdateCheckInAsync(existingCheckIn);
            return NoContent();
        }
    }
}