<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Click;
use App\Models\QrCode;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StatsController extends Controller
{
    public function show(QrCode $qrCode): Response
    {
        $this->authorize('view', $qrCode);

        $clicksByDay = Click::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('qr_code_id', $qrCode->id)
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => ['date' => $row->date, 'count' => $row->count]);

        $clicksByDevice = Click::select('device', DB::raw('COUNT(*) as count'))
            ->where('qr_code_id', $qrCode->id)
            ->whereNotNull('device')
            ->groupBy('device')
            ->get()
            ->map(fn ($row) => ['name' => $row->device, 'value' => $row->count]);

        $clicksByCountry = Click::select('country', DB::raw('COUNT(*) as count'))
            ->where('qr_code_id', $qrCode->id)
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['name' => $row->country, 'value' => $row->count]);

        $clicksByBrowser = Click::select('browser', DB::raw('COUNT(*) as count'))
            ->where('qr_code_id', $qrCode->id)
            ->whereNotNull('browser')
            ->groupBy('browser')
            ->get()
            ->map(fn ($row) => ['name' => $row->browser, 'value' => $row->count]);

        $recentClicks = Click::where('qr_code_id', $qrCode->id)
            ->latest('created_at')
            ->limit(20)
            ->get()
            ->map(fn ($click) => [
                'id' => $click->id,
                'created_at' => $click->created_at?->toISOString(),
                'country' => $click->country,
                'city' => $click->city,
                'device' => $click->device,
                'os' => $click->os,
                'browser' => $click->browser,
                'referer' => $click->referer,
            ]);

        return Inertia::render('stats/show', [
            'qrCode' => [
                'id' => $qrCode->id,
                'code' => $qrCode->code,
                'name' => $qrCode->name,
                'destination' => $qrCode->destination,
            ],
            'clicks_by_day' => $clicksByDay,
            'clicks_by_device' => $clicksByDevice,
            'clicks_by_country' => $clicksByCountry,
            'clicks_by_browser' => $clicksByBrowser,
            'recent_clicks' => $recentClicks,
        ]);
    }
}
