# QR Track

Sistema de **QR dinámicos** con panel de administración. Un QR dinámico significa que el destino es editable sin regenerar el código: el código (aleatorio de 6 caracteres o un slug personalizado) siempre redirige a la URL guardada en base de datos, que puede cambiarse en cualquier momento.

## Características

- Generación de códigos QR en SVG
- Destino editable sin regenerar el QR (redirect `302`)
- Registro de clicks tras la respuesta, sin bloquear la redirección
- Estadísticas: dispositivo, sistema operativo, navegador, país y ciudad
- Geolocalización por IP (la IP nunca se almacena, solo su hash SHA256)
- Panel de administración con dashboard y gráficas
- Caducidad opcional de QRs (`expires_at`)

## Stack

- **Laravel 13** — React 19 + Inertia + TypeScript + Tailwind + shadcn/ui
- **MariaDB** (driver `mysql`, charset `utf8mb4`)
- **Queue driver**: `database`
- **Wayfinder** para rutas tipadas

### Paquetes clave

| Paquete | Uso |
|---|---|
| `bacon/bacon-qr-code` v3 | Generación de QR en SVG |
| `jenssegers/agent` | Detección de dispositivo, OS y navegador |
| `stevebauman/location` | Geolocalización por IP (driver `IpApi`) |
| `recharts` | Gráficas del panel |

## Requisitos

- PHP 8.2+
- Composer
- Node.js 22+
- MariaDB / MySQL

## Instalación

```bash
# 1. Dependencias
composer install
npm install

# 2. Entorno
cp .env.example .env
php artisan key:generate

# 3. Configurar la conexión a la base de datos en .env
#    DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD

# 4. Crear las tablas y datos iniciales
php artisan migrate --seed

# 5. Levantar el entorno de desarrollo
composer run dev
```

`composer run dev` arranca `php artisan serve`, `npm run dev` y `pail` a la vez.

Los clicks se registran con `dispatchAfterResponse()`, así que **no hace falta
ningún worker de colas** ni proceso adicional.

## Acceso por defecto

- **Email:** `admin@admin.com`
- **Password:** `password`

Creado por `AdminUserSeeder` (usa `firstOrCreate`, seguro de re-ejecutar). El registro público está deshabilitado: solo existe el usuario admin.

## Rutas principales

```
GET  /go/{code}                 Redirección pública del QR
GET  /qr/{code}/image           Imagen SVG del QR
GET  /admin                     Dashboard
GET  /admin/qr-codes            Listado de QRs
GET  /admin/qr-codes/{id}/stats Estadísticas de un QR
```

## Base de datos

### `qr_codes`
`id`, `user_id`, `code` (único — aleatorio de 6 o slug personalizado), `name`, `destination`, `active`, `expires_at` (nullable), `timestamps`

### `clicks`
`id`, `qr_code_id` (FK cascade), `country`, `city`, `device`, `os`, `browser`, `referer`, `ip_hash`, `created_at`

## Comandos útiles

```bash
php artisan migrate:fresh --seed   # Recrear la BD desde cero
php artisan wayfinder:generate     # Regenerar rutas tipadas tras cambios en routes/
npm run build                      # Build de producción
```
