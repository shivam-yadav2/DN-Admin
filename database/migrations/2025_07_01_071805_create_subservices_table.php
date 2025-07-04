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
        Schema::create('subservices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_id');   // Foreign key to services table
            $table->string('name');
            $table->text('description');
            $table->string('image');
            $table->timestamps();

             $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subservices');
    }
};
