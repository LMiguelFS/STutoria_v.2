import React, { useState } from 'react';

export default function PanelReportes() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('grupal');

    const handlePrint = () => {
        // Aquí puedes agregar lógica para generar el reporte basado en el rango de fechas y el tipo de reporte
        window.print();
    };

    return (
        <div className="flex flex-col items-center p-10 bg-gray-200 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Opciones de Reporte</h2>

                <p className="text-gray-600 mb-8">
                    Selecciona el rango de fechas y el tipo de reporte que deseas imprimir. Puedes personalizar los filtros antes de imprimir.
                </p>

                {/* Selección de rango de fechas */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-2">Fecha Inicial:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded-lg p-2 bg-gray-50 text-gray-700"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-2">Fecha Final:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded-lg p-2 bg-gray-50 text-gray-700"
                        />
                    </div>
                    {/* Selección de tipo de reporte */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-2">Tipo de Reporte:</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="border rounded-lg p-2 bg-gray-50 text-gray-700"
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
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                    >
                        Imprimir Reporte {reportType === 'grupal' ? 'Grupal' : 'Individual'}
                    </button>
                </div>
            </div>
        </div>
    );
}
