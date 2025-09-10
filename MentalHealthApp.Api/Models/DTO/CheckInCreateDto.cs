// File: MentalHealthApp.Api/Models/DTO/CheckInCreateDto.cs

namespace MentalHealthApp.Api.Models.DTO
{
    public class CheckInCreateDto
    {
        public int Mood { get; set; }
        public string Notes { get; set; }
    }
}