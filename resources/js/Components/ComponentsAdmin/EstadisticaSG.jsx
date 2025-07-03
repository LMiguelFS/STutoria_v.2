import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const darkThemeOptions = {
    responsive: true,
    plugins: {
        legend: {
            labels: { color: "#fff" },
        },
    },
    scales: {
        x: { ticks: { color: "#fff" }, grid: { color: "#444" } },
        y: {
            beginAtZero: true,
            ticks: {
                color: "#fff",
                stepSize: 1,
                precision: 0
            },
            grid: { color: "#444" }
        },
    },
};

export default function EstadisticaSG({ tutorId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/estadisticaGrupal/por-fecha/${tutorId}`)
            .then(res => res.json())
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [tutorId]);

    // Función para formatear la fecha
    const formatearFecha = (fechaString) => {
        const fecha = new Date(fechaString + 'T00:00:00');
        const meses = [
            'ene', 'feb', 'mar', 'abr', 'may', 'jun',
            'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
        ];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        return `${dia} ${mes}`;
    };

    // Preparar datos para el gráfico
    const chartData = {
        labels: data.map(item => formatearFecha(item.Fecha)),
        datasets: [
            {
                label: "Sesiones Grupales",
                data: data.map(item => item.Cantidad),
                borderColor: "#a78bfa",
                backgroundColor: "#a78bfa88",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    return (
        <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <div className="flex space-x-5">
                    <h3 className="text-white font-semibold text-sm mb-2">Sesiones Grupales</h3>
                </div>
            </div>
            <div className="p-4 h-64 flex items-center justify-center">
                {loading ? (
                    <span className="text-gray-400">Cargando...</span>
                ) : data.length === 0 ? (
                    <span className="text-gray-400">Sin datos</span>
                ) : (
                    <Line data={chartData} options={darkThemeOptions} />
                )}
            </div>
        </div>
    );
}
