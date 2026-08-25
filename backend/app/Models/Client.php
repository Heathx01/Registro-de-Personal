<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'city',
        'company_type',
        'tax_id',
        'status',
        'notes',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class, 'client_id');
    }
}
