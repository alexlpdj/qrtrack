<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QrCode extends Model
{
    protected $fillable = ['user_id', 'code', 'name', 'destination', 'active', 'expires_at'];

    protected $casts = [
        'active' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function clicks(): HasMany
    {
        return $this->hasMany(Click::class);
    }

    /**
     * Usuario propietario del QR.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true)
            ->where(function (Builder $q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Limita la consulta a los QRs que el usuario puede ver: un admin ve
     * todos, un empleado solo los suyos.
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }

    public function getShortUrlAttribute(): string
    {
        return url('go/'.$this->code);
    }

    public function getTotalClicksAttribute(): int
    {
        return $this->clicks()->count();
    }
}
