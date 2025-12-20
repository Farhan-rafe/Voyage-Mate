<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trip_journal_entries', function (Blueprint $table) {
            $table->id();

            $table->foreignId('trip_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->date('entry_date')->nullable(); // date of experience
            $table->string('title', 160)->nullable();
            $table->text('body'); // main journal text

            $table->timestamps();

            $table->index(['trip_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_journal_entries');
    }
};
