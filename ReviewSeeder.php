<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Destination;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $destinations = Destination::all();
        foreach ($destinations as $destination) {
            $userSample = $users->shuffle()->take(2);
            foreach ($userSample as $user) {
                // Only create if not already exists
                if (!Review::where('user_id', $user->id)->where('destination_id', $destination->id)->exists()) {
                    Review::factory()->create([
                        'user_id' => $user->id,
                        'destination_id' => $destination->id,
                    ]);
                }
            }
        }
    }
}
