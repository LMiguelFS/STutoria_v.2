import React, { useState } from 'react';
import axios from 'axios';
//-------------------------------------------
import { usePage } from '@inertiajs/react';
//-------------------------------------------
export default function PanelReportes() {
    //------------------------------------------------
    const { auth } = usePage().props;
    //------------------------------------------------
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('grupal');

    const handlePrint = () => {
        const params = `?startDate=${startDate}&endDate=${endDate}&id_user=${auth.user.id}`;
        if (reportType === 'individual') {
            window.open(`api/reporteIndividual${params}`, '_blank');
        } else {
            window.open(`api/reporteGrupal${params}`, '_blank');
        }
    };

    const fetchUsuarioId = async () => {
        try {
            const response = await axios.post(`/api/recuperar-id?email=${auth.user.email}`);
            if (response.data && response.data.id) {
                const idUser = response.data.id; // ID del usuario
                console.log("ID del usuario recuperado:", idUser); // Muestra el ID en la consola
                obtenerDatos(idUser, filtros); // Llama a obtenerDatos con el ID y filtros actuales
            } else {
                console.error('No se pudo encontrar el ID del usuario.');
            }
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
        }
    };

    return (
        <div className="flex flex-col items-center p-10 bg-purple-100 min-h">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-semibold text-purple-700 mb-6">Opciones de Reporte</h2>

                <p className="text-gray-600 mb-8">
                    Selecciona el rango de fechas y el tipo de reporte que deseas imprimir. Puedes personalizar los filtros antes de imprimir.
                </p>

                {/* Selección de rango de fechas */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-purple-700 font-semibold mb-2">Fecha Inicial:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded-lg p-2 bg-purple-50 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-purple-700 font-semibold mb-2">Fecha Final:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded-lg p-2 bg-purple-50 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    {/* Selección de tipo de reporte */}
                    <div className="flex flex-col">
                        <label className="text-purple-700 font-semibold mb-2">Tipo de Reporte:</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="border rounded-lg p-2 bg-purple-50 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        >
                            <option value="grupal">Grupal</option>
                            <option value="individual">Individual</option>
                        </select>
                    </div>
                </div>

                {/* Botones de impresión */}
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handlePrint}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                    >
                        Imprimir Reporte {reportType === 'grupal' ? 'Grupal' : 'Individual'}
                    </button>
                </div>
            </div>
        </div>
    );
}
