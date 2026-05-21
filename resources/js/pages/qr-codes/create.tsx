import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';

interface QrCodeForm {
    name: string;
    destination: string;
    active: boolean;
    expires_at: string;
}

export default function QrCodesCreate() {
    const { data, setData, post, processing, errors } = useForm<QrCodeForm>({
        name: '',
        destination: '',
        active: true,
        expires_at: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.qrCodes.store().url);
    };

    return (
        <>
            <Head title="Nuevo QR" />
            <div className="flex flex-col gap-6 p-6 max-w-lg">
                <h1 className="text-2xl font-bold">Nuevo QR</h1>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
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
                            onChange={(e) => setData('destination', e.target.value)}
                            placeholder="https://..."
                        />
                        <InputError message={errors.destination} />
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
                        <Label htmlFor="expires_at">Fecha de expiración (opcional)</Label>
                        <Input
                            id="expires_at"
                            type="date"
                            value={data.expires_at}
                            onChange={(e) => setData('expires_at', e.target.value)}
                        />
                        <InputError message={errors.expires_at} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            Crear QR
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
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
