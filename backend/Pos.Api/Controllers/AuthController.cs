using Microsoft.AspNetCore.Mvc;
using Pos.Api.Dtos;
using Pos.Api.Services;

namespace Pos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;

        public AuthController(AuthService auth)
        {
            _auth = auth;
        }

        // POST: api/auth/seed
        // Creates default users only if the Users collection is empty
        [HttpPost("seed")]
        public async Task<IActionResult> Seed()
        {
            await _auth.EnsureSeedUsersAsync();
            return Ok(new { message = "Seed done (if users were empty)." });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Username and password are required." });

            var user = await _auth.FindActiveUserAsync(dto.Username.Trim());
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials." });

            var ok = _auth.VerifyPassword(dto.Password, user.PasswordHash);
            if (!ok)
                return Unauthorized(new { message = "Invalid credentials." });

            var (token, expiresAtUtc) = _auth.GenerateJwt(user);

            return Ok(new LoginResponseDto
            {
                Token = token,
                Username = user.Username,
                Role = user.Role,
                ExpiresAtUtc = expiresAtUtc
            });
        }
    }
}
