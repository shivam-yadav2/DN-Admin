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
        Schema::create('vision_mission', function (Blueprint $table) {
            $table->id();
            $table->string('heading');
            $table->string(column: 'para');
            $table->string('vision_heading');
            $table->string('vision_description');
            $table->string('mission_heading');
            $table->string('mission_description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vision_mission');
    }
};
