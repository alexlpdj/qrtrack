<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // El código deja de ser fijo de 6 chars para admitir slugs
        // personalizados (p. ej. "menu-la-tasca").
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->string('code', 64)->change();
        });
    }

    public function down(): void
    {
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->string('code', 6)->change();
        });
    }
};
