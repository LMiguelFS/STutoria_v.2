import React, { useState, useEffect } from "react";
import FiltroDerivaciones from '@/Components/ComponetsAdminPsic/FiltroDerivaciones';
import GraficaDerivaciones from '@/Components/ComponetsAdminPsic/GraficaDerivaciones';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EstudiantesDerivados from '@/Components/ComponetsAdminPsic/EstudiantesDerivados';
import { Head } from '@inertiajs/react';
import InformaciónDetallada from '@/Components/ComponetsAdminPsic/InformacionDetallada';

export default function Derivaciones({ auth }) {
    const [filtros, setFiltros] = useState({ carrera: "Todos", ciclo: "Todos" });
    const [estadisticas, setEstadisticas] = useState([]);
    const [codigosAlumno, setCodigosAlumno] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

    // Fetch dinámico según filtros
    useEffect(() => {
        const fetchData = async () => {
            const url = "/api/derivaciones/estadisticas";
            let response;
            if (filtros.carrera === "Todos" && filtros.ciclo === "Todos") {
                response = await fetch(url);
            } else {
                response = await fetch("/api/derivaciones/estadisticas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        carrera: filtros.carrera !== "Todos" ? filtros.carrera : undefined,
                        ciclo: filtros.ciclo !== "Todos" ? filtros.ciclo : undefined,
                    }),
                });
            }
            const json = await response.json();
            setEstadisticas(json.data);
            setCodigosAlumno(json.codigos_alumno || []);
        };
        fetchData();
    }, [filtros]);

    return (
        <AuthenticatedLayout
        /* header={
             <h2 className="text-xl font-semibold leading-tight text-gray-800">
                 Derivaciones
             </h2>
         }*/
        >
            <Head title="Derivaciones" />

            {/* Cuerpo principal */}
            <div className="p-3 grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Panel Izquierdo */}
                <div className="col-span-1 space-y-4 gap-3">
                    <FiltroDerivaciones filtros={filtros} setFiltros={setFiltros} />
                    <GraficaDerivaciones data={estadisticas} filtros={filtros} />
                </div>

                {/* Panel Central */}
                <div className="col-span-2 border p-2 rounded shadow">
                    <EstudiantesDerivados
                        filtros={filtros}
                        codigosAlumno={codigosAlumno}
                        onSeleccionarEstudiante={setEstudianteSeleccionado}
                    />
                </div>

                {/* Panel Derecho */}
                <div className="col-span-1 border rounded shadow">
                    <InformaciónDetallada estudiante={estudianteSeleccionado}/>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
