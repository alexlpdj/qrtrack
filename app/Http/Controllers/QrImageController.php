<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use BaconQrCode\Encoder\Encoder;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Response;

class QrImageController extends Controller
{
    public function svg(string $code): Response
    {
        $qrCode = QrCode::where('code', $code)->firstOrFail();

        $renderer = new ImageRenderer(
            new RendererStyle(300),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($qrCode->short_url, Encoder::DEFAULT_BYTE_MODE_ENCODING);

        return response($svg, 200)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Cache-Control', 'public, max-age=86400');
    }

    public function download(string $code): Response
    {
        $qrCode = QrCode::where('code', $code)->firstOrFail();

        $renderer = new ImageRenderer(
            new RendererStyle(300),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($qrCode->short_url, Encoder::DEFAULT_BYTE_MODE_ENCODING);

        return response($svg, 200)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Content-Disposition', 'attachment; filename="qr-' . $code . '.svg"');
    }
}
