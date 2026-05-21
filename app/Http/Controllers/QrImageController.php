<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use BaconQrCode\Common\ErrorCorrectionLevel;
use BaconQrCode\Encoder\Encoder;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QrImageController extends Controller
{
    /** Formatos de imagen soportados. */
    private const FORMATS = ['svg', 'png', 'jpg'];

    public function svg(Request $request, string $code): Response
    {
        $qrCode = QrCode::where('code', $code)->firstOrFail();
        $format = $this->resolveFormat($request);
        [$data, $mime] = $this->render($qrCode->short_url, $format);

        return response($data, 200)
            ->header('Content-Type', $mime)
            ->header('Cache-Control', 'public, max-age=86400');
    }

    public function download(Request $request, string $code): Response
    {
        $qrCode = QrCode::where('code', $code)->firstOrFail();
        $format = $this->resolveFormat($request);
        [$data, $mime] = $this->render($qrCode->short_url, $format);

        return response($data, 200)
            ->header('Content-Type', $mime)
            ->header('Content-Disposition', 'attachment; filename="qr-'.$code.'.'.$format.'"');
    }

    /** Lee y valida el formato pedido (?format=svg|png|jpg), por defecto svg. */
    private function resolveFormat(Request $request): string
    {
        $format = strtolower((string) $request->query('format', 'svg'));

        return in_array($format, self::FORMATS, true) ? $format : 'svg';
    }

    /**
     * Genera el QR en el formato indicado.
     *
     * @return array{0: string, 1: string} [contenido binario, content-type]
     */
    private function render(string $content, string $format): array
    {
        if ($format === 'svg') {
            $renderer = new ImageRenderer(new RendererStyle(300), new SvgImageBackEnd());
            $svg = (new Writer($renderer))->writeString($content, Encoder::DEFAULT_BYTE_MODE_ENCODING);

            return [$svg, 'image/svg+xml'];
        }

        $raster = $this->renderRaster($content, $format, 600);

        return [$raster, $format === 'jpg' ? 'image/jpeg' : 'image/png'];
    }

    /**
     * Dibuja el QR como imagen rasterizada (PNG/JPG) con GD a partir de la
     * matriz del encoder de bacon — no requiere la extensión imagick.
     */
    private function renderRaster(string $content, string $format, int $size): string
    {
        $matrix = Encoder::encode($content, ErrorCorrectionLevel::M(), Encoder::DEFAULT_BYTE_MODE_ENCODING)
            ->getMatrix();

        $modules = $matrix->getWidth();
        $margin = 4; // zona de silencio, en módulos
        $moduleSize = max(1, intdiv($size, $modules + 2 * $margin));
        $imageSize = $moduleSize * ($modules + 2 * $margin);

        $image = imagecreatetruecolor($imageSize, $imageSize);
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);
        imagefilledrectangle($image, 0, 0, $imageSize, $imageSize, $white);

        for ($y = 0; $y < $modules; $y++) {
            for ($x = 0; $x < $modules; $x++) {
                if ($matrix->get($x, $y) === 1) {
                    $px = ($x + $margin) * $moduleSize;
                    $py = ($y + $margin) * $moduleSize;
                    imagefilledrectangle(
                        $image,
                        $px,
                        $py,
                        $px + $moduleSize - 1,
                        $py + $moduleSize - 1,
                        $black,
                    );
                }
            }
        }

        ob_start();
        $format === 'jpg' ? imagejpeg($image, null, 92) : imagepng($image);
        $data = (string) ob_get_clean();
        imagedestroy($image);

        return $data;
    }
}
