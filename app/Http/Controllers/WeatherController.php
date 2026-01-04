<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use App\Models\Destination;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    /**
     * Get weather for a destination
     */
    public function getWeather($destinationId)
    {
        $destination = Destination::findOrFail($destinationId);

        // Try to get weather by coordinates first, then by city/country
        if ($destination->latitude && $destination->longitude) {
            $weather = $this->weatherService->getWeatherByCoordinates(
                $destination->latitude,
                $destination->longitude
            );
        } else {
            $weather = $this->weatherService->getWeatherByLocation(
                $destination->city,
                $destination->country
            );
        }

        return response()->json($weather);
    }

    /**
     * Get weather for a trip destination
     */
    public function getTripWeather($tripId)
    {
        $trip = \App\Models\Trip::findOrFail($tripId);
        
        if (!$trip->destination) {
            return response()->json([
                'error' => 'No destination set for this trip'
            ], 400);
        }

        $weather = $this->weatherService->getWeatherByLocation($trip->destination);
        
        return response()->json([
            'weather' => $weather,
            'trip_dates' => [
                'start' => $trip->start_date,
                'end' => $trip->end_date,
            ],
            'destination' => $trip->destination,
        ]);
    }

    /**
     * Get weather by city and country
     */
    public function getWeatherByLocation(Request $request)
    {
        $validated = $request->validate([
            'city' => 'required|string',
            'country' => 'nullable|string',
        ]);

        $weather = $this->weatherService->getWeatherByLocation(
            $validated['city'],
            $validated['country'] ?? null
        );

        return response()->json($weather);
    }
}
