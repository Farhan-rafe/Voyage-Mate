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
        Schema::create('transports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // e.g., 'Flight', 'Train', 'Bus', 'Car Rental', 'Taxi'
            $table->string('provider')->nullable(); // e.g., 'Airline', 'Train Company'
            $table->string('from_location');
            $table->string('to_location');
            $table->dateTime('departure_time');
            $table->dateTime('arrival_time')->nullable();
            $table->decimal('duration_hours', 8, 2)->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->string('booking_reference')->nullable();
            $table->string('confirmation_number')->nullable();
            $table->integer('seats')->nullable(); // Number of seats for group transport
            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, in-progress, completed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transports');
    }
};
