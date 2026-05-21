import { Head, Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { login } from '@/routes';
import admin from '@/routes/admin';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="QR Track" />
            <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-6 text-foreground">
                <div className="flex flex-col items-center gap-5 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <AppLogoIcon className="size-9 fill-current" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            QR Track
                        </h1>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            Códigos QR dinámicos: cambia el destino cuando
                            quieras sin reimprimir el código.
                        </p>
                    </div>
                </div>

                <Link
                    href={auth.user ? admin.dashboard().url : login().url}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    {auth.user ? 'Ir al panel' : 'Acceder'}
                </Link>

                <footer className="absolute bottom-6 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} QR Track
                </footer>
            </div>
        </>
    );
}
