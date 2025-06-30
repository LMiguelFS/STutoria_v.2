import React, { useState, useEffect } from 'react';

export default function FiltrarTutor({ onSeleccionarTutor }) {
    const [filtros, setFiltros] = useState({
        carrera: 'Todos',
        nombre: ''
    });
    const [tutores, setTutores] = useState([]);
    const [loading, setLoading] = useState(false);

    const carreras = [
        { value: 'Todos', label: 'Todas las carreras' },
        { value: 'DSI', label: 'DSI' },
        { value: 'ASH', label: 'ASH' },
        { value: 'CO', label: 'CO' },
        { value: 'EA', label: 'EA' },
        { value: 'EN', label: 'EN' },
        { value: 'MA', label: 'MA' },
        { value: 'MP', label: 'MP' },
        { value: 'GOT', label: 'GOT' },
        { value: 'EI', label: 'EI' },
        { value: 'TLC', label: 'TLC' }
    ];

    useEffect(() => {
        setLoading(true);
        fetch(`/api/filtrar/tutores?carrera=${encodeURIComponent(filtros.carrera)}&nombre=${encodeURIComponent(filtros.nombre)}`)
            .then(res => res.json())
            .then(data => {
                setTutores(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [filtros]);

    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const limpiarFiltros = () => {
        setFiltros({ carrera: 'Todos', nombre: '' });
    };

    const tutoresFiltrados = tutores; // Ya vienen filtrados del backend

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Header con filtros */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">

                <div className="flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-indigo-100 mb-2">
                                Carrera o Programa
                            </label>
                            <select
                                value={filtros.carrera}
                                onChange={(e) => handleFiltroChange('carrera', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            >
                                {carreras.map(carrera => (
                                    <option key={carrera.value} value={carrera.value}>
                                        {carrera.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-0 mt-6">
                            <button
                                onClick={limpiarFiltros}
                                className="bg-black bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-indigo-100 mb-1">
                            Buscar tutor
                        </label>
                        <input
                            type="text"
                            value={filtros.nombre}
                            onChange={(e) => handleFiltroChange('nombre', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Nombre o apellido..."
                        />
                    </div>
                </div>
            </div>

            {/* Contador de resultados */}
            <div className="px-6 py-3 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">
                    {loading ? 'Cargando...' : `${tutoresFiltrados.length} tutor${tutoresFiltrados.length !== 1 ? 'es' : ''} encontrado${tutoresFiltrados.length !== 1 ? 's' : ''}`}
                    {filtros.carrera !== 'Todos' && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {carreras.find(c => c.value === filtros.carrera)?.label}
                        </span>
                    )}
                </p>
            </div>

            {/* Tabla de tutores */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tutor
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Programa
                            </th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center">
                                    <span className="text-gray-500">Cargando...</span>
                                </td>
                            </tr>
                        ) : tutoresFiltrados.length > 0 ? (
                            tutoresFiltrados.map((tutor) => (
                                <tr key={tutor.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className=" px-2 py-1">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-indigo-700">
                                                        {tutor.nombres?.charAt(0)}{tutor.apellidos?.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {tutor.nombres} {tutor.apellidos}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {tutor.programa_estudios}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={() => onSeleccionarTutor(tutor.id)}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-sm text-gray-500 mb-2">No se encontraron tutores</p>
                                        <p className="text-xs text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer con información adicional */}
            {tutoresFiltrados.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Total de registros: {tutoresFiltrados.length}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
