<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'position',
        'department',
        'role',
        'phone',
        'status',
        'hire_date',
        'skills',
        'avatar',
        'bio',
        'failed_attempts',
        'is_locked',
        'locked_until',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'skills' => 'array',
            'hire_date' => 'date',
            'is_locked' => 'boolean',
            'locked_until' => 'datetime',
        ];
    }

    // --- Métodos de Seguridad de Acceso ---

    public function recordFailedLogin()
    {
        $this->failed_attempts += 1;
        
        if ($this->failed_attempts >= 3) {
            $this->is_locked = true;
            $this->locked_until = Carbon::now()->addMinutes(15);
        }

        $this->save();
        return $this->failed_attempts;
    }

    public function resetLoginAttempts()
    {
        $this->failed_attempts = 0;
        $this->is_locked = false;
        $this->locked_until = null;
        $this->save();
    }

    public function isAccountLocked()
    {
        if (!$this->is_locked) {
            return false;
        }

        if ($this->locked_until && Carbon::now()->greaterThan($this->locked_until)) {
            $this->resetLoginAttempts();
            return false;
        }

        return true;
    }

    public function unlockAccount()
    {
        $this->failed_attempts = 0;
        $this->is_locked = false;
        $this->locked_until = null;
        $this->save();
    }

    // --- Relaciones Eloquent (MVC Model) ---

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    public function ledProjects()
    {
        return $this->hasMany(Project::class, 'lead_id');
    }
}
