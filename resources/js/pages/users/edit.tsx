import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import admin from '@/routes/admin';
import type { UserRole } from '@/types';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

interface Props {
    user: UserData;
}

interface UserForm {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    password_confirmation: string;
}

export default function UsersEdit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm<UserForm>({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.users.update({ user: user.id }).url);
    };

    return (
        <>
            <Head title={`Editar usuario: ${user.name}`} />
            <div className="flex max-w-lg flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Editar usuario</h1>

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
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role">Rol</Label>
                        <Select
                            value={data.role}
                            onValueChange={(v) =>
                                setData('role', v as UserRole)
                            }
                        >
                            <SelectTrigger id="role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employee">
                                    Empleado — crea y gestiona sus QRs
                                </SelectItem>
                                <SelectItem value="admin">
                                    Administrador — acceso total
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password">Nueva contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            autoComplete="new-password"
                            placeholder="Dejar en blanco para no cambiarla"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password_confirmation">
                            Confirmar nueva contraseña
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            Guardar cambios
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

UsersEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Usuarios', href: admin.users.index().url },
        { title: 'Editar usuario' },
    ],
};
