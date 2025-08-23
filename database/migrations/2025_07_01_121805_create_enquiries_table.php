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
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');                                                 // Name of the person making the enquiry
            $table->string('email');                                               // Email address of the person making the enquiry
            $table->string('number');                                             // Phone number of the person making the enquiry
            $table->string('city');                                              // City of the enquiry
            $table->foreignId('service_id')->constrained('services');            // Service of the enquiry
            $table->foreignId('subservice_id')->constrained('subservices');                   // SubService content of the enquiry
            $table->string('message')->nullable();          // Message content of the enquiry
            $table->boolean('isDeleted')->default(false); 
           
             // Soft delete flag, default is 'false' (not deleted)
            $table->enum('status',['new_lead','contacted','converted','lost'])->default('new_lead');                    // Status of the enquiry, default is false (not processed)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
