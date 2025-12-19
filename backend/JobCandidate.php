<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobCandidate extends Model
{
    protected $guarded = ['id'];

    public function jobVacancy()
    {
        return $this->belongsTo(JobVacancy::class);
    }
}