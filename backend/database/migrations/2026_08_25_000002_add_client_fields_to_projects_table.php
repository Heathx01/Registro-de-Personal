<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('lead_id')->constrained('clients')->nullOnDelete();
            $table->string('project_type')->default('Desarrollo Web')->after('category');
            $table->decimal('budget', 12, 2)->default(0.00)->after('tech_stack');
            $table->string('currency')->default('USD')->after('budget');
            $table->string('billing_status')->default('pending')->after('currency');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropColumn(['client_id', 'project_type', 'budget', 'currency', 'billing_status']);
        });
    }
};
