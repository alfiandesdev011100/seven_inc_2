<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    use HasFactory;

    protected $fillable = [
        'heading',
        'title',
        'subtitle',
        'hero',
        'job_position',
        'career_growth_description'
    ];
}