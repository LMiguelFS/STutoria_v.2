import React, { useEffect, useState } from 'react';

export default function TablaUsuarioFiltro() {
    const [tutores, setTutores] = useState([]);
    const [tutoresFiltrados, setTutoresFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        carrera: '',
        nombre: '',
        rol: 'tutor'
    });

    const carreras = [
        { value: '', label: 'Todas las carreras' },
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
        const fetchTutores = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('api/tutores/carrera');

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setTutores(data);
            } catch (error) {
                console.error('Error al obtener tutores:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTutores();
    }, []);

    useEffect(() => {
        let resultado = tutores;

        // Filtrar por rol
        if (filtros.rol) {
            resultado = resultado.filter(tutor =>
                tutor.rol && tutor.rol.toLowerCase().includes(filtros.rol.toLowerCase())
            );
        }

        // Filtrar por carrera (manejar valores null)
        if (filtros.carrera) {
            resultado = resultado.filter(tutor =>
                tutor.programa_estudios &&
                tutor.programa_estudios.toLowerCase().includes(filtros.carrera.toLowerCase())
            );
        }

        // Filtrar por nombre o apellido
        if (filtros.nombre) {
            resultado = resultado.filter(tutor =>
                (tutor.nombres && tutor.nombres.toLowerCase().includes(filtros.nombre.toLowerCase())) ||
                (tutor.apellidos && tutor.apellidos.toLowerCase().includes(filtros.nombre.toLowerCase()))
            );
        }

        setTutoresFiltrados(resultado);
    }, [tutores, filtros]);

    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            carrera: '',
            nombre: '',
            rol: 'tutor'
        });
    };

    const abrirWhatsApp = (celular) => {
        if (!celular) return;
        const url = `https://wa.me/51${celular}`;
        window.open(url, '_blank');
    };

    const abrirEmail = (email) => {
        if (!email) return;
        const url = `mailto:${email}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
                <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-gray-300">Cargando tutores...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 rounded-xl p-8 border border-red-500">
                <div className="flex items-center justify-center space-x-3 text-red-400">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-lg font-semibold">Error al cargar los datos</p>
                        <p className="text-sm text-gray-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            {/* Header con filtros */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Gestión de Tutores</h2>
                            <p className="text-blue-100 text-sm">Administra y contacta a los tutores</p>
                        </div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                        <span className="text-white font-semibold">{tutoresFiltrados.length}</span>
                        <span className="text-blue-100 text-sm ml-1">usuarios</span>
                    </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-8 gap-2">
                    {/* Filtro por carrera */}
                    <div className="col-span-2">
                        <select
                            value={filtros.carrera}
                            onChange={(e) => handleFiltroChange('carrera', e.target.value)}
                            className="w-full px-3 py-1 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            {carreras.map((opcion) => (
                                <option key={opcion.value} value={opcion.value} className="text-black">
                                    {opcion.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por rol (más pequeño) */}
                    <div className="col-span-2">
                        <select
                            value={filtros.rol}
                            onChange={(e) => handleFiltroChange('rol', e.target.value)}
                            className="w-full px-3 py-1 bg-white/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            <option value="tutor" className="text-black">Tutor</option>
                            <option value="coordinador" className="text-black">Coordinador</option>
                            <option value="admin" className="text-black">Admin</option>
                            <option value="" className="text-black">Todos los roles</option>
                        </select>
                    </div>

                    {/* Filtro por nombre o apellido (más amplio) */}
                    <div className="col-span-3">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o apellido"
                            value={filtros.nombre}
                            onChange={(e) => handleFiltroChange('nombre', e.target.value)}
                            className="w-full px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>

                    {/* Botón de limpiar filtros */}
                    <div className="col-span-1 ">
                        <button
                            onClick={limpiarFiltros}
                            className="w-full px-2 py-1 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/80 backdrop-blur-sm">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-300 font-medium border-b border-gray-700">
                                Nombre
                            </th>
                            <th className="px-2 py-3 text-left text-gray-300 font-medium border-b border-gray-700">
                                Apellidos
                            </th>
                            <th className="px-3 py-3 text-left text-gray-300 font-medium border-b border-gray-700">
                                Carrera
                            </th>
                            <th className="px-2 py-3 text-center text-gray-300 font-medium border-b border-gray-700">
                                Rol
                            </th>
                            <th className="px-2 py-3 text-center text-gray-300 font-medium border-b border-gray-700">
                                Notificación
                            </th>
                            <th className="px-2 py-3 text-center text-gray-300 font-medium border-b border-gray-700">
                                Detalles
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutoresFiltrados.length > 0 ? (
                            tutoresFiltrados.map((tutor, index) => (
                                <tr key={index} className="hover:bg-gray-800/30 transition-colors border-b border-gray-700/50">
                                    <td className="px-3 py-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                {tutor.nombres ? tutor.nombres.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <span className="text-gray-200 font-medium">{tutor.nombres || 'Sin nombre'}</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-gray-200">{tutor.apellidos || 'Sin apellido'}</td>
                                    <td className="px-3 py-2">
                                        {tutor.programa_estudios ? (
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {tutor.programa_estudios}
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                No asignado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${tutor.rol === 'tutor'
                                            ? 'bg-blue-100 text-blue-800'
                                            : tutor.rol === 'coordinador'
                                                ? 'bg-purple-100 text-purple-800'
                                                : tutor.rol === 'admin'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {tutor.rol || 'Sin rol'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {tutor.celular ? (
                                            <button
                                                onClick={() => abrirWhatsApp(tutor.celular)}
                                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-all duration-200"
                                                title={`Contactar por WhatsApp: ${tutor.celular}`}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 text-xs">Sin celular</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-full transition-all duration-200"
                                            title="Ver detalles"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-12 text-gray-400">
                                    <div className="flex flex-col items-center space-y-3">
                                        <span className="text-4xl opacity-50">👨‍🏫</span>
                                        <p className="text-lg">No se encontraron usuarios</p>
                                        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
