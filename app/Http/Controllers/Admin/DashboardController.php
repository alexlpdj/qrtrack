<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Click;
use App\Models\QrCode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // Métricas limitadas a los QRs visibles para el usuario: un admin ve
        // las globales, un empleado solo las de sus propios QRs.
        $visibleQrIds = QrCode::visibleTo($request->user())->pluck('id');

        $clicksQuery = fn (): Builder => Click::whereIn('qr_code_id', $visibleQrIds);

        $totalQrCodes = $visibleQrIds->count();
        $totalClicks = $clicksQuery()->count();
        $clicksToday = $clicksQuery()->whereDate('created_at', today())->count();
        $clicksThisWeek = $clicksQuery()->where('created_at', '>=', now()->startOfWeek())->count();

        $topQrCodes = QrCode::visibleTo($request->user())
            ->withCount('clicks')
            ->orderByDesc('clicks_count')
            ->limit(5)
            ->get()
            ->map(fn ($qr) => [
                'name' => $qr->name,
                'code' => $qr->code,
                'total_clicks' => $qr->clicks_count,
            ]);

        $clicksLast30Days = $clicksQuery()
            ->select(
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
