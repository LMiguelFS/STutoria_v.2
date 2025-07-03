import React, { useState, useEffect } from "react";

export default function EstudiantesDerivados({ codigosAlumno, filtros, onSeleccionarEstudiante }) {
    const [estudiantes, setEstudiantes] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Nuevo estado para el filtro

    useEffect(() => {
        if (codigosAlumno && codigosAlumno.length > 0) {
            fetch("api/list-derivaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ codigos_alumno: codigosAlumno }),
            })
                .then(res => res.json())
                .then(data => setEstudiantes(data))
                .catch(() => setEstudiantes([]));
        } else {
            setEstudiantes([]);
        }
    }, [codigosAlumno]);

    // Filtrado por código, nombre o apellido
    const estudiantesFiltrados = estudiantes.filter(est =>
        est.codigo_alumno?.toLowerCase().includes(busqueda.toLowerCase()) ||
        est.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        est.apellidos?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold text-sm">Estudiantes Derivados</h2>
                    <div className="flex items-center space-x-5">
                        {/* Input de búsqueda */}
                        <input
                            type="text"
                            className="w-64 px-15 py-1 rounded bg-gray-700 text-white text-xs focus:outline-none"
                            placeholder="Buscar por código, nombre o apellido"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                        <span className="text-gray-400 text-xs">{estudiantesFiltrados.length} estudiantes</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[670px]">
                <table className="text-sm">
                    <thead className="sticky top-0 bg-gray-800/80 backdrop-blur-sm">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-300 font-medium border-b border-gray-700">
                                Estudiante
                            </th>
                            <th className="px-4 py-3 text-left text-gray-300 font-medium border-b border-gray-700">
                                Carrera
                            </th>
                            <th className="px-4 py-3 text-center text-gray-300 font-medium border-b border-gray-700">
                                Semestre
                            </th>
                            <th className="px-4 py-3 text-center text-gray-300 font-medium border-b border-gray-700">
                                Celular
                            </th>
                            <th className="px-4 py-3 text-center text-gray-300 font-medium border-b border-gray-700">
                                Detalles
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantesFiltrados.map((estudiante) => (
                            <tr key={estudiante.id} className="hover:bg-gray-800/30 transition-colors border-b border-gray-700/50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                            {estudiante.nombre?.charAt(0)}{estudiante.apellidos?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-gray-200 font-medium">{estudiante.nombre} {estudiante.apellidos}</div>
                                            <div className="text-gray-400 text-xs">{estudiante.fecha_derivacion}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {estudiante.programa_estudios}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center text-white">{estudiante.semestre}</td>
                                <td className="px-4 py-3 text-center text-white">{estudiante.celular}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200"
                                            title="Ver expediente"
                                            onClick={() => onSeleccionarEstudiante(estudiante)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {estudiantesFiltrados.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-sm">No hay estudiantes derivados</p>
                    </div>
                )}
            </div>
        </div>
    );
}
