import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FiltrarTutor from '@/Components/ComponentsAdmin/FiltroTutor';
import EstadisticaSI from '@/Components/ComponentsAdmin/EstadisticaSI';
import EstadisticaSG from '@/Components/ComponentsAdmin/EstadisticaSG';
import TemasSG from '@/Components/ComponentsAdmin/TemasSG';
import GraficaTemasSG from '@/Components/ComponentsAdmin/GraficaTemasSG';

export default function STutoria({ }) {
    const [tutorIdSeleccionado, setTutorIdSeleccionado] = useState(null);
    const [idsSeleccionados, setIdsSeleccionados] = useState([]);
    return (
        <AuthenticatedLayout>
            <Head title="STutorias" />

            <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-3 ">
                {/* === FILTRO (Columna izquierda) === */}
                <FiltrarTutor onSeleccionarTutor={setTutorIdSeleccionado} />

                {/* === ESTADÍSTICA (Columna derecha) === */}
                <div className="md:col-span-3 border p-2 rounded shadow space-y-1">

                    {/* Gráficos de sesiones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
                        <div className="border rounded p-1 " style={{ height: '350px' }}>
                            <EstadisticaSI tutorId={tutorIdSeleccionado} />
                        </div>

                        <div className="border rounded p-2 " style={{ height: '350px' }}>
                            <EstadisticaSG tutorId={tutorIdSeleccionado}></EstadisticaSG>
                        </div>
                    </div>

                    {/* Temas y gráfico por temas */}
                    <div className="grid gap-1" style={{ gridTemplateColumns: '240px 1fr' }}>
                        <div className="border rounded ">
                            <TemasSG userId={tutorIdSeleccionado} onSeleccionChange={setIdsSeleccionados} />
                        </div>
                        <div className="border rounded ">
                            <GraficaTemasSG ids={idsSeleccionados} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
