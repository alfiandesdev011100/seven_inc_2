# Backend Features - Admin & Writer Roles
## Status & Future Enhancements

### ✅ SUDAH ADA (Current Implementation)

#### Authentication & Authorization
- ✅ Admin Register & Login
- ✅ Writer Register & Login
- ✅ Token-based authentication (Sanctum)
- ✅ Logout (token deletion)
- ✅ Role-based access control (admin vs writer)

#### Profile Management
- ✅ Update Profile (name)
- ✅ Update Avatar (upload image)
- ✅ Logout
- ✅ Get Current User Profile (via `$request->user()`)

#### Admin Features
- ✅ News Management (CRUD + Publish)
- ✅ Category Management (CRUD)
- ✅ Job Works Management (CRUD)
- ✅ Internship Programs (CRUD)
- ✅ Media Management (Review & Delete)
- ✅ Content Settings (Logo, About, Hero, etc)
- ✅ News Approval (approve writer submissions)

#### Writer Features
- ✅ News Management (CRUD - own articles only)
- ✅ Media Upload (own media only)
- ✅ View Categories
- ✅ Auto-draft articles

---

### 🔴 MASIH BISA DITAMBAHKAN (Enhancements)

#### 1. **Password Management**
```
POST /api/admin/change-password
POST /api/writer/change-password

Body: {
  "current_password": "...",
  "new_password": "...",
  "password_confirmation": "..."
}
```
**Alasan**: User harus bisa mengubah password sendiri untuk keamanan.

---

#### 2. **Get Current User Profile**
```
GET /api/admin/me
GET /api/writer/me

Response: {
  "status": true,
  "user": { id, name, email, role, avatar, ... }
}
```
**Alasan**: Frontend perlu verify siapa yang login, especially saat halaman refresh.

---

#### 3. **Activity/Audit Logging**
**Table Migration**: 
```php
Schema::create('activity_logs', function (Blueprint $table) {
    $table->id();
    $table->string('action'); // 'create', 'update', 'delete', 'publish'
    $table->string('model_type'); // 'news', 'category', 'user'
    $table->unsignedBigInteger('model_id');
    $table->unsignedBigInteger('user_id');
    $table->string('user_type'); // 'admin', 'writer'
    $table->json('changes')->nullable(); // old & new values
    $table->timestamp('created_at');
});
```

**Endpoints**:
```
GET /api/admin/activity-logs
GET /api/admin/activity-logs?user_type=writer&action=create
```

**Alasan**: Admin perlu audit trail untuk tracking siapa yang ubah apa.

---

#### 4. **User Management (Admin Only)**
```
GET /api/admin/users
GET /api/admin/users/{id}
POST /api/admin/users (create new admin/writer)
PUT /api/admin/users/{id} (edit user)
DELETE /api/admin/users/{id} (soft delete)
POST /api/admin/users/{id}/disable (disable user account)
```

**Alasan**: Admin perlu kelola admin & writer lain (role hierarchy).

---

#### 5. **News Approval Status Tracking**
**Table Enhancement**:
```php
// Tambah ke news migration:
$table->enum('status', ['draft', 'pending', 'approved', 'rejected']);
$table->unsignedBigInteger('approved_by')->nullable();
$table->text('rejection_reason')->nullable();
$table->timestamp('approved_at')->nullable();
$table->foreign('approved_by')->references('id')->on('admins');
```

**Endpoints**:
```
POST /api/admin/news/{id}/approve
POST /api/admin/news/{id}/reject (with reason)
GET /api/admin/news/pending (filter pending approval)
```

**Alasan**: Workflow approval untuk kontrol kualitas berita.

---

#### 6. **Search & Filter Endpoints**
```
GET /api/admin/news?search=keyword&status=draft&date_from=2025-01-01&sort=created_at

GET /api/admin/users?search=email&role=admin&sort=name

GET /api/admin/job-works?search=posisi&company=seveninc
```

**Alasan**: Frontend perlu pencarian & filter yang powerful.

---

#### 7. **Bulk Operations**
```
POST /api/admin/news/bulk-delete
Body: { "ids": [1, 2, 3] }

POST /api/admin/news/bulk-publish
Body: { "ids": [1, 2, 3] }

POST /api/admin/news/bulk-status
Body: { "ids": [1, 2, 3], "status": "approved" }
```

**Alasan**: Admin perlu operasi batch untuk efisiensi.

---

#### 8. **Export Data**
```
GET /api/admin/news/export?format=csv|excel|pdf

GET /api/admin/users/export?format=csv&role=writer
```

**Alasan**: Admin sering perlu export laporan.

---

#### 9. **Dashboard Statistics** (Admin Only)
```
GET /api/admin/stats

Response: {
  "status": true,
  "stats": {
    "total_news": 45,
    "draft_news": 12,
    "published_news": 33,
    "total_writers": 5,
    "total_admins": 2,
    "pending_approval": 3,
    "recent_activity": [...]
  }
}
```

**Alasan**: Dashboard perlu data statistik real-time.

---

#### 10. **Email Notifications** 
```
POST /api/admin/news/{id}/approve
  -> Send email ke writer: "Artikel Anda telah approved"

Writer submit news
  -> Send email ke admin: "Ada berita pending approval dari {writer}"

Password changed
  -> Send email confirmation
```

**Alasan**: User communication penting untuk UX.

---

#### 11. **Rate Limiting & Security**
```php
// middleware/throttle untuk prevent abuse:
POST /api/admin/login - 5 attempts per minute
POST /api/writer/login - 5 attempts per minute
POST /api/*/upload - 10 requests per minute
```

**Alasan**: Prevent brute force attacks dan resource abuse.

---

#### 12. **Soft Delete**
```php
// Add to models:
use SoftDeletes;
protected $dates = ['deleted_at'];

GET /api/admin/news?with_trash=true (include deleted)
POST /api/admin/news/{id}/restore
POST /api/admin/news/{id}/force-delete
```

**Alasan**: Recovery data yang accidentally deleted.

---

#### 13. **Pagination & Sorting Consistency**
```
GET /api/admin/news?page=1&per_page=15&sort=-created_at

Response: {
  "status": true,
  "data": {
    "list": [...],
    "meta": {
      "current_page": 1,
      "per_page": 15,
      "total": 100,
      "last_page": 7
    }
  }
}
```

**Alasan**: Standardisasi response format untuk semua endpoints.

---

#### 14. **Comment/Review System**
```
POST /api/admin/news/{id}/comments
GET /api/admin/news/{id}/comments
PUT /api/admin/news/{id}/comments/{comment_id}
DELETE /api/admin/news/{id}/comments/{comment_id}
```

**Alasan**: Admin & writer bisa collaborate via comments pada news.

---

#### 15. **Scheduling/Publish Later**
```
POST /api/admin/news
Body: {
  "title": "...",
  "content": "...",
  "is_published": false,
  "publish_at": "2025-12-31 10:00:00"
}
```

**Alasan**: Schedule publikasi otomatis di waktu tertentu.

---

### 📊 PRIORITY RECOMMENDATIONS

**Tier 1 (Critical - Implementasi SEGERA)**:
1. Password change endpoint
2. Get current user profile (`/me`)
3. Activity logging
4. News approval status tracking

**Tier 2 (Important - Implementasi dalam 1-2 minggu)**:
1. User management (admin CRUD users)
2. Search & filter endpoints
3. Dashboard statistics
4. Soft delete recovery

**Tier 3 (Nice to Have - Implementasi kemudian)**:
1. Bulk operations
2. Export data
3. Email notifications
4. Rate limiting
5. Comment system
6. Scheduling

---

### 🛠️ IMPLEMENTATION CHECKLIST

Untuk setiap fitur baru yang diimplementasi:

- [ ] Create Migration (jika ada schema change)
- [ ] Update Model relationships
- [ ] Create Controller method
- [ ] Add route di `/routes/api.php`
- [ ] Add validation rules
- [ ] Add response formatting (sesuai existing pattern)
- [ ] Add error handling
- [ ] Test dengan Postman/API client
- [ ] Update frontend integration
- [ ] Document di sini

---

### 📝 NOTES

- Semua endpoint admin hanya accessible untuk role `admin`
- Semua endpoint writer hanya accessible untuk role `writer`
- Gunakan `$request->user()` untuk get current user
- Gunakan `$request->user()->id` untuk filter data (own data only)
- Jangan forget middleware `auth:sanctum` untuk protected routes
