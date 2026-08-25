<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title_es',
        'title_en',
        'description',
        'description_es',
        'description_en',
        'category',
        'status',
        'tech_stack',
        'lead_id',
        'client_id',
        'project_type',
        'budget',
        'currency',
        'billing_status',
        'progress',
        'deadline',
        'image',
        'url'
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'progress' => 'integer',
        'budget' => 'float',
        'deadline' => 'date',
    ];

    public function lead()
    {
        return $this->belongsTo(User::class, 'lead_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
    }
}
