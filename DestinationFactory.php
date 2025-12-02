<?php

namespace Database\Factories;

use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;

class DestinationFactory extends Factory
{
    protected $model = Destination::class;

    public function definition(): array
    {
        $types = ['beach', 'mountain', 'city', 'island', 'desert'];
        return [
            'name' => $this->faker->city(),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->paragraph(3),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'type' => $this->faker->randomElement($types),
            'featured_image' => $this->faker->imageUrl(640, 480, 'travel', true),
            'travel_tips' => $this->faker->sentence(8),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
        ];
    }
}
