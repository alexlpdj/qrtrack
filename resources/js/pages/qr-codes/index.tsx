import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Download, Pencil, Plus, Trash2, BarChart2 } from 'lucide-react';
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

    // Evita que el clic en un botón de acción dispare la navegación de la fila.
    const stop = (e: React.MouseEvent) => e.stopPropagation();

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

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Código
                                </th>
                                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                                    Destino
                                </th>
                                <th className="px-4 py-3 text-center font-medium">
                                    Clicks
                                </th>
                                <th className="px-4 py-3 text-center font-medium">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {qrCodes.data.map((qr) => (
                                <tr
                                    key={qr.id}
                                    onClick={() =>
                                        router.visit(
                                            admin.qrCodes.show({
                                                qr_code: qr.id,
                                            }).url,
                                        )
                                    }
                                    className="cursor-pointer border-t transition-colors hover:bg-muted/40"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {qr.name}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">
                                        {qr.code}
                                    </td>
                                    <td className="hidden max-w-xs px-4 py-3 md:table-cell">
                                        <span
                                            className="block truncate text-muted-foreground"
                                            title={qr.destination}
                                        >
                                            {qr.destination}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold">
                                        {qr.total_clicks}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge
                                            variant={
                                                qr.active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {qr.active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div
                                            className="flex items-center justify-end gap-1"
                                            onClick={stop}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                title="Descargar QR (PNG)"
                                            >
                                                <a
                                                    href={`/qr/${qr.code}/download?format=png`}
                                                    download
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                title="Estadísticas"
                                            >
                                                <Link
                                                    href={
                                                        admin.qrCodes.stats({
                                                            qrCode: qr.id,
                                                        }).url
                                                    }
                                                >
                                                    <BarChart2 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                title="Editar"
                                            >
                                                <Link
                                                    href={
                                                        admin.qrCodes.edit({
                                                            qr_code: qr.id,
                                                        }).url
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Eliminar"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    setDeleteId(qr.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {qrCodes.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No hay QRs creados todavía.{' '}
                                        <Link
                                            href={admin.qrCodes.create().url}
                                            className="underline"
                                        >
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
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar este QR?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminarán también todos los clicks
                            registrados. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
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
