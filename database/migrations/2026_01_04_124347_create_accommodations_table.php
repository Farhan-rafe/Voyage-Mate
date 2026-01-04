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
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // e.g., 'Hotel', 'Hostel', 'Airbnb', 'Resort'
            $table->string('location');
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->decimal('price_per_night', 10, 2)->nullable();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('number_of_nights')->default(1);
            $table->integer('rating')->nullable(); // 1-5 star rating
            $table->text('amenities')->nullable(); // JSON field for amenities
            $table->string('booking_reference')->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, cancelled
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
