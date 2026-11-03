using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Controllers;

public class AuthRequest
{
    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    [MaxLength(254)]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [StringLength(128, MinimumLength = 8, ErrorMessage = "Mật khẩu phải có từ 8 đến 128 ký tự.")]
    public string Password { get; set; } = "";
}

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db) : ControllerBase
{
    private readonly PasswordHasher<User> hasher = new();
    private static object PublicUser(User user) => new { user.Id, user.Email, user.CreatedAt };

    [HttpPost("register")]
    public async Task<IActionResult> Register(AuthRequest input)
    {
        var email = input.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "Email đã được đăng ký." });

        var user = new User { Email = email };
        user.PasswordHash = hasher.HashPassword(user, input.Password);
        db.Users.Add(user);
        try { await db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException is Microsoft.Data.Sqlite.SqliteException { SqliteErrorCode: 19 })
        { return Conflict(new { message = "Email đã được đăng ký." }); }
        return StatusCode(201, new { message = "Đăng ký thành công. Vui lòng đăng nhập.", user = PublicUser(user) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthRequest input)
    {
        var email = input.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
        if (user is null)
        {
            // Thực hiện băm cả khi email không tồn tại để giảm chênh lệch thời gian phản hồi.
            hasher.HashPassword(new User(), input.Password);
            return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
        }
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, input.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
        if (result == PasswordVerificationResult.SuccessRehashNeeded)
            user.PasswordHash = hasher.HashPassword(user, input.Password);

        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        var expiresAt = DateTime.UtcNow.AddDays(7);
        db.UserSessions.Add(new UserSession { UserId = user.Id, TokenHash = Hash(token), ExpiresAt = expiresAt });
        await db.SaveChangesAsync();
        return Ok(new { token, expiresAt, user = PublicUser(user) });
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var session = await FindSession();
        return session is null ? Unauthorized(new { message = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." })
            : Ok(PublicUser(session.User));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var session = await FindSession();
        if (session is not null)
        {
            db.UserSessions.Remove(session);
            await db.SaveChangesAsync();
        }
        return NoContent();
    }

    private static string Hash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private Task<UserSession?> FindSession()
    {
        var header = Request.Headers.Authorization.ToString();
        if (!header.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)) return Task.FromResult<UserSession?>(null);
        var token = header[7..].Trim();
        if (token.Length != 64) return Task.FromResult<UserSession?>(null);
        var hash = Hash(token);
        return db.UserSessions.Include(s => s.User).SingleOrDefaultAsync(s => s.TokenHash == hash && s.ExpiresAt > DateTime.UtcNow);
    }
}
