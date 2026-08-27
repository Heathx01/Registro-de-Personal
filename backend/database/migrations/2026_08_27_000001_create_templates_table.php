<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('E-Commerce');
            $table->text('description');
            $table->json('features')->nullable();
            $table->json('tech_stack')->nullable();
            $table->string('estimated_delivery')->default('2 a 4 semanas');
            $table->string('image_url')->nullable();
            $table->string('demo_url')->nullable();
            $table->decimal('suggested_price', 10, 2)->default(0.00);
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
