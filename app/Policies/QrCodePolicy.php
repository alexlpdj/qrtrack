<?php

namespace App\Policies;

use App\Models\QrCode;
use App\Models\User;

class QrCodePolicy
{
    /** Cualquier usuario autenticado puede ver el listado (se filtra por rol). */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /** Cualquier usuario autenticado puede crear QRs. */
    public function create(User $user): bool
    {
        return true;
    }

    /** Un admin accede a cualquier QR; un empleado solo a los suyos. */
    public function view(User $user, QrCode $qrCode): bool
    {
        return $user->isAdmin() || $qrCode->user_id === $user->id;
    }

    public function update(User $user, QrCode $qrCode): bool
    {
        return $this->view($user, $qrCode);
    }

    public function delete(User $user, QrCode $qrCode): bool
    {
        return $this->view($user, $qrCode);
    }
}
