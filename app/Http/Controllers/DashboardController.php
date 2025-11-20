<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        // Demo trips to match the dashboard.tsx expectations
        $demoTrips = [
            [
                'id' => 1,
                'title' => 'Dubai Dreamscape',
                'location' => 'Dubai, United Arab Emirates',
                'price' => '$1,800.00',
                'rating' => 4.5,
                'image' => 'https://images.pexels.com/photos/325193/pexels-photo-325193.jpeg?auto=compress&cs=tinysrgb&w=800',
            ],
            [
                'id' => 2,
                'title' => 'Bali Bliss Retreat',
                'location' => 'Bali, Indonesia',
                'price' => '$3,000.00',
                'rating' => 5,
                'image' => 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=800',
            ],
            [
                'id' => 3,
                'title' => 'Mauritius Marvel',
                'location' => 'Mauritius',
                'price' => '$2,500.00',
                'rating' => 4.5,
                'image' => 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
            ],
        ];
        $breadcrumbs = [
            [
                'title' => 'Dashboard',
                'href' => '/dashboard',
            ],
        ];
        return Inertia::render('dashboard', [
            'demoTrips' => $demoTrips,
            'breadcrumbs' => $breadcrumbs,
        ]);
    }
}
