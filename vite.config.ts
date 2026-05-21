import { existsSync } from 'node:fs';
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

// En el VPS (Plesk) el `php` por defecto de la CLI es una versión antigua
// (8.1/8.2), pero el proyecto requiere PHP >= 8.4. El plugin de wayfinder
// ejecuta `php artisan`, así que anteponemos el PHP 8.4 de Plesk al PATH si
// existe. No afecta a entornos donde esa ruta no esté presente (local, etc).
for (const version of ['8.5', '8.4']) {
    const phpBin = `/opt/plesk/php/${version}/bin`;
    if (existsSync(`${phpBin}/php`) && !process.env.PATH?.startsWith(phpBin)) {
        process.env.PATH = `${phpBin}:${process.env.PATH ?? ''}`;
        break;
    }
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});
