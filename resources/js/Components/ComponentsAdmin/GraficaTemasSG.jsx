import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GraficaTemasSG({ ids }) {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ids || ids.length === 0) {
            setDatos([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        // Puedes cambiar la URL y el método según tu backend
        fetch("/api/cantidad-alumnos-sesion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        })
            .then(res => res.json())
            .then(data => {
                setDatos(Array.isArray(data) ? data : [data]);
                setLoading(false);
            });
    }, [ids]);

    // Función para formatear la fecha
    const formatearFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        const meses = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        return `${dia} ${mes}`;
    };

    // Eje X: Tema (fecha)
    const labels = datos.map(item => `${item.tema} (${formatearFecha(item.fecha)})`);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Varones",
                data: datos.map(item => item.varones),
                backgroundColor: "#60a5fa",
                stack: "Stack 0",
            },
            {
                label: "Mujeres",
                data: datos.map(item => item.mujeres),
                backgroundColor: "#a78bfa",
                stack: "Stack 0",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { labels: { color: "#fff" } },
            tooltip: { mode: "index", intersect: false },
        },
        scales: {
            x: {
                stacked: true,
                ticks: { color: "#fff" },
                grid: { color: "#444" },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: { color: "#fff", stepSize: 1, precision: 0 },
                grid: { color: "#444" },
            },
        },
    };

    return (
        <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <h3 className="text-white font-semibold text-sm">Asistentes por sesiones grupales</h3>
            </div>
            <div className="p-4 h-80 flex items-center justify-center">
                {loading ? (
                    <span className="text-gray-400">Cargando...</span>
                ) : datos.length === 0 ? (
                    <span className="text-gray-400">Sin datos</span>
                ) : (
                    <Bar data={chartData} options={options} />
                )}
            </div>
        </div>
    );
}
