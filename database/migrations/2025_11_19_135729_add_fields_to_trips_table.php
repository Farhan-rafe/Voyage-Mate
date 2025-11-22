<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            if (! Schema::hasColumn('trips', 'description')) {
                $table->text('description')->nullable();
            }

            if (! Schema::hasColumn('trips', 'budget')) {
                $table->decimal('budget', 10, 2)->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            if (Schema::hasColumn('trips', 'description')) {
                $table->dropColumn('description');
            }

            if (Schema::hasColumn('trips', 'budget')) {
                $table->dropColumn('budget');
            }
        });
    }
};
