import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';

interface QrCodeData {
    id: number;
    code: string;
    name: string;
    destination: string;
    active: boolean;
    expires_at: string | null;
}

interface Props {
    qrCode: QrCodeData;
}

interface QrCodeForm {
    name: string;
    destination: string;
    active: boolean;
    expires_at: string;
}

export default function QrCodesEdit({ qrCode }: Props) {
    const { data, setData, put, processing, errors } = useForm<QrCodeForm>({
        name: qrCode.name,
        destination: qrCode.destination,
        active: qrCode.active,
        expires_at: qrCode.expires_at ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.qrCodes.update({ qr_code: qrCode.id }).url);
    };

    return (
        <>
            <Head title={`Editar QR: ${qrCode.name}`} />
            <div className="flex flex-col gap-6 p-6 max-w-lg">
                <div>
                    <h1 className="text-2xl font-bold">Editar QR</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Código: <span className="font-mono">{qrCode.code}</span>
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
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
                            Guardar cambios
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

QrCodesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Mis QRs', href: admin.qrCodes.index().url },
        { title: 'Editar QR' },
    ],
};
