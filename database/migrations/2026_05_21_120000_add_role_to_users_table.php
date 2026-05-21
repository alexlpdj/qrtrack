<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('employee')->after('email');
        });

        // El usuario admin existente conserva permisos de administrador.
        DB::table('users')->where('email', 'admin@admin.com')->update(['role' => 'admin']);

        // Si no quedó ningún admin pero ya había usuarios, se promociona al
        // más antiguo para no dejar la instalación sin administrador.
        $hasAdmin = DB::table('users')->where('role', 'admin')->exists();
        if (! $hasAdmin) {
            $oldestId = DB::table('users')->orderBy('id')->value('id');
            if ($oldestId !== null) {
                DB::table('users')->where('id', $oldestId)->update(['role' => 'admin']);
            }
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
