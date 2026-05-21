import { Head, Link } from '@inertiajs/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';

interface TopQrCode {
    name: string;
    code: string;
    total_clicks: number;
}

interface ClickDay {
    date: string;
    count: number;
}

interface DashboardProps {
    total_qr_codes: number;
    total_clicks: number;
    clicks_today: number;
    clicks_this_week: number;
    top_qr_codes: TopQrCode[];
    clicks_last_30_days: ClickDay[];
}

export default function Dashboard({
    total_qr_codes,
    total_clicks,
    clicks_today,
    clicks_this_week,
    top_qr_codes,
    clicks_last_30_days,
}: DashboardProps) {
    const metrics = [
        { label: 'Total QRs', value: total_qr_codes },
        { label: 'Total clicks', value: total_clicks },
        { label: 'Clicks hoy', value: clicks_today },
        { label: 'Clicks esta semana', value: clicks_this_week },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {metrics.map((m) => (
                        <Card key={m.label}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {m.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{m.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Clicks últimos 30 días</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={clicks_last_30_days}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(v: string) => v.slice(5)}
                                />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 QRs más escaneados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="pb-2 text-left font-medium">Nombre</th>
                                    <th className="pb-2 text-left font-medium">Código</th>
                                    <th className="pb-2 text-right font-medium">Clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_qr_codes.map((qr) => (
                                    <tr key={qr.code} className="border-b last:border-0">
                                        <td className="py-2">{qr.name}</td>
                                        <td className="py-2 font-mono text-xs">{qr.code}</td>
                                        <td className="py-2 text-right font-semibold">
                                            {qr.total_clicks}
                                        </td>
                                    </tr>
                                ))}
                                {top_qr_codes.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-4 text-center text-muted-foreground">
                                            Sin datos todavía
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
    ],
};
