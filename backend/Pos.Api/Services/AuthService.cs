using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Pos.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Pos.Api.Services
{
    public class AuthService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _config;

        public AuthService(IMongoDatabase db, IConfiguration config)
        {
            _users = db.GetCollection<User>("Users");
            _config = config;
        }

        public async Task<User?> FindActiveUserAsync(string username)
        {
            return await _users.Find(u => u.Username == username && u.IsActive).FirstOrDefaultAsync();
        }

        public string HashPassword(string password)
            => BCrypt.Net.BCrypt.HashPassword(password);

        public bool VerifyPassword(string password, string hash)
            => BCrypt.Net.BCrypt.Verify(password, hash);

        public async Task EnsureSeedUsersAsync()
        {
            // Seed an Admin and Cashier only if Users collection is empty
            var count = await _users.CountDocumentsAsync(_ => true);
            if (count > 0) return;

            var admin = new User
            {
                Username = "admin",
                PasswordHash = HashPassword("Admin@123"),
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var cashier = new User
            {
                Username = "cashier",
                PasswordHash = HashPassword("Cashier@123"),
                Role = "Cashier",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _users.InsertManyAsync(new[] { admin, cashier });
        }

        public (string token, DateTime expiresAtUtc) GenerateJwt(User user)
        {
            var key = _config["Jwt:Key"] ?? throw new Exception("Jwt:Key missing");
            var issuer = _config["Jwt:Issuer"] ?? "Pos.Api";
            var audience = _config["Jwt:Audience"] ?? "Pos.Client";
            var expiresMinutes = int.TryParse(_config["Jwt:ExpiresMinutes"], out var m) ? m : 120;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("uid", user.Id)
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(expiresMinutes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }
    }
}
