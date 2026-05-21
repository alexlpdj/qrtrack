<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')
                ->constrained()->nullOnDelete();
        });

        // Los QRs existentes pasan a pertenecer al primer usuario (el admin).
        $ownerId = DB::table('users')->orderBy('id')->value('id');
        if ($ownerId !== null) {
            DB::table('qr_codes')->whereNull('user_id')->update(['user_id' => $ownerId]);
        }
    }

    public function down(): void
    {
        Schema::table('qr_codes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
