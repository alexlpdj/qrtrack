import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart2,
    Check,
    ChevronDown,
    Copy,
    Download,
    ExternalLink,
    Pencil,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import admin from '@/routes/admin';

const DOWNLOAD_FORMATS = [
    { format: 'png', label: 'PNG' },
    { format: 'jpg', label: 'JPG' },
    { format: 'svg', label: 'SVG' },
] as const;

interface QrCodeDetail {
    id: number;
    code: string;
    name: string;
    destination: string;
    active: boolean;
    expires_at: string | null;
    short_url: string;
    total_clicks: number;
    clicks_today: number;
}

interface Props {
    qrCode: QrCodeDetail;
}

function InfoRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="min-w-0 text-right text-sm font-medium">
                {children}
            </div>
        </div>
    );
}

export default function QrCodesShow({ qrCode }: Props) {
    const [copied, setCopied] = useState(false);

    const copyUrl = () => {
        navigator.clipboard.writeText(qrCode.short_url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const svgUrl = `/qr/${qrCode.code}/image`;
    const downloadUrl = (format: string) =>
        `/qr/${qrCode.code}/download?format=${format}`;

    return (
        <>
            <Head title={`QR: ${qrCode.name}`} />
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
                {/* Cabecera */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="truncate text-2xl font-bold">
                                {qrCode.name}
                            </h1>
                            <Badge
                                variant={
                                    qrCode.active ? 'default' : 'secondary'
                                }
                            >
                                {qrCode.active ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                            {qrCode.destination}
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    admin.qrCodes.edit({ qr_code: qrCode.id })
                                        .url
                                }
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={
                                    admin.qrCodes.stats({ qrCode: qrCode.id })
                                        .url
                                }
                            >
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Estadísticas
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[260px_1fr]">
                    {/* QR */}
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 p-6">
                            <img
                                src={svgUrl}
                                alt={`QR ${qrCode.name}`}
                                className="h-48 w-48 rounded-lg border bg-white p-2"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Descargar
                                        <ChevronDown className="ml-auto h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                                    {DOWNLOAD_FORMATS.map((f) => (
                                        <DropdownMenuItem
                                            key={f.format}
                                            asChild
                                        >
                                            <a
                                                href={downloadUrl(f.format)}
                                                download
                                            >
                                                {f.label}
                                            </a>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                    </Card>

                    {/* Información */}
                    <Card>
                        <CardContent className="divide-y p-0">
                            <InfoRow label="URL corta">
                                <button
                                    type="button"
                                    onClick={copyUrl}
                                    className="inline-flex items-center gap-1.5 font-mono text-xs hover:text-primary"
                                >
                                    {qrCode.short_url}
                                    {copied ? (
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </InfoRow>
                            <InfoRow label="Destino">
                                <a
                                    href={qrCode.destination}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 truncate hover:text-primary"
                                >
                                    <span className="truncate">
                                        {qrCode.destination}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                </a>
                            </InfoRow>
                            <InfoRow label="Código">
                                <span className="font-mono">
                                    {qrCode.code}
                                </span>
                            </InfoRow>
                            <InfoRow label="Caduca">
                                {qrCode.expires_at ? (
                                    new Date(
                                        qrCode.expires_at,
                                    ).toLocaleDateString('es-ES')
                                ) : (
                                    <span className="text-muted-foreground">
                                        Nunca
                                    </span>
                                )}
                            </InfoRow>
                        </CardContent>
                    </Card>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">
                                Total clicks
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                                {qrCode.total_clicks}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">
                                Clicks hoy
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                                {qrCode.clicks_today}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

QrCodesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Mis QRs', href: admin.qrCodes.index().url },
        { title: 'Detalle QR' },
    ],
};
