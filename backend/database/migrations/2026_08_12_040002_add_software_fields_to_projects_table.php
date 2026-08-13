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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('category')->default('Web App');
            $table->string('status')->default('Active'); // Planning, Active, Review, Completed
            $table->json('tech_stack')->nullable();
            $table->unsignedBigInteger('lead_id')->nullable();
            $table->integer('progress')->default(0);
            $table->date('deadline')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'description',
                'category',
                'status',
                'tech_stack',
                'lead_id',
                'progress',
                'deadline'
            ]);
        });
    }
};
