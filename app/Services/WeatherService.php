<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherService
{
    protected $apiKey;
    protected $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('weather.api_key');
        $this->apiUrl = config('weather.api_url');
    }

    /**
     * Get weather for a destination by city name and country
     */
    public function getWeatherByLocation($city, $country = null)
    {
        // Return demo weather if no API key is configured
        if (!$this->apiKey) {
            return $this->getDemoWeather($city);
        }

        $location = $country ? "$city,$country" : $city;
        $cacheKey = "weather_{$location}";

        // Cache weather for 1 hour
        return Cache::remember($cacheKey, 3600, function () use ($location) {
            try {
                $response = Http::get($this->apiUrl, [
                    'q' => $location,
                    'appid' => $this->apiKey,
                    'units' => 'metric', // Use Celsius
                ]);

                if ($response->successful()) {
                    return $this->formatWeatherData($response->json());
                }

                return $this->getDemoWeather($location);
            } catch (\Exception $e) {
                return $this->getDemoWeather($location);
            }
        });
    }

    /**
     * Get weather by latitude and longitude
     */
    public function getWeatherByCoordinates($latitude, $longitude)
    {
        if (!$this->apiKey) {
            return $this->getDemoWeatherByCoords($latitude, $longitude);
        }

        $cacheKey = "weather_{$latitude}_{$longitude}";

        return Cache::remember($cacheKey, 3600, function () use ($latitude, $longitude) {
            try {
                $response = Http::get($this->apiUrl, [
                    'lat' => $latitude,
                    'lon' => $longitude,
                    'appid' => $this->apiKey,
                    'units' => 'metric',
                ]);

                if ($response->successful()) {
                    return $this->formatWeatherData($response->json());
                }

                return $this->getDemoWeatherByCoords($latitude, $longitude);
            } catch (\Exception $e) {
                return $this->getDemoWeatherByCoords($latitude, $longitude);
            }
        });
    }

    /**
     * Format weather data from API response
     */
    private function formatWeatherData($data)
    {
        return [
            'location' => $data['name'] . ', ' . ($data['sys']['country'] ?? ''),
            'temperature' => round($data['main']['temp']),
            'feels_like' => round($data['main']['feels_like']),
            'temp_min' => round($data['main']['temp_min']),
            'temp_max' => round($data['main']['temp_max']),
            'humidity' => $data['main']['humidity'],
            'pressure' => $data['main']['pressure'],
            'description' => ucfirst($data['weather'][0]['description']),
            'condition' => $data['weather'][0]['main'],
            'icon' => $data['weather'][0]['icon'],
            'wind_speed' => round($data['wind']['speed'], 1),
            'clouds' => $data['clouds']['all'],
            'visibility' => isset($data['visibility']) ? $data['visibility'] / 1000 : 'N/A',
            'is_demo' => false,
        ];
    }

    /**
     * Return demo weather data when API is not available
     */
    private function getDemoWeather($location)
    {
        $weatherConditions = [
            'Sunny',
            'Partly Cloudy',
            'Cloudy',
            'Rainy',
            'Windy',
        ];

        $condition = $weatherConditions[array_rand($weatherConditions)];
        $temp = rand(15, 35);

        return [
            'location' => $location,
            'temperature' => $temp,
            'feels_like' => $temp - 1,
            'temp_min' => $temp - 2,
            'temp_max' => $temp + 2,
            'humidity' => rand(40, 80),
            'pressure' => 1013,
            'description' => $condition,
            'condition' => $condition,
            'icon' => '01d',
            'wind_speed' => rand(5, 20),
            'clouds' => rand(0, 100),
            'visibility' => 10,
            'is_demo' => true,
        ];
    }

    /**
     * Return demo weather by coordinates
     */
    private function getDemoWeatherByCoords($latitude, $longitude)
    {
        return $this->getDemoWeather("Location ({$latitude}, {$longitude})");
    }
}
