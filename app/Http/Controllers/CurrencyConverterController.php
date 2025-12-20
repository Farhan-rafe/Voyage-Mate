<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CurrencyConverterController extends Controller
{
    public function convert(Request $request)
    {
        $data = $request->validate([
            'from' => 'required|string|size:3',
            'to' => 'required|string|size:3',
            'amount' => 'required|numeric|min:0',
        ]);

        $from = strtoupper($data['from']);
        $to = strtoupper($data['to']);
        $amount = (float) $data['amount'];

        if ($from === $to) {
            return response()->json([
                'result' => $amount,
                'rate' => 1,
            ]);
        }

        // ✅ No-key API with many currencies (BDT supported)
        $res = Http::get("https://open.er-api.com/v6/latest/{$from}");

        if (!$res->successful()) {
            return response()->json(['error' => 'Conversion failed (rate API unavailable)'], 500);
        }

        $json = $res->json();

        // API returns result: "success" / "error"
        if (($json['result'] ?? null) !== 'success') {
            return response()->json(['error' => 'Conversion failed (unsupported base currency)'], 422);
        }

        $rates = $json['rates'] ?? [];
        $rate = $rates[$to] ?? null;

        if (!$rate) {
            return response()->json(['error' => 'Conversion failed (unsupported target currency)'], 422);
        }

        return response()->json([
            'result' => $amount * (float) $rate,
            'rate' => (float) $rate,
        ]);
    }
}
