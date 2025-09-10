// File: MentalHealthApp.Api/Repositories/CheckInRepository.cs

using MentalHealthApp.Api.Data;
using MentalHealthApp.Api.Interfaces;
using MentalHealthApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthApp.Api.Repositories
{
    public class CheckInRepository : ICheckInRepository
    {
        private readonly CheckInContext _context;

        public CheckInRepository(CheckInContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CheckIn>> GetAllCheckInsAsync(int? userId, DateTime? fromDate, DateTime? toDate, int pageNumber, int pageSize)
        {
            var query = _context.CheckIns.Include(c => c.User).AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(c => c.UserId == userId.Value);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(c => c.Timestamp >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(c => c.Timestamp <= toDate.Value);
            }

            return await query
                .OrderByDescending(c => c.Timestamp)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalCheckInCountAsync(int? userId, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.CheckIns.AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(c => c.UserId == userId.Value);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(c => c.Timestamp >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(c => c.Timestamp <= toDate.Value);
            }
            return await query.CountAsync();
        }

        public async Task<CheckIn> GetCheckInByIdAsync(int id)
        {
            return await _context.CheckIns.Include(c => c.User).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task AddCheckInAsync(CheckIn checkIn)
        {
            await _context.CheckIns.AddAsync(checkIn);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCheckInAsync(CheckIn checkIn)
        {
            _context.Entry(checkIn).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CheckInExists(int id)
        {
            return await _context.CheckIns.AnyAsync(e => e.Id == id);
        }
    }
}