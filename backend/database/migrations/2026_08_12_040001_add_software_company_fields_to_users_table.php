<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('position')->default('Software Engineer');
            $table->string('department')->default('Software Engineering');
            $table->string('role')->default('developer'); // admin, lead, developer, qa, hr
            $table->string('phone')->nullable();
            $table->string('status')->default('Active'); // Active, Remote, In Meeting, On Leave
            $table->date('hire_date')->nullable();
            $table->json('skills')->nullable();
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'position',
                'department',
                'role',
                'phone',
                'status',
                'hire_date',
                'skills',
                'avatar',
                'bio'
            ]);
        });
    }
};
