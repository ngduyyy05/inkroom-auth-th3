# TH3 — INKROOM: Đăng ký và đăng nhập

Kết hợp giao diện React INKROOM của [TH1](https://github.com/ngduyyy05/inkroom-tattoo-booking) với ASP.NET Core Web API, Axios và EF Core SQLite của [TH2](https://github.com/ngduyyy05/aspnet-axios-efcore-practice).

## Chạy bài

Cần .NET SDK 10 và Node.js 22.12+ (hoặc Node.js 24).

Terminal 1, tại thư mục gốc:

```powershell
dotnet restore BackendApi
dotnet run --project BackendApi --launch-profile http
```

Terminal 2:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Mở **http://localhost:3000**. API chạy ở **http://localhost:5000**, Swagger ở **http://localhost:5000/swagger**. Vite chuyển tiếp `/api` tới backend. Dùng `npm` thay `npm.cmd` khi chạy trên macOS/Linux hoặc cmd. `npm.cmd` giúp tránh lỗi PowerShell chặn script `npm.ps1`.

Database `BackendApi/product.db` tự tạo và cập nhật bằng EF Core migrations khi API khởi động; không cần SQL Server. Không xóa database nếu muốn giữ các tài khoản đã đăng ký. Các migration và API Products từ TH2 vẫn được giữ.

## Luồng sử dụng

1. Chọn **Đăng nhập → Đăng ký ngay**. Nhập email, mật khẩu và xác nhận mật khẩu.
2. React kiểm tra email, mật khẩu 8–128 ký tự, xác nhận trùng khớp; API kiểm tra lại dữ liệu và email trùng.
3. API chuẩn hóa email về chữ thường, băm mật khẩu bằng `PasswordHasher`, lưu `Users` vào SQLite qua EF Core.
4. Đăng ký xong chuyển sang đăng nhập. API truy vấn user theo email và xác minh hash mật khẩu; thông tin sai trả HTTP 401.
5. Đăng nhập đúng trả user công khai, token ngẫu nhiên và hạn sử dụng 7 ngày. Database chỉ lưu SHA-256 của token trong `UserSessions`.
6. `AuthProvider` lưu phiên vào React Context và localStorage với key `inkroom-auth`; không lưu mật khẩu hoặc password hash trên trình duyệt.
7. Khi tải lại trang, Context đọc phiên và gọi `/api/auth/me` để xác minh với database trước khi hiển thị trang được bảo vệ. Phiên hết hạn hoặc bị thu hồi sẽ bị xóa. Lỗi mạng hiển thị nút thử lại.
8. `/account`, `/booking`, `/booking/success` yêu cầu đăng nhập. Người dùng được đưa về trang định truy cập sau khi đăng nhập. Email đặt lịch được điền từ Context.
9. Đăng xuất thu hồi token trên server, xóa Context/localStorage; các tab khác cập nhật qua sự kiện `storage`.

Phần đặt lịch vẫn là demo lưu localStorage từ TH1; phạm vi TH3 bổ sung xác thực user qua database.

## Các file chính

| File | Vai trò |
| --- | --- |
| `BackendApi/Controllers/AuthController.cs` | Validation, đăng ký, đăng nhập, xác minh và thu hồi phiên |
| `BackendApi/Models/User.cs` | Entity User và UserSession |
| `BackendApi/Data/AppDbContext.cs` | DbSet và unique index cho email/token |
| `BackendApi/Migrations/` | Lược đồ database, gồm phần Products của TH2 |
| `frontend/src/api.js` | Axios và xử lý lỗi API |
| `frontend/src/auth/AuthContext.jsx` | Context, localStorage, khôi phục phiên, đồng bộ tab |
| `frontend/src/auth/AuthPages.jsx` | Form đăng ký/đăng nhập, tài khoản, route được bảo vệ |
| `frontend/src/App.jsx` | Giao diện INKROOM, menu tài khoản và các route |

## API

| Method | URL | Dữ liệu / kết quả |
| --- | --- | --- |
| POST | `/api/auth/register` | `{ "email": "ban@example.com", "password": "Inkroom123!" }` → 201; trùng email → 409; dữ liệu sai → 400 |
| POST | `/api/auth/login` | Cùng cấu trúc trên → `{ token, expiresAt, user }`; sai thông tin → 401 |
| GET | `/api/auth/me` | Header `Authorization: Bearer <token>` → user; phiên không hợp lệ → 401 |
| POST | `/api/auth/logout` | Cùng header → 204; token bị thu hồi |
| GET/POST/PUT/DELETE | `/api/products` | API sản phẩm kế thừa TH2 |

User trả về chỉ có `id`, `email`, `createdAt`. Các endpoint `/me` và `/logout` kiểm tra token trực tiếp trong database. Tài khoản trong localStorage không được dùng làm bằng chứng xác thực trên server.

## Kiểm tra

```powershell
dotnet build BackendApi
cd frontend
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd test
```

Playwright tự chạy API và Vite, dùng database riêng `BackendApi/auth-tests.db`; cần để trống cổng 3000/5000 trước khi chạy test. Test bao gồm validation, email trùng không phân biệt hoa thường, sai mật khẩu, kiểm tra/thu hồi token, đăng ký → đăng nhập → đặt lịch, tải lại trang, đồng bộ đăng xuất nhiều tab, phiên localStorage hỏng/giả/hết hạn và giao diện mobile.

Muốn thêm migration:

```powershell
dotnet tool restore
dotnet ef migrations add TenMigration --project BackendApi
```

Đây là cấu hình chạy bài trên localhost. Build frontend bằng `npm.cmd run build`; khi triển khai cần reverse proxy `/api` tới ASP.NET Core hoặc đặt `VITE_API_URL` trước khi build và cấu hình CORS tương ứng. Cấu hình Docker gốc trong `frontend/` chỉ phục vụ frontend.
