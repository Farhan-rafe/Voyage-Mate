<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trip_share_links', function (Blueprint $table) {
            $table->id();

            $table->foreignId('trip_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();

            $table->string('token', 80)->unique(); // long random token for sharing
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();

            $table->timestamps();

            $table->index(['trip_id', 'revoked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_share_links');
    }
};
