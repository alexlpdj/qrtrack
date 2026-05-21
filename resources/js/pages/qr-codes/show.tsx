import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Copy, Download, BarChart2, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
            <div className="flex flex-col gap-6 p-6 max-w-2xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{qrCode.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground break-all">
                            {qrCode.destination}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={admin.qrCodes.stats({ qrCode: qrCode.id }).url}>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Estadísticas
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-6 md:flex-row">
                    <Card className="flex-shrink-0">
                        <CardContent className="flex flex-col items-center gap-4 pt-6">
                            <img
                                src={svgUrl}
                                alt={`QR ${qrCode.name}`}
                                className="h-48 w-48"
                            />
                            <div className="flex gap-2">
                                <Button onClick={copyUrl} variant="outline" size="sm">
                                    {copied ? (
                                        <Check className="mr-2 h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="mr-2 h-4 w-4" />
                                    )}
                                    {copied ? 'Copiado' : 'Copiar URL'}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {DOWNLOAD_FORMATS.map((f) => (
                                            <DropdownMenuItem key={f.format} asChild>
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
                            </div>
                            <p className="font-mono text-xs text-muted-foreground">
                                {qrCode.short_url}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4 flex-1">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total clicks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{qrCode.total_clicks}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Clicks hoy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{qrCode.clicks_today}</p>
                            </CardContent>
                        </Card>
                    </div>
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
