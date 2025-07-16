import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EstadUsuarios from '@/Components/ComponentsAdmin/EstadUsuarios';
import InputMensajes from '@/Components/ComponentsAdmin/InputMensajes';
import TablaUsuarioFiltro from '@/Components/ComponentsAdmin/TableUsuarioFiltro';
import Register from '../Auth/Register';

export default function GestionUsuarios() {
    return (
        <AuthenticatedLayout
        >
            <Head title="GUsuarios" />

            <div className="grid grid-cols-[1fr_2fr_1fr] gap-2">
                {/* Columna izquierda con 2 paneles verticales */}
                <div className="flex flex-col gap-6">
                    <div className="border p-1 rounded shadow">
                        <EstadUsuarios />
                    </div>
                    <div className="border p-4 rounded shadow">
                        <InputMensajes />
                    </div>
                </div>

                {/* Columna central con gráfico */}
                <div className="border p-2 rounded shadow flex flex-col items-center ">
                    <TablaUsuarioFiltro />
                </div>

                {/* Columna derecha vacía (placeholder o espacio futuro) */}
                <div className="border p-4 rounded shadow">
                    <Register />
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
