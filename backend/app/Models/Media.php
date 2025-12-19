<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;

    protected $table = 'media';

    protected $fillable = [
        'news_id',
        'media_type',           // 'image', 'video', 'document'
        'file_path',
        'file_size',
        'mime_type',
        'original_filename',
        'position_in_article',  // 'hero', 'body', 'gallery', 'thumbnail'
        'caption',
        'alt_text',
        'is_approved',
        'approved_by_admin_id',
        'approved_at',
        'rejection_reason',
        'uploaded_by_writer_id',
        'uploaded_at',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'uploaded_at' => 'datetime',
        'file_size' => 'integer',
    ];

    protected $appends = ['file_url'];

    // ===== RELATIONS =====
    
    public function news()
    {
        return $this->belongsTo(News::class, 'news_id');
    }

    public function uploadedBy()
    {
        return $this->belongsTo(Writer::class, 'uploaded_by_writer_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(Admin::class, 'approved_by_admin_id');
    }

    // ===== ACCESSORS =====

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    // ===== SCOPES =====

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    public function scopeByType($query, $type)
    {
        if (empty($type)) {
            return $query;
        }

        return $query->where('media_type', $type);
    }

    public function scopeByNews($query, $newsId)
    {
        if (empty($newsId)) {
            return $query;
        }

        return $query->where('news_id', $newsId);
    }

    public function scopeByPosition($query, $position)
    {
        if (empty($position)) {
            return $query;
        }

        return $query->where('position_in_article', $position);
    }

    public function scopeByWriter($query, $writerId)
    {
        if (empty($writerId)) {
            return $query;
        }

        return $query->where('uploaded_by_writer_id', $writerId);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('uploaded_at')->orderByDesc('id');
    }

    // ===== METHODS =====

    /**
     * Get file size formatted (KB, MB, GB)
     */
    public function getFormattedSize(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Check if media is image
     */
    public function isImage(): bool
    {
        return in_array($this->media_type, ['image', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    }

    /**
     * Check if media is video
     */
    public function isVideo(): bool
    {
        return in_array($this->media_type, ['video', 'video/mp4', 'video/webm', 'video/ogg']);
    }

    /**
     * Check if media is document
     */
    public function isDocument(): bool
    {
        return in_array($this->media_type, ['document', 'application/pdf', 'application/msword']);
    }

    // ===== HOOKS =====

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Media $m) {
            if (empty($m->uploaded_at)) {
                $m->uploaded_at = now();
            }
        });

        static::updating(function (Media $m) {
            if ($m->isDirty('is_approved') && $m->is_approved && empty($m->approved_at)) {
                $m->approved_at = now();
            }
        });
    }
}

