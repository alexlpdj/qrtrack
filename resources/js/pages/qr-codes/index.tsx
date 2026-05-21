import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Plus, Trash2, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import admin from '@/routes/admin';

interface QrCodeItem {
    id: number;
    code: string;
    name: string;
    destination: string;
    active: boolean;
    expires_at: string | null;
    total_clicks: number;
    short_url: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedQrCodes {
    data: QrCodeItem[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    qrCodes: PaginatedQrCodes;
}

export default function QrCodesIndex({ qrCodes }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId === null) return;
        router.delete(admin.qrCodes.destroy({ qrCode: deleteId }).url, {
            onFinish: () => setDeleteId(null),
        });
    };

    return (
        <>
            <Head title="Mis QRs" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mis QRs</h1>
                    <Button asChild>
                        <Link href={admin.qrCodes.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo QR
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                                <th className="px-4 py-3 text-left font-medium">Código</th>
                                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Destino</th>
                                <th className="px-4 py-3 text-center font-medium">Clicks</th>
                                <th className="px-4 py-3 text-center font-medium">Activo</th>
                                <th className="px-4 py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qrCodes.data.map((qr) => (
                                <tr key={qr.id} className="border-t hover:bg-muted/20">
                                    <td className="px-4 py-3 font-medium">{qr.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{qr.code}</td>
                                    <td className="px-4 py-3 hidden md:table-cell max-w-xs">
                                        <span className="truncate block text-muted-foreground" title={qr.destination}>
                                            {qr.destination.length > 50
                                                ? qr.destination.slice(0, 50) + '…'
                                                : qr.destination}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold">
                                        {qr.total_clicks}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant={qr.active ? 'default' : 'secondary'}>
                                            {qr.active ? 'Sí' : 'No'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild title="Ver detalle">
                                                <Link href={admin.qrCodes.show({ qr_code: qr.id }).url}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild title="Estadísticas">
                                                <Link href={admin.qrCodes.stats({ qrCode: qr.id }).url}>
                                                    <BarChart2 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild title="Editar">
                                                <Link href={admin.qrCodes.edit({ qr_code: qr.id }).url}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Eliminar"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteId(qr.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {qrCodes.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No hay QRs creados todavía.{' '}
                                        <Link href={admin.qrCodes.create().url} className="underline">
                                            Crea el primero
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {qrCodes.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {qrCodes.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este QR?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminarán también todos los clicks registrados. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

QrCodesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Mis QRs', href: admin.qrCodes.index().url },
    ],
};
