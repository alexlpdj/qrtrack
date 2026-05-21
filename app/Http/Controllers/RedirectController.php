<?php

namespace App\Http\Controllers;

use App\Jobs\TrackClickJob;
use App\Models\QrCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RedirectController extends Controller
{
    public function redirect(Request $request, string $code): RedirectResponse
    {
        $qrCode = QrCode::where('code', $code)->active()->firstOrFail();

        TrackClickJob::dispatch(
            $qrCode->id,
            $request->ip() ?? '0.0.0.0',
            $request->userAgent() ?? '',
            $request->header('referer'),
        );

        return redirect($qrCode->destination, 302);
    }
}
