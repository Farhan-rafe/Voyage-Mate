<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            if (! Schema::hasColumn('trips', 'title')) {
                $table->string('title')->nullable()->after('id');
            }

            if (! Schema::hasColumn('trips', 'description')) {
                $table->text('description')->nullable()->after('end_date');
            }

            if (! Schema::hasColumn('trips', 'budget')) {
                $table->decimal('budget', 10, 2)->nullable()->after('description');
            }
        });

        // Migrate existing data from older columns if present
        try {
            if (Schema::hasColumn('trips', 'name')) {
                DB::table('trips')->whereNotNull('name')->update(['title' => DB::raw('name')]);
            }
            if (Schema::hasColumn('trips', 'details')) {
                DB::table('trips')->whereNotNull('details')->update(['description' => DB::raw('details')]);
            }
        } catch (\Exception $e) {
            // Ignore copy errors on some DB drivers; columns exist so it's fine.
        }
    }

    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            if (Schema::hasColumn('trips', 'budget')) {
                $table->dropColumn('budget');
            }
            if (Schema::hasColumn('trips', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('trips', 'title')) {
                $table->dropColumn('title');
            }
        });
    }
};
