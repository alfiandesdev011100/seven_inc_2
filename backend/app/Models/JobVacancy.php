<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    protected $guarded = ['id'];

    public function candidates()
    {
        return $this->hasMany(JobCandidate::class)->orderBy('final_score', 'desc');
    }
}