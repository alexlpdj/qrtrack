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

        // Se ejecuta después de enviar la respuesta al usuario (sin worker
        // de colas): la redirección no espera a la geolocalización por IP.
        TrackClickJob::dispatchAfterResponse(
            $qrCode->id,
            $request->ip() ?? '0.0.0.0',
            $request->userAgent() ?? '',
            $request->header('referer'),
        );

        return redirect($qrCode->destination, 302);
    }
}
