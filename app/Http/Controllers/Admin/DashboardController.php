<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Click;
use App\Models\QrCode;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalQrCodes = QrCode::count();
        $totalClicks = Click::count();
        $clicksToday = Click::whereDate('created_at', today())->count();
        $clicksThisWeek = Click::where('created_at', '>=', now()->startOfWeek())->count();

        $topQrCodes = QrCode::withCount('clicks')
            ->orderByDesc('clicks_count')
            ->limit(5)
            ->get()
            ->map(fn ($qr) => [
                'name' => $qr->name,
                'code' => $qr->code,
                'total_clicks' => $qr->clicks_count,
            ]);

        $clicksLast30Days = Click::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => ['date' => $row->date, 'count' => $row->count]);

        return Inertia::render('dashboard', [
            'total_qr_codes' => $totalQrCodes,
            'total_clicks' => $totalClicks,
            'clicks_today' => $clicksToday,
            'clicks_this_week' => $clicksThisWeek,
            'top_qr_codes' => $topQrCodes,
            'clicks_last_30_days' => $clicksLast30Days,
        ]);
    }
}
