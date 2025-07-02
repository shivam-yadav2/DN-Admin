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
        Schema::table('services', function (Blueprint $table) {
            //
            // Add is_deleted column to services_and_subservices table
            $table->boolean('is_deleted')->default(false)->after('image'); 
        });

        Schema::table('subservices', function (Blueprint $table) {
            // Add is_deleted column to subservices table
            $table->boolean('is_deleted')->default(false)->after('image');  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            //
            $table->dropColumn('is_deleted');
        });

        Schema::table('subservices', function (Blueprint $table) {
            // Remove is_deleted column from subservices table
            $table->dropColumn('is_deleted');
        });
    }
};
