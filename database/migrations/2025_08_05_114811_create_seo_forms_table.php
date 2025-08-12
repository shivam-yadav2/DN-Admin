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
        Schema::create('seo_forms', function (Blueprint $table) {
            $table->id();
            $table->string('image');
            $table->string('name');
            $table->string('website_url');
            $table->string('email');
            $table->enum('current_traffic', ['Low', 'Medium', 'High']);
            $table->text('message');
            $table->string('button');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_forms');
    }
};
