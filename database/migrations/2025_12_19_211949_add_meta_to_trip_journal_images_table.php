<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('trip_journal_images', function (Blueprint $table) {
            $table->integer('position')->default(0)->after('path');
            $table->string('original_name')->nullable()->after('position');
        });
    }

    public function down(): void
    {
        Schema::table('trip_journal_images', function (Blueprint $table) {
            $table->dropColumn(['position', 'original_name']);
        });
    }
};
