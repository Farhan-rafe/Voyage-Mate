<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            // Best time to visit
            $table->string('best_time_to_visit')->nullable()->after('travel_tips');
            
            // How to Reach
            $table->string('nearest_airport')->nullable()->after('best_time_to_visit');
            $table->text('local_transport')->nullable()->after('nearest_airport');
            
            // Must See Attractions
            $table->text('must_see_attractions')->nullable()->after('local_transport');
            
            // Safety & Travel Tips
            $table->text('safety_tips')->nullable()->after('must_see_attractions');
            
            // History or Culture Info
            $table->text('history_culture')->nullable()->after('safety_tips');
            
            // Entry Fees
            $table->string('entry_fees')->nullable()->after('history_culture');
            
            // Photo Gallery (3 images)
            $table->string('photo_gallery_1')->nullable()->after('entry_fees');
            $table->string('photo_gallery_2')->nullable()->after('photo_gallery_1');
            $table->string('photo_gallery_3')->nullable()->after('photo_gallery_2');
        });
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn([
                'best_time_to_visit',
                'nearest_airport',
                'local_transport',
                'must_see_attractions',
                'safety_tips',
                'history_culture',
                'entry_fees',
                'photo_gallery_1',
                'photo_gallery_2',
                'photo_gallery_3',
            ]);
        });
    }
};
