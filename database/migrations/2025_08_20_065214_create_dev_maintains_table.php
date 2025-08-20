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
        Schema::create('dev_maintains', function (Blueprint $table) {
            $table->id();
             $table->string('icon');
            $table->string('heading');
            $table->text('description');
            $table->string('priority');
            $table->string('availability');
            $table->json('features');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dev_maintains');
    }
};
