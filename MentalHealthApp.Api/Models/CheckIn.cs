// File: MentalHealthApp.Api/Models/CheckIn.cs

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MentalHealthApp.Api.Models
{
    // CheckIn model represents a mental health check-in entry.
    public class CheckIn
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Mood rating on a scale of 1 to 5.
        [Range(1, 5, ErrorMessage = "Mood must be between 1 and 5.")]
        public int Mood { get; set; }

        // Optional notes from the employee.
        public string Notes { get; set; }

        // The date and time the check-in was submitted.
        public DateTime Timestamp { get; set; }

        // Foreign key for the user who submitted the check-in.
        public int UserId { get; set; }

        public User User { get; set; }
    }
}