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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('meta_key');
            $table->string('meta_desc');
            $table->string('title');
            $table->string('url');
            $table->json('keyword')->comment('hashtags');
            $table->string('description');
            $table->string('author');
            $table->date('published');
            $table->string('card_img');
            $table->string('banner_img');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
