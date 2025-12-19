<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\WriterAuthController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BulkActionController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LogoController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\BisnisKamiFullController;
use App\Http\Controllers\Api\WorksController;
use App\Http\Controllers\Api\JobWorksController; // Sudah diperbaiki menjadi Plural
use App\Http\Controllers\Api\SocialLinkController;
use App\Http\Controllers\Api\RequirementController;
use App\Http\Controllers\Api\InternshipHeroController;
use App\Http\Controllers\Api\InternshipCoreValueController;
use App\Http\Controllers\Api\InternshipTermsController;
use App\Http\Controllers\Api\InternshipFormationController;
use App\Http\Controllers\Api\InternshipFacilityController;
use App\Http\Controllers\Api\HeroSectionController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\ContentAssignmentController;
use App\Http\Controllers\Api\ContactController;

// ========== Tambahan sesuai permintaan ==========
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\InternshipProgramController;
use App\Http\Controllers\Api\InternshipApplicationController;
use App\Http\Controllers\Api\InternshipDashboardController;
use App\Http\Controllers\Api\JobVacancyController;
use App\Http\Controllers\Api\JobCandidateController;
// ================================================

Route::post('/admin/register', [AdminAuthController::class, 'register']);
Route::post('/admin/login',    [AdminAuthController::class, 'login']);

Route::post('/writer/register', [WriterAuthController::class, 'register']);
Route::post('/writer/login',    [WriterAuthController::class, 'login']);

// ========== PUBLIC (Bisa diakses tanpa login) ==========
Route::prefix('public')->group(function () {
    Route::get('/admin/logo', [LogoController::class, 'show']);
    Route::get('/about', [AboutController::class, 'show']);
    
    // TEST ENDPOINT - For Development Only (Remove in production)
    Route::get('/internship-applications-test', [InternshipApplicationController::class, 'index']);

    // Berita Public (Hanya yang published) - Alias: /berita dan /news
    Route::get('/berita', [NewsController::class, 'index']);
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/berita/{idOrSlug}', [NewsController::class, 'show']);
    Route::get('/news/{idOrSlug}', [NewsController::class, 'show']);

    Route::get('/bisnis-kami-full', [BisnisKamiFullController::class, 'show']);
    Route::get('/works/latest', [WorksController::class, 'latest']);
    Route::get('/social-links', [SocialLinkController::class, 'publicIndex']);
    Route::get('/internship/hero', [InternshipHeroController::class, 'show']);
    Route::get('/internship/core-values', [InternshipCoreValueController::class, 'index']);
    Route::get('/internship/terms', [InternshipTermsController::class, 'show']);
    Route::get('/internship/formations', [InternshipFormationController::class, 'index']);
    Route::get('/internship/facilities', [InternshipFacilityController::class, 'index']);
    Route::get('/hero', [HeroSectionController::class, 'show']);

    // JOB WORKS (PUBLIC: Hanya boleh LIHAT list dan detail)
    Route::get('/job-works', [JobWorksController::class, 'index']);
    Route::get('/lowongan-kerja', [JobWorksController::class, 'index']); // Alias
    Route::get('/job-works/{id}', [JobWorksController::class, 'show']);
    Route::get('/lowongan-kerja/{id}', [JobWorksController::class, 'show']); // Alias

    // Requirements Public
    Route::get('/requirements/by-job/{jobWorkId}', [RequirementController::class, 'showByJob']);
    Route::get('/requirements/{id}', [RequirementController::class, 'showPublicById']); // opsional

    // Contact Info (READ ONLY)
    Route::get('/kontak', [ContactController::class, 'showPublic']);

    // Internship Applications Submission (Public)
    Route::post('/internship-applications', [InternshipApplicationController::class, 'store']);

    // JOB VACANCIES (PUBLIC: Hanya boleh LIHAT list)
    Route::get('/job-vacancies', [JobVacancyController::class, 'indexPublic']);
});

// Keep old public routes for backward compatibility
Route::get('/admin/logo', [LogoController::class, 'show']);
Route::get('/about', [AboutController::class, 'show']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{idOrSlug}', [NewsController::class, 'show']);
Route::get('/bisnis-kami-full', [BisnisKamiFullController::class, 'show']);
Route::get('/works/latest', [WorksController::class, 'latest']);
Route::get('/social-links', [SocialLinkController::class, 'publicIndex']);
Route::get('/internship/hero', [InternshipHeroController::class, 'show']);
Route::get('/internship/core-values', [InternshipCoreValueController::class, 'index']);
Route::get('/internship/terms', [InternshipTermsController::class, 'show']);
Route::get('/internship/formations', [InternshipFormationController::class, 'index']);
Route::get('/internship/facilities', [InternshipFacilityController::class, 'index']);
Route::get('/hero', [HeroSectionController::class, 'show']);
Route::get('/job-works', [JobWorksController::class, 'index']);
Route::get('/job-works/{id}', [JobWorksController::class, 'show']);
Route::get('/requirements/by-job/{jobWorkId}', [RequirementController::class, 'showByJob']);
Route::get('/requirements/{id}', [RequirementController::class, 'showPublicById']);

// ===================================================
// ========== ADMIN (Wajib Login) + CATEGORY ==========
// ===================================================
Route::middleware(['auth:sanctum'])->group(function () {

    // ================= CATEGORY ROUTES (For Admin & Writer) =================
    // Writer: readonly (hanya lihat)
    // Admin: CRUD
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    // ========================================================================

    // =================== WRITER ROUTES (Writer Portal) ===================
    Route::prefix('writer')->group(function () {
        // Auth & Profile
        Route::get('/me', [WriterAuthController::class, 'me']); // Get current user
        Route::post('/change-password', [WriterAuthController::class, 'changePassword']);
        Route::post('/update-avatar',  [WriterAuthController::class, 'updateAvatar']);
        Route::post('/update-profile', [WriterAuthController::class, 'updateProfile']);
        Route::post('/logout',         [WriterAuthController::class, 'logout']);
        
        // Activity
        Route::get('/activity', [ActivityLogController::class, 'myActivity']); // My activity logs

        // News Management (Writer dapat CRUD tapi tidak publish)
        Route::get('/news', [NewsController::class, 'writerIndex']);        // Get writer's own news
        Route::post('/news', [NewsController::class, 'writerStore']);       // Create news (auto draft)
        Route::patch('/news/{idOrSlug}', [NewsController::class, 'writerUpdate']);  // Update own news
        Route::delete('/news/{idOrSlug}', [NewsController::class, 'writerDestroy']); // Delete own news

        // Media Management (Upload & manage)
        Route::get('/media', [MediaController::class, 'writerIndex']);      // Get writer's media
        Route::post('/media/upload', [MediaController::class, 'writerStore']); // Upload media
        Route::delete('/media/{id}', [MediaController::class, 'writerDestroy']); // Delete own media

        // Content Assignments (Tasks from Admin)
        Route::get('/assignments', [ContentAssignmentController::class, 'getMyAssignments']); // Get my tasks
        Route::get('/assignments/{id}', [ContentAssignmentController::class, 'show']); // Get assignment detail
        Route::post('/assignments/{id}/acknowledge', [ContentAssignmentController::class, 'acknowledge']); // Accept task
        Route::post('/assignments/{id}/start', [ContentAssignmentController::class, 'startWorking']); // Mark as in progress
        Route::post('/assignments/{id}/submit', [ContentAssignmentController::class, 'submit']); // Submit completed task
    });
    // ======================================================================

    Route::prefix('admin')->group(function () {

        // Auth & Profile
        Route::get('/me', [AdminAuthController::class, 'me']); // Get current user
        Route::post('/change-password', [AdminAuthController::class, 'changePassword']);
        Route::post('/update-avatar',  [AdminAuthController::class, 'updateAvatar']);
        Route::post('/update-profile', [AdminAuthController::class, 'updateProfile']);
        Route::post('/logout',         [AdminAuthController::class, 'logout']);
        
        // Activity Logs
        Route::get('/activity-logs', [ActivityLogController::class, 'index']); // Admin view all activity logs
        Route::get('/activity-logs/model/{modelType}/{modelId}', [ActivityLogController::class, 'modelHistory']); // History of specific model
        Route::delete('/activity-logs/old', [ActivityLogController::class, 'clearOldLogs']); // Maintenance: clear old logs

        // Dashboard Stats (Tier 2)
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']); // Overall stats
        Route::get('/dashboard/category-stats', [DashboardController::class, 'categoryStats']); // Stats per category
        Route::get('/dashboard/writer-stats', [DashboardController::class, 'writerStats']); // Stats per writer

        // User Management (Tier 2) - Admin CRUD
        Route::get('/users', [UserController::class, 'index']); // List all users (type=admin|writer|all)
        Route::post('/users', [UserController::class, 'store']); // Create new admin or writer
        Route::get('/users/{id}', [UserController::class, 'show']); // Get user detail (type=admin|writer)
        Route::put('/users/{id}', [UserController::class, 'update']); // Update user
        Route::delete('/users/{id}', [UserController::class, 'destroy']); // Soft delete user (type=admin|writer)
        Route::get('/users/deleted', [UserController::class, 'deleted']); // View deleted users (type=admin|writer)
        Route::post('/users/{id}/restore', [UserController::class, 'restore']); // Restore deleted user (type=admin|writer)

        // General Settings
        Route::post('/logo',  [LogoController::class, 'store']);
        Route::post('/about', [AboutController::class, 'store']);
        Route::post('/about/paragraph', [AboutController::class, 'updateParagraph']);
        Route::post('/about/core-text', [AboutController::class, 'updateCoreText']);
        Route::get('/kontak', [ContactController::class, 'showAdmin']);
        Route::put('/kontak', [ContactController::class, 'update']);

        // News Management
        Route::get('/news', [NewsController::class, 'adminIndex']); // View all news (with search/filter/sort)
        Route::get('/news/pending', [NewsController::class, 'pendingApproval']); // Get pending approval news
        Route::get('/news/deleted', [NewsController::class, 'deletedNews']); // View soft-deleted news (Tier 2)
        Route::post('/news', [NewsController::class, 'store']);
        Route::patch('/news/{idOrSlug}', [NewsController::class, 'update']);
        Route::post('/news/{idOrSlug}', [NewsController::class, 'update']); // Alternative: upload file via POST
        Route::delete('/news/{idOrSlug}', [NewsController::class, 'destroy']);
        Route::post('/news/{idOrSlug}/publish', [NewsController::class, 'togglePublish']);
        Route::post('/news/{idOrSlug}/approve', [NewsController::class, 'approveNews']); // Admin approve writer news
        Route::post('/news/{idOrSlug}/reject', [NewsController::class, 'rejectNews']); // Admin reject with reason
        Route::post('/news/{id}/restore', [NewsController::class, 'restoreNews']); // Restore soft-deleted news (Tier 2)
        Route::delete('/news/{id}/force-delete', [NewsController::class, 'forceDelete']); // Permanent delete (Tier 2)
        Route::post('/news/{idOrSlug}/schedule', [NewsController::class, 'schedulePublish']); // Schedule publish (Tier 3)
        Route::post('/news/{idOrSlug}/cancel-schedule', [NewsController::class, 'cancelSchedule']); // Cancel schedule (Tier 3)

        // Bulk Operations (Tier 3)
        Route::post('/news/bulk/delete', [BulkActionController::class, 'deleteNews']);
        Route::post('/news/bulk/publish', [BulkActionController::class, 'publishNews']);
        Route::post('/news/bulk/unpublish', [BulkActionController::class, 'unpublishNews']);
        Route::post('/news/bulk/approve', [BulkActionController::class, 'approveNews']);
        Route::post('/news/bulk/category', [BulkActionController::class, 'updateCategory']);

        // Export (Tier 3)
        Route::get('/news/export/csv', [ExportController::class, 'newsCSV']);
        Route::get('/news/export/excel', [ExportController::class, 'newsExcel']);
        Route::get('/news/export/json', [ExportController::class, 'newsJSON']);
        Route::get('/news/export/html', [ExportController::class, 'newsHTML']);

        // Bisnis Kami
        Route::put('/bisnis-kami-full/text', [BisnisKamiFullController::class, 'updateText']);
        Route::post('/bisnis-kami-full/image', [BisnisKamiFullController::class, 'updateImage']);
        Route::post('/works', [WorksController::class, 'store']);
        Route::patch('/works/{work}', [WorksController::class, 'update']);

        // Social Links
        Route::get('/social-links', [SocialLinkController::class, 'adminIndex']);
        Route::put('/social-links', [SocialLinkController::class, 'bulkUpsert']);

        // JOB WORKS (ADMIN: List, Tambah, Edit, Hapus)
        Route::get('/job-works', [JobWorksController::class, 'adminIndex']);
        Route::post('/job-works', [JobWorksController::class, 'store']);
        Route::put('/job-works/{id}', [JobWorksController::class, 'update']);
        Route::delete('/job-works/{id}', [JobWorksController::class, 'destroy']);

        // Requirements Management
        Route::post('/requirements', [RequirementController::class, 'store']);
        Route::get('/requirements/{id}', [RequirementController::class, 'showAdmin']);
        Route::patch('/requirements/{id}', [RequirementController::class, 'update']);
        Route::delete('/requirements/{id}', [RequirementController::class, 'destroy']);

        // Requirement Items
        Route::post('/requirements/{id}/items', [RequirementController::class, 'storeItem']);
        Route::patch('/requirements/{id}/items/{itemId}', [RequirementController::class, 'updateItem']);
        Route::delete('/requirements/{id}/items/{itemId}', [RequirementController::class, 'destroyItem']);
        Route::put('/requirements/{id}/items/bulk', [RequirementController::class, 'bulkUpsertItems']);
        Route::put('/requirements/{id}/items/reorder', [RequirementController::class, 'reorderItems']);

        // Internship Page Content
        Route::put('/internship/hero', [InternshipHeroController::class, 'updateText']);
        Route::post('/internship/hero/image', [InternshipHeroController::class, 'updateImage']);

        // Internship Programs Management
        Route::get('/internships', [InternshipProgramController::class, 'adminIndex']);
        Route::post('/internships', [InternshipProgramController::class, 'store']);
        Route::put('/internships/{id}', [InternshipProgramController::class, 'update']);
        Route::delete('/internships/{id}', [InternshipProgramController::class, 'destroy']);

        Route::put('/internship/core-values/header', [InternshipCoreValueController::class, 'updateHeader']);
        Route::put('/internship/core-values/cards/{card}', [InternshipCoreValueController::class, 'updateCard']);
        Route::post('/internship/core-values/cards/{card}/image', [InternshipCoreValueController::class, 'updateCardImage']);
        Route::put('/internship/core-values/cards/reorder', [InternshipCoreValueController::class, 'reorder']);

        Route::put('/internship/terms/header', [InternshipTermsController::class, 'updateHeader']);
        Route::put('/internship/terms/items/{index}', [InternshipTermsController::class, 'updateItem']);

        Route::put('/internship/formations/header', [InternshipFormationController::class, 'updateHeader']);
        Route::put('/internship/formations/cards/{card}', [InternshipFormationController::class, 'updateCard']);
        Route::post('/internship/formations/cards/{card}/image', [InternshipFormationController::class, 'updateCardImage']);

        Route::put('/internship/facilities/header', [InternshipFacilityController::class, 'updateHeader']);
        Route::put('/internship/facilities/items/{index}', [InternshipFacilityController::class, 'updateItem']);

        // Hero Section
        Route::post('/hero', [HeroSectionController::class, 'store']);
        Route::get('/hero/{id}', [HeroSectionController::class, 'showAdmin']);
        Route::patch('/hero/{id}', [HeroSectionController::class, 'update']);
        Route::delete('/hero/{id}', [HeroSectionController::class, 'destroy']);

        // Media Management (Admin review all media)
        Route::get('/media', [MediaController::class, 'adminIndex']);
        Route::post('/media/{id}/approve', [MediaController::class, 'approve']);
        Route::delete('/media/{id}', [MediaController::class, 'adminDestroy']);

        // Content Assignments (Admin Task Management)
        Route::post('/assignments', [ContentAssignmentController::class, 'assign']); // Create new assignment
        Route::get('/assignments', [ContentAssignmentController::class, 'getAllAssignments']); // Get all assignments (with filters)
        Route::get('/assignments/{id}', [ContentAssignmentController::class, 'show']); // Get assignment detail
        Route::put('/assignments/{id}', [ContentAssignmentController::class, 'update']); // Update assignment
        Route::post('/assignments/{id}/mark-completed', [ContentAssignmentController::class, 'markCompleted']); // Mark as completed
        Route::post('/assignments/{id}/cancel', [ContentAssignmentController::class, 'cancel']); // Cancel assignment

        // Comments Moderation (Admin)
        Route::get('/comments/pending', [CommentController::class, 'pending']); // Get pending comments
        Route::post('/comments/{id}/approve', [CommentController::class, 'approve']); // Approve comment
        Route::post('/comments/{id}/spam', [CommentController::class, 'markSpam']); // Mark as spam
        Route::delete('/comments/{id}', [CommentController::class, 'destroy']); // Delete comment

        // Internship Dashboard (Simple - Stats + Divisions)
        Route::get('/internship/dashboard', [InternshipDashboardController::class, 'getDashboard']);

        // Internship Applications Management (Admin)
        Route::get('/internship-applications', [InternshipApplicationController::class, 'index']); // List all applications
        Route::get('/internship-applications/{id}', [InternshipApplicationController::class, 'show']); // Get application detail
        Route::put('/internship-applications/{id}', [InternshipApplicationController::class, 'updateStatus']); // Update status
        Route::delete('/internship-applications/{id}', [InternshipApplicationController::class, 'destroy']); // Delete application
        Route::get('/internship-applications/by-position/{position}', [InternshipApplicationController::class, 'byPosition']); // Get applications by position
        Route::get('/internship-applications-stats/by-position', [InternshipApplicationController::class, 'statisticsByPosition']); // Get stats by position
        Route::post('/internship-applications/bulk/update-status', [InternshipApplicationController::class, 'bulkUpdateStatus']); // Bulk update status
        Route::get('/internship-applications/export/csv', [InternshipApplicationController::class, 'export']); // Export to CSV

        // JOB VACANCIES (ADMIN: CRUD)
        Route::get('/job-vacancies', [JobVacancyController::class, 'indexAdmin']);
        Route::post('/job-vacancies', [JobVacancyController::class, 'store']);
        Route::get('/job-vacancies/{id}', [JobVacancyController::class, 'show']);
        Route::put('/job-vacancies/{id}', [JobVacancyController::class, 'update']);
        Route::delete('/job-vacancies/{id}', [JobVacancyController::class, 'destroy']);

        // JOB CANDIDATES (ADMIN: Management per vacancy)
        Route::get('/job-candidates/{jobId}', [JobCandidateController::class, 'index']);
        Route::post('/job-candidates/upload/{jobId}', [JobCandidateController::class, 'import']);
        Route::post('/job-candidates/{jobId}/calculate-spk', [JobCandidateController::class, 'calculateSpk']);
        Route::delete('/job-candidates/{id}', [JobCandidateController::class, 'destroy']);
    });
});

// ========== PUBLIC COMMENTS (No auth required, Rate Limited) ==========
Route::middleware(['throttle:5,1'])->group(function () {
    Route::get('/news/{id}/comments', [CommentController::class, 'index']); // Get approved comments only
    Route::post('/news/{id}/comments', [CommentController::class, 'store']); // Post comment (with rate limit)
});

// ========== AUTHENTICATED COMMENTS ==========
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/news/{id}/comments', [CommentController::class, 'index']); // Get comments (higher limit for auth users)
    Route::post('/news/{id}/comments', [CommentController::class, 'store']); // Post comment
});
