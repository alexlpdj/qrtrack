import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';

interface QrCodeForm {
    name: string;
    destination: string;
    code: string;
    active: boolean;
    expires_at: string;
}

/** Convierte un texto en un slug limpio: "Menú La Tasca" → "menu-la-tasca". */
function slugify(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function QrCodesCreate() {
    const { data, setData, post, processing, errors } = useForm<QrCodeForm>({
        name: '',
        destination: '',
        code: '',
        active: true,
        expires_at: '',
    });
    // Mientras el usuario no toque el identificador, se sincroniza con el nombre.
    const [codeTouched, setCodeTouched] = useState(false);

    const onNameChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            name: value,
            code: codeTouched ? prev.code : slugify(value),
        }));
    };

    const onCodeChange = (value: string) => {
        setCodeTouched(true);
        setData('code', value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.qrCodes.store().url);
    };

    return (
        <>
            <Head title="Nuevo QR" />
            <div className="flex max-w-lg flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Nuevo QR</h1>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            placeholder="Ej: Menú restaurante"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="destination">URL de destino</Label>
                        <Input
                            id="destination"
                            type="url"
                            value={data.destination}
                            onChange={(e) =>
                                setData('destination', e.target.value)
                            }
                            placeholder="https://..."
                        />
                        <InputError message={errors.destination} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="code">
                            Identificador{' '}
                            <span className="text-muted-foreground">
                                (opcional)
                            </span>
                        </Label>
                        <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                            <span className="pl-3 text-sm text-muted-foreground select-none">
                                /go/
                            </span>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => onCodeChange(e.target.value)}
                                placeholder="codigo-aleatorio"
                                className="border-0 pl-1 shadow-none focus-visible:ring-0"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Parte final de la URL del QR. Déjalo vacío para un
                            código aleatorio. Solo minúsculas, números y
                            guiones. No se podrá cambiar después.
                        </p>
                        <InputError message={errors.code} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="active"
                            checked={data.active}
                            onCheckedChange={(v) => setData('active', v)}
                        />
                        <Label htmlFor="active">Activo</Label>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="expires_at">
                            Fecha de expiración (opcional)
                        </Label>
                        <Input
                            id="expires_at"
                            type="date"
                            value={data.expires_at}
                            onChange={(e) =>
                                setData('expires_at', e.target.value)
                            }
                        />
                        <InputError message={errors.expires_at} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            Crear QR
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => history.back()}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

QrCodesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Mis QRs', href: admin.qrCodes.index().url },
        { title: 'Nuevo QR', href: admin.qrCodes.create().url },
    ],
};
