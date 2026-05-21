import { Head } from '@inertiajs/react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';

interface QrCodeInfo {
    id: number;
    code: string;
    name: string;
    destination: string;
}

interface ClickDay {
    date: string;
    count: number;
}

interface PieStat {
    name: string;
    value: number;
}

interface RecentClick {
    id: number;
    created_at: string | null;
    country: string | null;
    city: string | null;
    device: string | null;
    os: string | null;
    browser: string | null;
    referer: string | null;
}

interface Props {
    qrCode: QrCodeInfo;
    clicks_by_day: ClickDay[];
    clicks_by_device: PieStat[];
    clicks_by_country: PieStat[];
    clicks_by_browser: PieStat[];
    recent_clicks: RecentClick[];
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

function DonutChart({ data, title }: { data: PieStat[]; title: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">Sin datos</p>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                            >
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default function StatsShow({
    qrCode,
    clicks_by_day,
    clicks_by_device,
    clicks_by_country,
    clicks_by_browser,
    recent_clicks,
}: Props) {
    return (
        <>
            <Head title={`Estadísticas: ${qrCode.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">{qrCode.name}</h1>
                    <p className="text-sm text-muted-foreground break-all">{qrCode.destination}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Clicks por día (últimos 30 días)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={clicks_by_day}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(v: string) => v.slice(5)}
                                />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    fill="url(#colorCount)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <DonutChart data={clicks_by_device} title="Por dispositivo" />
                    <DonutChart data={clicks_by_country} title="Por país (top 10)" />
                    <DonutChart data={clicks_by_browser} title="Por navegador" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Clicks recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="pb-2 text-left font-medium whitespace-nowrap">Fecha</th>
                                        <th className="pb-2 text-left font-medium">País</th>
                                        <th className="pb-2 text-left font-medium">Ciudad</th>
                                        <th className="pb-2 text-left font-medium">Dispositivo</th>
                                        <th className="pb-2 text-left font-medium">OS</th>
                                        <th className="pb-2 text-left font-medium">Navegador</th>
                                        <th className="pb-2 text-left font-medium">Referer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_clicks.map((click) => (
                                        <tr key={click.id} className="border-b last:border-0">
                                            <td className="py-2 whitespace-nowrap text-xs">
                                                {click.created_at
                                                    ? new Date(click.created_at).toLocaleString('es-ES')
                                                    : '—'}
                                            </td>
                                            <td className="py-2">{click.country ?? '—'}</td>
                                            <td className="py-2">{click.city ?? '—'}</td>
                                            <td className="py-2 capitalize">{click.device ?? '—'}</td>
                                            <td className="py-2">{click.os ?? '—'}</td>
                                            <td className="py-2">{click.browser ?? '—'}</td>
                                            <td className="py-2 max-w-xs">
                                                {click.referer ? (
                                                    <span className="truncate block text-xs" title={click.referer}>
                                                        {click.referer.length > 40
                                                            ? click.referer.slice(0, 40) + '…'
                                                            : click.referer}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                    {recent_clicks.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-4 text-center text-muted-foreground">
                                                Sin clicks registrados todavía
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

StatsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Mis QRs', href: admin.qrCodes.index().url },
        { title: 'Estadísticas' },
    ],
};
