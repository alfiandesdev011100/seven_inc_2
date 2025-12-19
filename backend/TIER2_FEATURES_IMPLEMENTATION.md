# Tier 2 Features - Implementation Complete ✅

## 1. User Management (Admin CRUD)

**Purpose:** Admin dapat membuat, mengedit, menghapus akun admin & writer lain

### Endpoints:

#### Get All Users
```
GET /api/admin/users?type=all&search=keyword&page=1&per_page=20

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Query Parameters:
  - type: 'all' (default), 'admin', 'writer'
  - search: Cari berdasarkan nama atau email
  - page: Nomor halaman (default: 1)
  - per_page: Items per page (default: 20)

Response:
{
  "status": true,
  "data": {
    "admins": {
      "list": [
        {
          "id": 1,
          "name": "Admin User",
          "email": "admin@example.com",
          "created_at": "2025-01-01T10:00:00Z",
          "updated_at": "2025-01-15T14:30:00Z"
        }
      ],
      "meta": {
        "current_page": 1,
        "per_page": 20,
        "total": 5,
        "last_page": 1
      }
    },
    "writers": {
      "list": [...],
      "meta": {...}
    }
  }
}
```

#### Create New User
```
POST /api/admin/users

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "writer"  // atau "admin"
}

Validation:
  - name: required, min 3 chars, max 255
  - email: required, email format, unique
  - password: required, min 6 chars, must match confirmation
  - role: required, in (admin, writer)

Response:
{
  "status": true,
  "message": "Writer created successfully",
  "data": {
    "id": 5,
    "name": "New User",
    "email": "newuser@example.com",
    "created_at": "2025-12-12T10:00:00Z"
  }
}
```

#### Get User Detail
```
GET /api/admin/users/5?type=writer

Headers:
  Authorization: Bearer {token}

Query Parameters:
  - type: 'admin' (default) atau 'writer'

Response:
{
  "status": true,
  "data": {
    "id": 5,
    "name": "New User",
    "email": "newuser@example.com",
    "created_at": "2025-12-12T10:00:00Z",
    "updated_at": "2025-12-12T10:00:00Z"
  }
}
```

#### Update User
```
PUT /api/admin/users/5?type=writer

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newPassword123",
  "password_confirmation": "newPassword123"
}

Note: Semua field opsional. Jika password kosong, tidak diubah.

Response:
{
  "status": true,
  "message": "User updated successfully",
  "data": {...}
}
```

#### Soft Delete User
```
DELETE /api/admin/users/5?type=writer

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "User deleted successfully"
}

Activity Log: Creates "delete" action
```

#### View Deleted Users
```
GET /api/admin/users/deleted?type=writer&page=1&per_page=20

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 3,
        "name": "Deleted User",
        "email": "deleted@example.com",
        "deleted_at": "2025-12-12T10:00:00Z"
      }
    ],
    "meta": {...}
  }
}
```

#### Restore Deleted User
```
POST /api/admin/users/5/restore?type=writer

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "User restored successfully",
  "data": {...}
}

Activity Log: Creates "restore" action
```

---

## 2. Search & Filter

**Applied to:** News & other list endpoints

### Features:
- Full-text search (title, excerpt, body, author)
- Filter by status (draft, pending, approved, rejected)
- Filter by category
- Filter by writer
- Filter by date range
- Sort by column (created_at, updated_at, title, etc)
- Ascending/descending order

### News Search Endpoint
```
GET /api/admin/news?search=keyword&status=approved&category_id=5&writer_id=2&sort=created_at&order=desc&date_from=2025-01-01&date_to=2025-12-12&page=1&per_page=10

Headers:
  Authorization: Bearer {token}

Query Parameters:
  - search: Cari di title, excerpt, body, author
  - status: draft, pending, approved, rejected
  - category_id: Filter by category ID
  - writer_id: Filter by writer ID
  - sort: created_at (default), updated_at, title, published_at, author, id
  - order: desc (default) atau asc
  - date_from: YYYY-MM-DD (cari dari tanggal ini)
  - date_to: YYYY-MM-DD (cari sampai tanggal ini)
  - page: 1 (default)
  - per_page: 10 (default)

Examples:

// Cari semua approved news
GET /api/admin/news?status=approved

// Cari berita dari penulis tertentu
GET /api/admin/news?writer_id=2

// Cari draft news dari kategori tertentu
GET /api/admin/news?status=draft&category_id=5

// Cari berita bulan lalu
GET /api/admin/news?date_from=2025-11-01&date_to=2025-11-30

// Kombinasi filter + sort
GET /api/admin/news?status=approved&sort=title&order=asc

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 45,
        "title": "Berita Terbaru",
        "status": "approved",
        "author": "Writer Name",
        "created_at": "2025-12-12T10:00:00Z",
        ...
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 10,
      "total": 150,
      "last_page": 15
    }
  }
}
```

---

## 3. Dashboard Statistics

**Purpose:** Tampilkan analytics di dashboard admin

### Overall Stats Endpoint
```
GET /api/admin/dashboard/stats

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "data": {
    "summary": {
      "total_news": 250,
      "total_admins": 3,
      "total_writers": 8
    },
    "news_status": {
      "draft": 45,
      "pending_approval": 12,
      "approved": 180,
      "rejected": 13
    },
    "recent_activity": [
      {
        "id": 1,
        "action": "create",
        "model_type": "news",
        "description": "Created news: Judul Berita",
        "user_type": "writer",
        "created_at": "2025-12-12T10:00:00Z"
      },
      ...
    ],
    "top_writers": [
      {
        "id": 2,
        "name": "Top Writer",
        "email": "writer@example.com",
        "news_count": 45
      },
      ...
    ],
    "recent_news": [
      {
        "id": 45,
        "title": "Latest News",
        "status": "approved",
        "created_at": "2025-12-12T10:00:00Z",
        ...
      },
      ...
    ],
    "news_per_month": [
      {
        "month": "2025-10",
        "count": 18
      },
      {
        "month": "2025-11",
        "count": 22
      },
      {
        "month": "2025-12",
        "count": 15
      }
    ]
  }
}
```

### Category Statistics
```
GET /api/admin/dashboard/category-stats

Response:
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Teknologi",
      "news_count": 85
    },
    {
      "id": 2,
      "name": "Bisnis",
      "news_count": 62
    },
    ...
  ]
}
```

### Writer Statistics
```
GET /api/admin/dashboard/writer-stats

Response:
{
  "status": true,
  "data": [
    {
      "id": 2,
      "name": "John Writer",
      "email": "john@example.com",
      "total_news": 45,
      "approved_news": 40,
      "created_at": "2025-01-01T10:00:00Z"
    },
    ...
  ]
}
```

---

## 4. Soft Delete & Recovery

**Purpose:** Recover data yang tidak sengaja dihapus

### Database:
- Menggunakan soft delete (data tidak benar-benar terhapus, hanya ditandai deleted_at)
- Admin dapat melihat & restore data yang dihapus
- Force delete untuk permanent delete

### Endpoints:

#### View Soft-Deleted News
```
GET /api/admin/news/deleted?page=1&per_page=10

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 45,
        "title": "Deleted News",
        "author": "Writer Name",
        "deleted_at": "2025-12-12T10:00:00Z",
        ...
      }
    ],
    "meta": {...}
  }
}
```

#### Restore Soft-Deleted News
```
POST /api/admin/news/45/restore

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "News restored successfully",
  "data": {
    "id": 45,
    "title": "Restored News",
    "status": "approved",
    ...
  }
}

Activity Log: Creates "restore" action
```

#### Permanent Delete
```
DELETE /api/admin/news/45/force-delete

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "News permanently deleted"
}

Activity Log: Creates "force_delete" action
Note: Ini hard delete, tidak bisa di-restore!
```

#### Soft Delete Users
```
// Same as news
GET /api/admin/users/deleted?type=writer
POST /api/admin/users/5/restore?type=writer
```

---

## Implementation Details

### News Model Scopes
```php
// Search
News::search('keyword') // Cari di title, excerpt, body, author

// Filter
News::status('approved')
News::byCategory(5)
News::byWriter(2)
News::onlyPublished()
News::approved() / ->pending() / ->draft()

// Date range
News::dateRange('2025-01-01', '2025-12-31')

// Sort
News::sortBy('created_at', 'desc')
```

### Service Layer
- UserController: Handle semua user management
- DashboardController: Handle semua statistics
- NewsController: Updated dengan search/filter & soft delete recovery

### Activity Logging
- Semua perubahan (create/update/delete/restore) tercatat di activity_logs table
- Admin dapat melihat siapa yang melakukan apa dan kapan
- Change capture untuk update operations (old vs new values)

---

## Testing Checklist

✅ **User Management:**
- [ ] Create new admin/writer (valid & invalid data)
- [ ] List all users with filters
- [ ] Get single user detail
- [ ] Update user (name, email, password)
- [ ] Soft delete user
- [ ] View deleted users
- [ ] Restore deleted user

✅ **Search & Filter:**
- [ ] GET /api/admin/news?search=keyword
- [ ] GET /api/admin/news?status=draft
- [ ] GET /api/admin/news?category_id=5
- [ ] GET /api/admin/news?sort=title&order=asc
- [ ] Combined filters: multiple params at once
- [ ] Date range: date_from & date_to

✅ **Dashboard Stats:**
- [ ] GET /api/admin/dashboard/stats
- [ ] Verify totals are correct
- [ ] Verify recent activity list
- [ ] GET /api/admin/dashboard/category-stats
- [ ] GET /api/admin/dashboard/writer-stats

✅ **Soft Delete & Recovery:**
- [ ] Soft delete news (data still in DB, deleted_at set)
- [ ] View deleted news
- [ ] Restore soft-deleted news
- [ ] Force delete news (permanent)
- [ ] Same for users

---

## Frontend Integration

**Admin Dashboard Updates Needed:**
1. Users Management Page
   - List view with add/edit/delete buttons
   - Search bar for filtering
   - Confirmation before delete

2. Dashboard Page
   - Statistics cards (total news, writers, pending)
   - Charts (news per month, by category, by writer)
   - Recent activity feed

3. News Management Page
   - Advanced filter bar (search, status, category, date, sort)
   - Apply selected filters
   - Display delete date if soft-deleted
   - Restore button for deleted news

4. Trash/Recycle Bin Page
   - View deleted items
   - Restore or permanently delete

---

## API Response Format

All endpoints follow this format:
```json
{
  "status": true/false,
  "message": "Optional message",
  "data": {},
  "errors": {}  // Only for validation errors
}
```

HTTP Status Codes:
- 200: Success (GET, PUT)
- 201: Created (POST)
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 422: Validation failed
- 500: Server error

---

## Next Steps (Tier 3)

After testing Tier 2 complete, implement:
- Email notifications (approve/reject news, user created/deleted)
- Advanced reporting (export CSV/Excel)
- Bulk operations (delete multiple, approve multiple)
- Scheduled tasks (auto-archive old news, cleanup old logs)
- Permission system (granular role-based access)
- Multi-language support

---

## Code Examples

### Frontend: Fetch with Filter
```javascript
// Search news
const params = new URLSearchParams({
  search: 'keyword',
  status: 'approved',
  category_id: 5,
  sort: 'created_at',
  order: 'desc',
  page: 1,
  per_page: 10
});

const response = await fetch(`/api/admin/news?${params}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();
```

### Frontend: Create User
```javascript
const response = await fetch('/api/admin/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Writer',
    email: 'writer@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    role: 'writer'
  })
});
```

### Frontend: Restore Deleted News
```javascript
const response = await fetch(`/api/admin/news/45/restore`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();
// News restored, update UI
```

