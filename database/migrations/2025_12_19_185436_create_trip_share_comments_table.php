<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trip_share_comments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('trip_share_link_id')
                ->constrained('trip_share_links')
                ->cascadeOnDelete();

            // optional if someone is logged in
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // guest info
            $table->string('name', 120);
            $table->string('email', 190)->nullable();

            $table->text('body');

            $table->timestamps();

            $table->index(['trip_share_link_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_share_comments');
    }
};
