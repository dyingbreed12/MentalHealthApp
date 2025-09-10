// File: MentalHealthApp.Api/Interfaces/ICheckInRepository.cs

using MentalHealthApp.Api.Models;

namespace MentalHealthApp.Api.Interfaces
{
    public interface ICheckInRepository
    {
        Task<IEnumerable<CheckIn>> GetAllCheckInsAsync(int? userId, DateTime? fromDate, DateTime? toDate, int pageNumber, int pageSize);

        Task<CheckIn> GetCheckInByIdAsync(int id);

        Task AddCheckInAsync(CheckIn checkIn);

        Task UpdateCheckInAsync(CheckIn checkIn);

        Task<bool> CheckInExists(int id);

        Task<int> GetTotalCheckInCountAsync(int? userId, DateTime? fromDate, DateTime? toDate);
    }
}