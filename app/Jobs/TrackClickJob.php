<?php

namespace App\Jobs;

use App\Models\Click;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Jenssegers\Agent\Agent;
use Stevebauman\Location\Facades\Location;

class TrackClickJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $qrCodeId,
        public readonly string $ip,
        public readonly string $userAgent,
        public readonly ?string $referer,
    ) {}

    public function handle(): void
    {
        $agent = new Agent();
        $agent->setUserAgent($this->userAgent);

        $device = match (true) {
            $agent->isTablet() => 'tablet',
            $agent->isMobile() => 'mobile',
            default => 'desktop',
        };

        $os = $agent->platform() ?: null;
        $browser = $agent->browser() ?: null;

        $country = null;
        $city = null;

        try {
            $position = Location::get($this->ip);
            if ($position) {
                $country = $position->countryName ?: null;
                $city = $position->cityName ?: null;
            }
        } catch (\Throwable) {
            // Geolocation failure is non-critical
        }

        Click::create([
            'qr_code_id' => $this->qrCodeId,
            'country' => $country,
            'city' => $city,
            'device' => $device,
            'os' => $os,
            'browser' => $browser,
            'referer' => $this->referer,
            'ip_hash' => hash('sha256', $this->ip),
            'created_at' => now(),
        ]);
    }
}
