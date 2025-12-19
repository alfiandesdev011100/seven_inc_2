# Tier 1 Features - Implementation Complete ✅

## 1. Password Change
**Endpoints:**
```
POST /api/admin/change-password
POST /api/writer/change-password

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "current_password": "password123",
  "new_password": "newPassword456",
  "new_password_confirmation": "newPassword456"
}

Response:
{
  "status": true,
  "message": "Password berhasil diubah"
}
```

---

## 2. Get Current User Profile
**Endpoints:**
```
GET /api/admin/me
GET /api/writer/me

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "admin": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@example.com",
    "role": "admin",
    "avatar": "http://localhost:8000/storage/avatars/...",
    "created_at": "2025-01-01T10:00:00Z"
  }
}
```

**Use Case:**
- Verify login saat page refresh di frontend
- Get current user info untuk display di navbar
- Check if token masih valid

---

## 3. Activity Logging
**Models:**
- `ActivityLog` - Stores all user activities
- `ActivityLogService` - Helper untuk log activity

**Database Fields:**
- `action` - create, update, delete, publish, approve, reject
- `model_type` - news, category, admin, writer, etc
- `model_id` - ID of the affected model
- `user_id` - ID of user who performed action
- `user_type` - admin, writer
- `changes` - JSON: old and new values
- `description` - Human readable description
- `ip_address` - IP of requester
- `user_agent` - Browser/client info
- `created_at` - Timestamp

**Endpoints:**

### Admin View All Activity Logs
```
GET /api/admin/activity-logs?action=create&model_type=news&user_type=writer&page=1&per_page=50

Headers:
  Authorization: Bearer {token}

Query Parameters:
  - action: 'create', 'update', 'delete', 'publish', 'approve'
  - model_type: 'news', 'category', 'job_work', etc
  - user_type: 'admin', 'writer'
  - user_id: Filter by specific user
  - date_from: YYYY-MM-DD (ISO date)
  - date_to: YYYY-MM-DD
  - per_page: 50 (default)
  - page: 1 (default)

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 1,
        "action": "create",
        "model_type": "news",
        "model_id": 45,
        "user_id": 2,
        "user_type": "writer",
        "description": "Created news: Judul Berita",
        "changes": null,
        "ip_address": "192.168.1.1",
        "created_at": "2025-12-12T10:00:00Z"
      },
      ...
    ],
    "meta": {
      "current_page": 1,
      "per_page": 50,
      "total": 250,
      "last_page": 5
    }
  }
}
```

### User View Own Activity
```
GET /api/admin/activity-logs/my-activity?page=1&per_page=20
GET /api/writer/activity

Headers:
  Authorization: Bearer {token}

Response: (Same as above)
```

### View History of Specific Model
```
GET /api/admin/activity-logs/model/news/45

Shows all changes made to news with ID 45

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "action": "create",
        "user_type": "writer",
        "user_id": 2,
        "description": "Created news: ...",
        "changes": null,
        "created_at": "2025-12-01T08:00:00Z"
      },
      {
        "action": "update",
        "user_type": "writer",
        "user_id": 2,
        "description": "Updated news: ...",
        "changes": {
          "title": {
            "old": "Old Title",
            "new": "New Title"
          }
        },
        "created_at": "2025-12-02T10:00:00Z"
      },
      {
        "action": "approve",
        "user_type": "admin",
        "user_id": 1,
        "description": "Approved news: ...",
        "created_at": "2025-12-03T15:00:00Z"
      }
    ]
  }
}
```

### Maintenance: Delete Old Logs
```
DELETE /api/admin/activity-logs/old

Body:
{
  "days": 90  // Delete logs older than 90 days
}

Response:
{
  "status": true,
  "message": "Deleted 1250 old activity logs"
}
```

**Usage in Code:**
```php
use App\Services\ActivityLogService;

// Simple log
ActivityLogService::log(
    action: 'create',
    modelType: 'news',
    modelId: $news->id,
    description: "Created news: {$news->title}",
    request: $request
);

// Log with changes
$changes = ActivityLogService::captureChanges($oldData, $newData);
ActivityLogService::log(
    action: 'update',
    modelType: 'news',
    modelId: $news->id,
    changes: $changes,
    description: "Updated news",
    request: $request
);
```

---

## 4. News Approval Status Workflow

**Database Changes:**
- Added fields to `news` table:
  - `status` - enum: draft, pending, approved, rejected
  - `approved_by` - ID of admin who approved
  - `rejection_reason` - Text reason for rejection
  - `approved_at` - Timestamp when approved
  - `rejected_at` - Timestamp when rejected

**Workflow:**
```
Writer creates news → Status: draft
    ↓
Writer submits for approval (if feature added) → Status: pending
    ↓
Admin reviews → Approve or Reject
    ├→ Approved → can be published
    └→ Rejected → writer sees reason & can edit
```

**Endpoints:**

### Get All News (Admin)
```
GET /api/admin/news?page=1&per_page=10&status=pending

Includes draft, pending, approved, rejected

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "...",
        "status": "approved",
        "approved_by": 1,
        "approved_at": "2025-12-12T10:00:00Z",
        "rejection_reason": null,
        ...
      }
    ]
  }
}
```

### Get Pending Approval News
```
GET /api/admin/news/pending?page=1&per_page=10

Shows only news waiting for approval

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 45,
        "title": "Berita dari Writer",
        "author": "Writer Name",
        "status": "pending",
        "created_at": "2025-12-12T09:00:00Z",
        ...
      }
    ]
  }
}
```

### Approve News
```
POST /api/admin/news/{id}/approve

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "is_published": true  // Optional: auto-publish saat approve
}

Response:
{
  "status": true,
  "message": "News approved",
  "data": {
    "id": 45,
    "status": "approved",
    "approved_by": 1,
    "approved_at": "2025-12-12T10:30:00Z",
    ...
  }
}
```

Activity Log: Creates "approve" action

### Reject News
```
POST /api/admin/news/{id}/reject

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "rejection_reason": "Konten tidak sesuai dengan guidelines. Silakan tambahkan sumber referensi pada paragraf kedua."
}

Response:
{
  "status": true,
  "message": "News rejected",
  "data": {
    "id": 45,
    "status": "rejected",
    "rejection_reason": "...",
    "rejected_at": "2025-12-12T10:30:00Z",
    ...
  }
}
```

Activity Log: Creates "reject" action

---

## Implementation Summary

✅ **Completed:**
1. Password change for admin & writer
2. Get current user endpoint (`/me`)
3. Activity logging system with service
4. Activity log endpoints for viewing history
5. News approval workflow with status tracking
6. All activity logging integrated to CRUD operations
7. Routes configured in api.php

✅ **Testing Checklist:**
- [ ] POST /api/admin/change-password (valid & invalid password)
- [ ] GET /api/admin/me (verify user data)
- [ ] Activity logs created for create/update/delete operations
- [ ] GET /api/admin/activity-logs with various filters
- [ ] POST /api/admin/news/{id}/approve
- [ ] POST /api/admin/news/{id}/reject
- [ ] GET /api/admin/news/pending

✅ **Frontend Integration Needed:**
1. Password change form in Profil page
2. Get user on app load to verify login
3. Show activity history in admin panel
4. Approve/reject interface for pending news
5. Show rejection reason to writer

---

## Next Steps (Tier 2)
After testing Tier 1 complete, implement:
- User management (admin CRUD users)
- Search & filter endpoints
- Dashboard statistics
- Soft delete recovery

