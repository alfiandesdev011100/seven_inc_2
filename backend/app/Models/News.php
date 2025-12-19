<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class News extends Model
{
    use SoftDeletes;

    protected $table = 'news';

    protected $fillable = [
        'title', 
        'slug', 
        'excerpt', 
        'body', 
        'cover_path',
        'is_published', 
        'is_scheduled',
        'published_at',
        'scheduled_publish_at',
        'author',
        'category_id',
        'status',
        'approved_by',
        'rejection_reason',
        'approved_at',
        'rejected_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_scheduled' => 'boolean',
        'published_at' => 'datetime',
        'scheduled_publish_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    protected $appends = ['cover_url'];

    // ===== RELATIONS =====
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // ===== Accessors =====
    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_path ? asset('storage/'.$this->cover_path) : null;
    }

    // ===== Relations =====
    public function writer()
    {
        return $this->belongsTo(Writer::class, 'writer_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'news_id');
    }

    public function approvedComments()
    {
        return $this->comments()->approved();
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'news_id');
    }

    public function approvedMedia()
    {
        return $this->media()->where('is_approved', true);
    }

    public function assignedTasks()
    {
        return $this->hasMany(ContentAssignment::class, 'news_id');
    }

    public function activeAssignments()
    {
        return $this->assignedTasks()->where('status', '!=', 'completed');
    }

    public function approvedBy()
    {
        return $this->belongsTo(Admin::class, 'approved_by_admin_id');
    }

    // ===== Scopes =====
    public function scopePublished($q)
    {
        return $q->where('is_published', true);
    }

    public function scopeOrdered($q)
    {
        // yang terbaru di-update duluan
        return $q->orderByDesc('updated_at')->orderByDesc('id');
    }

    /**
     * Search by title, excerpt, or body
     */
    public function scopeSearch($query, $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('excerpt', 'like', "%{$search}%")
              ->orWhere('body', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%");
        });
    }

    /**
     * Filter by status
     */
    public function scopeStatus($query, $status)
    {
        if (empty($status)) {
            return $query;
        }

        return $query->where('status', $status);
    }

    /**
     * Filter by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        if (empty($categoryId)) {
            return $query;
        }

        return $query->where('category_id', $categoryId);
    }

    /**
     * Filter by writer
     */
    public function scopeByWriter($query, $writerId)
    {
        if (empty($writerId)) {
            return $query;
        }

        return $query->where('writer_id', $writerId);
    }

    /**
     * Filter by publication status
     */
    public function scopeOnlyPublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Filter by approval status
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Date range filter
     */
    public function scopeDateRange($query, $from = null, $to = null)
    {
        if ($from) {
            $query->where('created_at', '>=', $from);
        }

        if ($to) {
            $query->where('created_at', '<=', $to);
        }

        return $query;
    }

    /**
     * Sort scope
     */
    public function scopeSortBy($query, $sortBy = 'created_at', $order = 'desc')
    {
        $allowedColumns = ['id', 'title', 'created_at', 'updated_at', 'published_at', 'author'];

        if (!in_array($sortBy, $allowedColumns)) {
            $sortBy = 'created_at';
        }

        $order = strtolower($order) === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $order);
    }

    // ===== Hooks =====
    protected static function boot()
    {
        parent::boot();

        static::creating(function (News $m) {
            if (empty($m->slug)) {
                $m->slug = static::makeUniqueSlug($m->title);
            }
            if ($m->is_published && empty($m->published_at)) {
                $m->published_at = now();
            }
        });

        static::updating(function (News $m) {
            if ($m->isDirty('title')) {
                $m->slug = static::makeUniqueSlug($m->title, $m->id);
            }
            if ($m->is_published && empty($m->published_at)) {
                $m->published_at = now();
            }
        });
    }

    public static function makeUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (static::when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)->withTrashed()->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
