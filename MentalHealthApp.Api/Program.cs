// File: MentalHealthApp.Api/Program.cs

using MentalHealthApp.Api.Data;
using MentalHealthApp.Api.Interfaces;
using MentalHealthApp.Api.Repositories;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<CheckInContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add in-memory authentication services
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "auth-cookie";
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401; // Unauthorized
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = 403; // Forbidden
            return Task.CompletedTask;
        };
    });
// Add this line to register the authorization service.
builder.Services.AddAuthorization();

builder.Services.AddScoped<ICheckInRepository, CheckInRepository>();

// Add CORS policy to allow the Next.js frontend to communicate with the API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000") // This must match your frontend URL.
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials(); // This is required for cookies/authentication
        });
});

// Seed mock data into the database on startup.
builder.Services.AddHostedService<DataSeederService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Use development-specific settings here if needed
}

// The order of these middleware calls is crucial.
// CORS must be called before Authentication and Authorization.
app.UseCors("AllowNextJs");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();