// File: MentalHealthApp.Api/Models/User.cs

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MentalHealthApp.Api.Models
{
    // User model with basic authentication properties.
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Username { get; set; }
        public string Password { get; set; } // In a real app, this should be a hashed password.
        public string Role { get; set; } // "employee" or "manager"
    }
}