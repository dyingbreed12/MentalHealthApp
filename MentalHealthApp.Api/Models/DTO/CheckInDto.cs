// File: MentalHealthApp.Api/Models/DTO/CheckInDto.cs

namespace MentalHealthApp.Api.Models.DTO
{
    public class CheckInDto
    {
        public int Id { get; set; }
        public int Mood { get; set; }
        public string Notes { get; set; }
        public DateTime Timestamp { get; set; }
        public int UserId { get; set; }
    }
}