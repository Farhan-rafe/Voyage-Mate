<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Dubai Dreamscape',
                'slug' => 'dubai-dreamscape',
                'description' => 'Discover the glamour of Dubai with skyscraper views, desert safaris, and luxurious experiences.',
                'country' => 'United Arab Emirates',
                'city' => 'Dubai',
                'type' => 'city',
                'featured_image' => 'https://images.pexels.com/photos/325193/pexels-photo-325193.jpeg?auto=compress&cs=tinysrgb&w=800',
                'travel_tips' => 'Visit the Burj Khalifa, shop at Dubai Mall, and enjoy a desert safari.',
                'latitude' => 25.2048,
                'longitude' => 55.2708,
            ],
            [
                'name' => 'Bali Bliss Retreat',
                'slug' => 'bali-bliss-retreat',
                'description' => 'Immerse yourself in tropical serenity, terraced rice fields, and Balinese cultural wonders.',
                'country' => 'Indonesia',
                'city' => 'Bali',
                'type' => 'island',
                'featured_image' => 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=800',
                'travel_tips' => 'Explore Ubud, relax on the beaches, and visit ancient temples.',
                'latitude' => -8.3405,
                'longitude' => 115.0920,
            ],
            [
                'name' => 'Mauritius Marvel',
                'slug' => 'mauritius-marvel',
                'description' => 'White-sand beaches, turquoise waters, and romantic sunsets for the ultimate island escape.',
                'country' => 'Mauritius',
                'city' => 'Port Louis',
                'type' => 'island',
                'featured_image' => 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
                'travel_tips' => 'Snorkel in Blue Bay, hike Le Morne, and enjoy local cuisine.',
                'latitude' => -20.3484,
                'longitude' => 57.5522,
            ],
            [
                'name' => 'USA Explorer',
                'slug' => 'usa-explorer',
                'description' => 'From New York skylines to canyon vistas, build the ultimate American road trip.',
                'country' => 'United States',
                'city' => 'New York',
                'type' => 'city',
                'featured_image' => 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
                'travel_tips' => 'See the Statue of Liberty, visit Times Square, and drive Route 66.',
                'latitude' => 40.7128,
                'longitude' => -74.0060,
            ],
            [
                'name' => 'Miami Sun & Sea Escape',
                'slug' => 'miami-sun-sea-escape',
                'description' => 'Vibrant nightlife, Art Deco charm, and beach days soaked in sunshine on Miami Beach.',
                'country' => 'United States',
                'city' => 'Miami',
                'type' => 'beach',
                'featured_image' => 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800',
                'travel_tips' => 'Relax on South Beach, explore Little Havana, and enjoy the nightlife.',
                'latitude' => 25.7617,
                'longitude' => -80.1918,
            ],
            [
                'name' => 'Agra Heritage Journey',
                'slug' => 'agra-heritage-journey',
                'description' => 'Witness the Taj Mahal at dawn and wander through centuries of Mughal architecture.',
                'country' => 'India',
                'city' => 'Agra',
                'type' => 'city',
                'featured_image' => 'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=800',
                'travel_tips' => 'Visit the Taj Mahal, Agra Fort, and Fatehpur Sikri.',
                'latitude' => 27.1767,
                'longitude' => 78.0081,
            ],
        ];
        foreach ($destinations as $data) {
            \App\Models\Destination::updateOrCreate([
                'slug' => $data['slug']
            ], $data);
        }
    }
}
