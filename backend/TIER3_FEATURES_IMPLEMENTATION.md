# Tier 3 Features - Implementation Complete ✅

## 1. Bulk Operations

**Purpose:** Perform actions on multiple items at once for efficiency

### Endpoints:

#### Bulk Delete News
```
POST /api/admin/news/bulk/delete

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "ids": [1, 2, 5, 10, 25]  // News IDs to delete (soft delete)
}

Validation:
  - ids: required, array, min 1 item
  - ids.*: integer, exists in news table

Response:
{
  "status": true,
  "message": "Successfully deleted 5 news items",
  "deleted_count": 5
}

Activity Log: Creates "bulk_delete" action
```

#### Bulk Publish News
```
POST /api/admin/news/bulk/publish

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "ids": [1, 2, 5, 10]
}

Response:
{
  "status": true,
  "message": "Successfully published 4 news items",
  "published_count": 4
}
```

#### Bulk Unpublish News
```
POST /api/admin/news/bulk/unpublish

Headers:
  Authorization: Bearer {token}

Body:
{
  "ids": [1, 5, 10]
}

Response:
{
  "status": true,
  "message": "Successfully unpublished 3 news items",
  "unpublished_count": 3
}
```

#### Bulk Approve News
```
POST /api/admin/news/bulk/approve

Headers:
  Authorization: Bearer {token}

Body:
{
  "ids": [5, 8, 12]  // IDs of pending news
}

Response:
{
  "status": true,
  "message": "Successfully approved 3 news items",
  "approved_count": 3
}
```

#### Bulk Update Category
```
POST /api/admin/news/bulk/category

Headers:
  Authorization: Bearer {token}

Body:
{
  "ids": [1, 2, 5, 10],
  "category_id": 3  // Move all to this category
}

Response:
{
  "status": true,
  "message": "Successfully updated category for 4 news items",
  "updated_count": 4
}
```

---

## 2. Export Data

**Purpose:** Export news data in multiple formats for reporting & analysis

### Endpoints:

#### Export as CSV
```
GET /api/admin/news/export/csv?status=approved&category_id=5&date_from=2025-01-01&date_to=2025-12-31

Headers:
  Authorization: Bearer {token}

Query Parameters (optional):
  - status: draft, pending, approved, rejected
  - category_id: Filter by category
  - writer_id: Filter by writer

Response:
Downloads file: news_2025-12-12_101500.csv

Content:
ID,Title,Author,Status,Published,Category,Excerpt,Created At,Updated At
1,Berita Pertama,John Writer,approved,Yes,Teknologi,"Excerpt text here","2025-12-01 10:00","2025-12-10 15:30"
2,Berita Kedua,Jane Writer,approved,Yes,Bisnis,"Another excerpt","2025-12-02 11:00","2025-12-11 14:20"
...
```

#### Export as Excel (TSV Format)
```
GET /api/admin/news/export/excel?status=approved

Headers:
  Authorization: Bearer {token}

Response:
Downloads file: news_2025-12-12_101500.xlsx

Format: Tab-separated values (compatible with Excel/Google Sheets)
Includes UTF-8 BOM for proper character encoding
```

#### Export as JSON
```
GET /api/admin/news/export/json?category_id=5

Headers:
  Authorization: Bearer {token}

Response:
Downloads file: news_2025-12-12_101500.json

Content:
[
  {
    "id": 1,
    "title": "Berita Pertama",
    "slug": "berita-pertama",
    "author": "John Writer",
    "excerpt": "...",
    "body": "...",
    "status": "approved",
    "is_published": true,
    "published_at": "2025-12-01T10:00:00Z",
    "category": "Teknologi",
    "created_at": "2025-12-01T10:00:00Z"
  },
  ...
]
```

#### Export as HTML Report
```
GET /api/admin/news/export/html?writer_id=2

Headers:
  Authorization: Bearer {token}

Response:
Downloads file: news_2025-12-12_101500.html

Content: Professional HTML table with:
  - Styled header with generation date
  - Total count
  - Color-coded status (green=approved, yellow=pending, red=rejected)
  - Can be opened in browser or printed to PDF
```

**All Export Filters:**
- `?status=approved`
- `?category_id=5`
- `?writer_id=2`
- `?status=draft&category_id=3&writer_id=1` (combined filters)

---

## 3. Email Notifications

**Purpose:** Notify writers and admins of important events via email

### Implementation:

Create `.env` configuration:
```
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Your App Name"
```

### Email Types Sent:

#### 1. News Approval Notification
```
Sent to: Writer's email (when admin approves their news)
Subject: Your news '[Title]' has been approved

Body:
Dear Writer,

Your news article has been approved!

**Article Details:**
- Title: Judul Berita
- Approved by: Admin Name
- Approved at: 2025-12-12 10:30:00

You can now publish it to the public. Visit your dashboard to manage your article.

Best regards,
Admin Team
```

#### 2. News Rejection Notification
```
Sent to: Writer's email (when admin rejects their news)
Subject: Your news '[Title]' needs revision

Body:
Dear Writer,

Your news article has been reviewed and requires revisions.

**Article Details:**
- Title: Judul Berita
- Rejected by: Admin Name
- Reason: Konten tidak sesuai dengan guidelines. Silakan tambahkan sumber referensi...

Please review the feedback and make the necessary changes. You can resubmit your article for review.

Best regards,
Admin Team
```

#### 3. Scheduled Publish Notification
```
Sent to: Writer's email (when scheduled news is published)
Subject: Your news '[Title]' has been published

Body:
Dear Writer,

Your scheduled news article is now live!

**Article Details:**
- Title: Judul Berita
- Published at: 2025-12-12 14:00:00
- View: http://yoursite.com/news/judul-berita

Thank you for your contribution.

Best regards,
Admin Team
```

#### 4. Account Creation Notification
```
Sent to: New user's email
Subject: Your account has been created

Body:
Dear New User,

Your admin account has been created successfully!

**Account Details:**
- Email: newuser@example.com
- Password: temporary-password-123
- Role: admin

Please log in at http://yoursite.com/login and change your password immediately.

Best regards,
Admin Team
```

#### 5. Account Deletion Notification
```
Sent to: Deleted user's email
Subject: Your account has been deleted

Body:
Dear User,

Your account has been deleted from the system.

If you believe this was done in error, please contact the administrator.

Best regards,
Admin Team
```

### Code Integration:
```php
use App\Services\EmailNotificationService;

// Send approval notification
EmailNotificationService::sendApprovalNotification($news, $admin);

// Send rejection notification
EmailNotificationService::sendRejectionNotification($news, $admin, $rejectionReason);

// Send scheduled publish notification
EmailNotificationService::sendScheduledPublishNotification($news);

// Send account creation
EmailNotificationService::sendAccountCreatedNotification($user, $password, 'admin');

// Send account deletion
EmailNotificationService::sendAccountDeletedNotification($user, $user->email);
```

---

## 4. Comments on Articles

**Purpose:** Allow readers/writers to discuss articles with moderation

### Database:
```
comments table:
  - id
  - news_id (foreign key)
  - user_id (nullable - for anonymous comments)
  - user_type (admin, writer, anonymous)
  - content (text)
  - is_approved (boolean) - require moderation
  - approved_at (timestamp)
  - is_spam (boolean) - for spam detection
  - created_at, updated_at
```

### Public Endpoints (No Auth Required, Rate Limited):

#### Get Comments for News
```
GET /api/news/5/comments?status=approved&page=1&per_page=20

Rate Limit: 5 requests per 1 minute (throttle:5,1)

Query Parameters:
  - status: approved (default), pending, spam
  - page: page number
  - per_page: items per page

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 1,
        "news_id": 5,
        "user_id": null,
        "user_type": "anonymous",
        "content": "Great article!",
        "is_approved": true,
        "approved_at": "2025-12-12T10:00:00Z",
        "created_at": "2025-12-12T09:00:00Z"
      },
      {
        "id": 2,
        "news_id": 5,
        "user_id": 2,
        "user_type": "writer",
        "content": "Informative read, thanks!",
        "is_approved": true,
        "approved_at": "2025-12-12T10:15:00Z",
        "created_at": "2025-12-12T09:30:00Z"
      }
    ],
    "meta": {...}
  }
}
```

#### Post Comment (Public)
```
POST /api/news/5/comments

Rate Limit: 5 requests per 1 minute (throttle:5,1)

Headers:
  Content-Type: application/json

Body:
{
  "content": "This is a great article! Very informative and well-written."
}

Validation:
  - content: required, min 3 chars, max 1000 chars

Response:
{
  "status": true,
  "message": "Comment created and awaiting approval",
  "data": {
    "id": 45,
    "news_id": 5,
    "user_id": null,
    "user_type": "anonymous",
    "content": "This is a great article!",
    "is_approved": false,  // Requires moderation
    "is_spam": false,
    "created_at": "2025-12-12T10:00:00Z"
  }
}

Note: Comment requires admin approval before showing publicly
```

### Admin Moderation Endpoints:

#### Get Pending Comments
```
GET /api/admin/comments/pending?page=1&per_page=20

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "data": {
    "list": [
      {
        "id": 45,
        "news_id": 5,
        "user_type": "anonymous",
        "content": "Comment text...",
        "is_approved": false,
        "created_at": "2025-12-12T10:00:00Z"
      }
    ],
    "meta": {...}
  }
}
```

#### Approve Comment
```
POST /api/admin/comments/45/approve

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "Comment approved",
  "data": {...}
}
```

#### Mark as Spam
```
POST /api/admin/comments/45/spam

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "Comment marked as spam"
}
```

#### Delete Comment
```
DELETE /api/admin/comments/45

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "Comment deleted"
}
```

### Spam Detection:
Automatic spam detection checks for:
- Spam keywords (viagra, casino, lottery, etc)
- Excessive URLs (more than 2 links)
- Excessive caps (>50% uppercase letters)

Comments marked as spam by automated detection are still stored but hidden.

---

## 5. Schedule Publish Later

**Purpose:** Schedule news to be published automatically at specific time

### Endpoints:

#### Schedule News Publishing
```
POST /api/admin/news/45/schedule

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "scheduled_publish_at": "2025-12-15T14:30:00"  // ISO format, must be in future
}

Validation:
  - scheduled_publish_at: required, date format, must be after now
  - News must be approved (status = 'approved')

Response:
{
  "status": true,
  "message": "News scheduled for publishing",
  "data": {
    "id": 45,
    "title": "Scheduled News",
    "is_scheduled": true,
    "scheduled_publish_at": "2025-12-15T14:30:00Z",
    "is_published": false,
    "published_at": null
  }
}

Activity Log: Creates "schedule_publish" action
```

#### Cancel Scheduled Publishing
```
POST /api/admin/news/45/cancel-schedule

Headers:
  Authorization: Bearer {token}

Response:
{
  "status": true,
  "message": "Scheduled publish cancelled",
  "data": {
    "id": 45,
    "is_scheduled": false,
    "scheduled_publish_at": null
  }
}

Activity Log: Creates "cancel_schedule" action
```

### Automatic Publishing:
Create a scheduled job (Laravel Command):
```bash
php artisan schedule:work
```

The job runs automatically at scheduled times and publishes news:
```php
// app/Console/Commands/PublishScheduledNews.php
News::where('is_scheduled', true)
    ->where('scheduled_publish_at', '<=', now())
    ->update(['is_published' => true, 'published_at' => now()]);
```

Then send notification:
```php
foreach ($publishedNews as $news) {
    EmailNotificationService::sendScheduledPublishNotification($news);
}
```

---

## 6. Rate Limiting

**Purpose:** Prevent abuse by limiting request frequency

### Configured Limits:

#### Public Comment Posting
```
Endpoint: POST /api/news/{id}/comments
Rate Limit: 5 requests per 1 minute (throttle:5,1)

Example:
- User can post max 5 comments per minute
- After limit exceeded: 429 Too Many Requests response
```

#### Response When Rate Limited:
```
HTTP 429 Too Many Requests

{
  "message": "Too Many Requests"
}
```

### How It Works:
- Laravel's throttle middleware tracks by IP address (for public)
- Tracks by user ID (for authenticated requests)
- Resets every specified time window

### Other Rate Limits You Can Add:
```php
// In routes:
Route::post('/api/user/login', [...])
    ->middleware('throttle:10,1'); // 10 attempts per minute

Route::post('/api/user/register', [...])
    ->middleware('throttle:3,1'); // 3 attempts per minute

Route::post('/api/news', [...])
    ->middleware('throttle:30,60'); // 30 requests per 60 minutes
```

---

## Implementation Checklist

✅ **Bulk Operations:**
- [ ] Test bulk delete with 5+ news items
- [ ] Test bulk publish
- [ ] Test bulk unpublish
- [ ] Test bulk approve
- [ ] Test bulk category update

✅ **Export Data:**
- [ ] Export as CSV and open in Excel
- [ ] Export as Excel (TSV) and open in Google Sheets
- [ ] Export as JSON and verify format
- [ ] Export as HTML and open in browser
- [ ] Test with filters: ?status=approved&category_id=5

✅ **Email Notifications:**
- [ ] Configure mail settings in .env
- [ ] Test approval notification
- [ ] Test rejection notification
- [ ] Test scheduled publish notification
- [ ] Test account creation email
- [ ] Verify email content is clear

✅ **Comments:**
- [ ] Post comment as anonymous (rate limited)
- [ ] Post comment as authenticated user
- [ ] Test spam detection (URLs, keywords, caps)
- [ ] Admin view pending comments
- [ ] Admin approve comment
- [ ] Admin mark as spam
- [ ] Admin delete comment

✅ **Schedule Publish:**
- [ ] Schedule news for future date
- [ ] Verify scheduled_publish_at is set
- [ ] Cancel schedule before publishing
- [ ] Create Laravel command to auto-publish

✅ **Rate Limiting:**
- [ ] Post 5+ comments in 1 minute, verify 429 error on 6th
- [ ] Verify different users have separate limits
- [ ] Verify authenticated users have separate throttle

---

## Database Migrations

Run these migrations:
```bash
php artisan migrate
```

Migrations created:
1. `create_comments_table.php` - Comments table with indexes
2. `add_scheduled_publish_to_news_table.php` - Scheduled fields for news

---

## Testing with Postman

**Bulk Delete:**
```
POST /api/admin/news/bulk/delete
{
  "ids": [1, 2, 3]
}
```

**Export CSV:**
```
GET /api/admin/news/export/csv?status=approved
```

**Schedule Publish:**
```
POST /api/admin/news/45/schedule
{
  "scheduled_publish_at": "2025-12-20T15:00:00"
}
```

**Post Comment:**
```
POST /api/news/5/comments
{
  "content": "Great article!"
}
```

**Approve Comment:**
```
POST /api/admin/comments/45/approve
```

---

## Frontend Integration Points

1. **Bulk Operations UI:**
   - Checkboxes on news list
   - Bulk action dropdown (Delete, Publish, Approve)
   - Confirmation dialog before action

2. **Export UI:**
   - Download buttons (CSV, Excel, JSON, HTML)
   - Filter options before export
   - Export status indicator

3. **Comments UI:**
   - Comment form at bottom of article
   - Comments list with pagination
   - Admin comment moderation panel

4. **Schedule UI:**
   - "Schedule publish" option when creating/editing news
   - Date/time picker
   - Show scheduled publish time in news list
   - "Cancel schedule" button for scheduled items

5. **Email Templates:**
   - Can be customized in app/Mail or config

---

## Environment Setup

Required configuration in `.env`:
```
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io (or your SMTP server)
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Your App"

# For local testing, use Mailtrap or similar service
# Or use file driver for testing:
MAIL_MAILER=file
```

---

## Performance Considerations

- **Bulk Operations:** Use chunk() for large datasets (>1000 items)
- **Exports:** Large exports (>10k items) may timeout - consider using queues
- **Comments:** Index on (news_id, is_approved) for fast queries
- **Scheduled Publishing:** Run job only once per minute to prevent duplicates

---

## Next Steps (Tier 4+)

- Advanced notification settings (channels, templates)
- Comment threading/replies
- User reputation system
- Advanced analytics dashboard
- API key management
- Webhook integrations
- Multi-language support
- Custom email templates builder

