<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Weather API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for OpenWeatherMap API
    |
    */

    'api_key' => env('OPENWEATHER_API_KEY', ''),
    'api_url' => env('OPENWEATHER_API_URL', 'https://api.openweathermap.org/data/2.5/weather'),
];
