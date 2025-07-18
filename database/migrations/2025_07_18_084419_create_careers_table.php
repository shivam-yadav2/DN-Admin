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
        Schema::create('careers', function (Blueprint $table) {
            $table->id();
            $table->string('desig');
            $table->string('title');
            $table->string('city')->default('lucknow');
            $table->enum('job_type', ['full-time' , 'part-time'])->default('part-time');
            $table->enum('work_mode',['remote', 'onsite' , 'hybrid'])->default('onsite');
            $table->text('about_role');
            $table->json('responsibilities');
            $table->json('requirements');
            $table->json('benefits_perks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('careers');
    }
};
