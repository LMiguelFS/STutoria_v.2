import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusquedaAlumno = ({ onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length > 1) {
                buscarAlumnos();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const buscarAlumnos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/alumnos/buscar?q=${searchTerm}`);
            if (response.data.success) {
                setResults(response.data.data);
            }
        } catch (error) {
            console.error('Error buscando alumnos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Buscar Alumno</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Nombre, apellido o código"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                {loading && <p className="text-gray-500">Buscando...</p>}

                <div className="max-h-60 overflow-y-auto mb-4 border rounded-lg">
                    {results.map((alumno) => (
                        <div
                            key={alumno.codigo_alumno}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => onSelect(alumno)}
                        >
                            <div className="font-medium">{alumno.nombre} {alumno.apellidos}</div>
                            <div className="text-sm text-gray-600">
                                Código: {alumno.codigo_alumno}
                                <span className="ml-4">Próx. sesión: #{alumno.proxima_sesion}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusquedaAlumno;
