<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternshipProgram extends Model
{
    protected $table = 'internship_programs';

    protected $fillable = [
        'title',
        'description',
        'duration',
        'allowance',
        'requirements',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
