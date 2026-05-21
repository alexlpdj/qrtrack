# QR Track — Contexto del proyecto

Sistema de QR dinámicos con panel de administración. Un QR "dinámico" significa que el destino es editable sin regenerar el código: el código corto (6 chars) siempre redirige a la URL guardada en BD, que se puede cambiar en cualquier momento.

## Stack

- **Laravel 13** con starter kit oficial de React (React 19 + Inertia + TypeScript + Tailwind + shadcn/ui)
- **MariaDB** — driver `mysql` en `config/database.php`, charset `utf8mb4 / utf8mb4_unicode_ci`
- **Registro de clicks**: `TrackClickJob` despachado con `dispatchAfterResponse()` — se ejecuta tras enviar la respuesta al usuario, sin worker de colas
- **Rutas tipadas**: Wayfinder (`php artisan wayfinder:generate`) — regenerar cuando cambien rutas

## Paquetes clave

| Paquete | Uso |
|---|---|
| `bacon/bacon-qr-code` v3 | Generación de QR en SVG (instalado vía Fortify, sin wrapper) |
| `jenssegers/agent` | Detección de dispositivo, OS y browser desde User-Agent |
| `stevebauman/location` | Geolocalización por IP — driver `IpApi` (sin API key) |
| `recharts` | Gráficas en el panel (Line, Area, Pie) |

## Base de datos

### `qr_codes`
`id`, `code` (6 chars único), `name`, `destination` (URL editable), `active` (bool), `expires_at` (nullable), `timestamps`

### `clicks`
`id`, `qr_code_id` (FK cascade), `country`, `city`, `device` (mobile/tablet/desktop), `os`, `browser`, `referer`, `ip_hash` (SHA256, nunca IP en crudo), `created_at`

## Estructura de rutas

```
GET  /                          → welcome (pública)
GET  /{code}                    → RedirectController@redirect (pública, regex [a-zA-Z0-9]{6})
GET  /qr/{code}/image           → QrImageController@svg (pública)
GET  /qr/{code}/download        → QrImageController@download (auth)

GET  /admin                     → Admin\DashboardController@index
GET  /admin/qr-codes            → Admin\QrCodeController@index
GET  /admin/qr-codes/create     → Admin\QrCodeController@create
POST /admin/qr-codes            → Admin\QrCodeController@store
GET  /admin/qr-codes/{qr_code}  → Admin\QrCodeController@show
GET  /admin/qr-codes/{qr_code}/edit   → Admin\QrCodeController@edit
PUT  /admin/qr-codes/{qr_code}        → Admin\QrCodeController@update
DEL  /admin/qr-codes/{qr_code}        → Admin\QrCodeController@destroy
GET  /admin/qr-codes/{qrCode}/stats   → Admin\StatsController@show
```

## Páginas React (`resources/js/pages/`)

- `dashboard.tsx` — métricas globales + LineChart 30 días + top 5 QRs
- `qr-codes/index.tsx` — tabla paginada con AlertDialog de borrado
- `qr-codes/create.tsx` — formulario nuevo QR (code generado en backend)
- `qr-codes/edit.tsx` — edita name, destination, active, expires_at
- `qr-codes/show.tsx` — imagen SVG + copiar URL + descargar + stats básicas
- `stats/show.tsx` — AreaChart + 3 PieCharts (device/país/browser) + tabla clicks recientes

El layout por defecto (sidebar con Dashboard y Mis QRs) se aplica a todas las páginas salvo `welcome` y las de `auth/`. Los breadcrumbs se pasan como `Component.layout = { breadcrumbs: [...] }`.

## Flujo de un escaneo

1. Usuario escanea → `GET /{code}`
2. `RedirectController` busca el QR activo, despacha `TrackClickJob` con `dispatchAfterResponse()` y devuelve `302` al destino
3. Tras enviar la respuesta, el job resuelve IP → país/ciudad, User-Agent → device/OS/browser, guarda en `clicks` (la redirección no espera a la geolocalización)

## Comandos frecuentes

```bash
# Levantar todo en desarrollo
composer run dev          # php artisan serve + npm run dev + pail


# Regenerar rutas tipadas tras cambios en web.php
php artisan wayfinder:generate

# Migraciones frescas con seeder
php artisan migrate:fresh --seed

# Build de producción
npm run build
```

## Credenciales del admin por defecto

- Email: `admin@admin.com`
- Password: `password`
- Seeder: `AdminUserSeeder` (usa `firstOrCreate`, seguro de re-ejecutar)

## Decisiones de diseño relevantes

- **Registro público deshabilitado** en `config/fortify.php` — solo existe el usuario admin
- **`bacon/bacon-qr-code` usado directamente** (sin el wrapper `simplesoftwareio/simple-qrcode`) porque Fortify requiere v3 y el wrapper solo soporta v2
- **IP nunca se almacena** — solo el hash SHA256 para privacidad
- **`expires_at` nullable** — si es null, el QR no caduca nunca
- El redirect es `302` (no `301`) para que los proxies no cacheen el destino, permitiendo que sea dinámico
