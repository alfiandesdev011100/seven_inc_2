<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContentAssignment extends Model
{
    use SoftDeletes;

    protected $table = 'content_assignments';

    protected $fillable = [
        'news_id',
        'assigned_by_admin_id',
        'assigned_to_writer_id',
        'required_page',            // berita, tentang-kami, bisnis-kami, karir
        'required_section',         // hero, featured, body, sidebar, carousel, footer
        'required_menu',            // main-list, featured-slider, sidebar-admin
        'position_order',           // 1, 2, 3 (position order on page)
        'instruction',              // detailed task instructions
        'context_reference',        // reference to what admin wants (e.g., "update company values on about page")
        'status',                   // pending, acknowledged, in_progress, submitted, completed
        'due_date',
        'acknowledged_at',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'acknowledged_at' => 'datetime',
        'completed_at' => 'datetime',
        'position_order' => 'integer',
    ];

    // ===== RELATIONS =====

    public function news()
    {
        return $this->belongsTo(News::class, 'news_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(Admin::class, 'assigned_by_admin_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(Writer::class, 'assigned_to_writer_id');
    }

    // ===== SCOPES =====

    public function scopeByAdmin($query, $adminId)
    {
        if (empty($adminId)) {
            return $query;
        }

        return $query->where('assigned_by_admin_id', $adminId);
    }

    public function scopeByWriter($query, $writerId)
    {
        if (empty($writerId)) {
            return $query;
        }

        return $query->where('assigned_to_writer_id', $writerId);
    }

    public function scopeByStatus($query, $status)
    {
        if (empty($status)) {
            return $query;
        }

        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAcknowledged($query)
    {
        return $query->where('status', 'acknowledged');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'acknowledged', 'in_progress', 'submitted']);
    }

    public function scopeByPage($query, $page)
    {
        if (empty($page)) {
            return $query;
        }

        return $query->where('required_page', $page);
    }

    public function scopeBySection($query, $section)
    {
        if (empty($section)) {
            return $query;
        }

        return $query->where('required_section', $section);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->whereNotIn('status', ['completed']);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }

    public function scopeDueOrderd($query)
    {
        return $query->orderBy('due_date', 'asc')->orderBy('created_at', 'desc');
    }

    // ===== METHODS =====

    /**
     * Check if assignment is overdue
     */
    public function isOverdue(): bool
    {
        return $this->due_date && $this->due_date < now() && !$this->isCompleted();
    }

    /**
     * Check if assignment is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if assignment is active (not completed)
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['pending', 'acknowledged', 'in_progress', 'submitted']);
    }

    /**
     * Get status display label
     */
    public function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'Menunggu Konfirmasi',
            'acknowledged' => 'Dikonfirmasi',
            'in_progress' => 'Sedang Dikerjakan',
            'submitted' => 'Menunggu Review',
            'completed' => 'Selesai',
            default => $this->status,
        };
    }

    /**
     * Get position description
     */
    public function getPositionDescription(): string
    {
        $parts = [];
        
        if ($this->required_page) {
            $parts[] = 'Halaman: ' . $this->required_page;
        }
        
        if ($this->required_section) {
            $parts[] = 'Bagian: ' . $this->required_section;
        }
        
        if ($this->required_menu) {
            $parts[] = 'Menu: ' . $this->required_menu;
        }
        
        if ($this->position_order) {
            $parts[] = 'Posisi #' . $this->position_order;
        }
        
        return implode(' | ', $parts);
    }

    // ===== HOOKS =====

    protected static function boot()
    {
        parent::boot();

        static::creating(function (ContentAssignment $m) {
            // set default status to pending if not set
            if (empty($m->status)) {
                $m->status = 'pending';
            }
        });

        static::updating(function (ContentAssignment $m) {
            // auto set acknowledged_at when acknowledged
            if ($m->isDirty('status') && $m->status === 'acknowledged' && empty($m->acknowledged_at)) {
                $m->acknowledged_at = now();
            }

            // auto set completed_at when completed
            if ($m->isDirty('status') && $m->status === 'completed' && empty($m->completed_at)) {
                $m->completed_at = now();
            }
        });
    }
}
