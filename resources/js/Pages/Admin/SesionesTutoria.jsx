import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FiltrarTutor from '@/Components/ComponentsAdmin/FiltroTutor';
import EstadisticaSI from '@/Components/ComponentsAdmin/EstadisticaSI';
import EstadisticaSG from '@/Components/ComponentsAdmin/EstadisticaSG';

export default function STutoria({ auth }) {
    const [tutorIdSeleccionado, setTutorIdSeleccionado] = useState(null);

    return (
        <AuthenticatedLayout>
            <Head title="GUsuarios" />

            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* === FILTRO (Columna izquierda) === */}
                <FiltrarTutor onSeleccionarTutor={setTutorIdSeleccionado} />

                {/* === ESTADÍSTICA (Columna derecha) === */}
                <div className="md:col-span-3 border p-4 rounded shadow space-y-4">

                    {/* Gráficos de sesiones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded p-2">
                            <EstadisticaSI tutorId={tutorIdSeleccionado} />
                        </div>

                        <div className="border rounded p-2">
                            <EstadisticaSG></EstadisticaSG>
                        </div>
                    </div>

                    {/* Temas y gráfico por temas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border p-3 rounded">
                            <h3 className="font-semibold mb-2">Sesiones Grupales - Temas</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>Adaptación</li>
                                <li>Manejo del estrés</li>
                                <li>Orientación profesional</li>
                            </ul>
                        </div>

                        <div className="border p-3 rounded">
                            <h3 className="font-semibold text-center">Gráfica por los temas</h3>
                            <div className="h-32 bg-gray-100 flex items-end justify-around mt-2">
                                {/* Gráfico comparativo por temas */}
                                <div className="w-5 h-16 bg-purple-500"></div>
                                <div className="w-5 h-20 bg-purple-700"></div>
                                <div className="w-5 h-14 bg-purple-400"></div>
                            </div>

                            <div className="text-xs text-right mt-2 pr-2 text-gray-600">
                                <p><span className="inline-block w-3 h-3 bg-purple-500 mr-1"></span> Grupo</p>
                                <p><span className="inline-block w-3 h-3 bg-purple-700 mr-1"></span> Individual</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
