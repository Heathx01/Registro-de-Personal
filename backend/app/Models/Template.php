<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'description',
        'features',
        'tech_stack',
        'estimated_delivery',
        'image_url',
        'demo_url',
        'suggested_price',
        'status',
    ];

    protected $casts = [
        'features' => 'array',
        'tech_stack' => 'array',
        'suggested_price' => 'decimal:2',
    ];
}
