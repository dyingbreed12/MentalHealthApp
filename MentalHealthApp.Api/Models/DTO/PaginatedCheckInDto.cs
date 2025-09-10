namespace MentalHealthApp.Api.Models.DTO
{
    public class PaginatedCheckInDto
    {
        public IEnumerable<CheckInDto> Items { get; set; }
        public int TotalCount { get; set; }
    }
}