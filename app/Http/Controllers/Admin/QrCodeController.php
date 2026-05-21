<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class QrCodeController extends Controller
{
    public function index(): Response
    {
        $qrCodes = QrCode::withCount('clicks')
            ->latest()
            ->paginate(15)
            ->through(fn ($qr) => [
                'id' => $qr->id,
                'code' => $qr->code,
                'name' => $qr->name,
                'destination' => $qr->destination,
                'active' => $qr->active,
                'expires_at' => $qr->expires_at?->toISOString(),
                'total_clicks' => $qr->clicks_count,
                'short_url' => $qr->short_url,
                'created_at' => $qr->created_at->toISOString(),
            ]);

        return Inertia::render('qr-codes/index', [
            'qrCodes' => $qrCodes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('qr-codes/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'destination' => 'required|url|max:2048',
            'active' => 'boolean',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $validated['code'] = $this->generateUniqueCode();
        $validated['active'] = $validated['active'] ?? true;

        QrCode::create($validated);

        return redirect()->route('admin.qr-codes.index')
            ->with('success', 'QR creado correctamente.');
    }

    public function show(QrCode $qrCode): Response
    {
        return Inertia::render('qr-codes/show', [
            'qrCode' => [
                'id' => $qrCode->id,
                'code' => $qrCode->code,
                'name' => $qrCode->name,
                'destination' => $qrCode->destination,
                'active' => $qrCode->active,
                'expires_at' => $qrCode->expires_at?->toISOString(),
                'short_url' => $qrCode->short_url,
                'total_clicks' => $qrCode->total_clicks,
                'clicks_today' => $qrCode->clicks()->whereDate('created_at', today())->count(),
            ],
        ]);
    }

    public function edit(QrCode $qrCode): Response
    {
        return Inertia::render('qr-codes/edit', [
            'qrCode' => [
                'id' => $qrCode->id,
                'code' => $qrCode->code,
                'name' => $qrCode->name,
                'destination' => $qrCode->destination,
                'active' => $qrCode->active,
                'expires_at' => $qrCode->expires_at?->format('Y-m-d'),
            ],
        ]);
    }

    public function update(Request $request, QrCode $qrCode): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'destination' => 'required|url|max:2048',
            'active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $qrCode->update($validated);

        return redirect()->route('admin.qr-codes.index')
            ->with('success', 'QR actualizado correctamente.');
    }

    public function destroy(QrCode $qrCode): RedirectResponse
    {
        $qrCode->delete();

        return redirect()->route('admin.qr-codes.index')
            ->with('success', 'QR eliminado correctamente.');
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = Str::random(6);
        } while (QrCode::where('code', $code)->exists());

        return $code;
    }
}
