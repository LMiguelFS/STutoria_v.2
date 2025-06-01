import React, { useState } from 'react';
import axios from 'axios';

export default function PanelReportes() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('grupal');

    const handlePrint = () => {
        if (reportType === 'individual') {
            // Abrir el enlace del reporte individual
            window.open('http://127.0.0.1:8000/api/reporteIndividual', '_blank');
        } else {
            window.open('http://127.0.0.1:8000/api/reporteGrupal', '_blank');
        }
    };

    return (
        <div className="flex flex-col items-center p-10 bg-purple-100 min-h-screen">
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
