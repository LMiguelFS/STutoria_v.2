import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Registra los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function GraficaDerivaciones({ data = [], filtros }) {
    // Filtra los datos según los filtros seleccionados
    const datosFiltrados = data.filter(item =>
        (filtros.carrera === 'Todos' || item.carrera === filtros.carrera) &&
        (filtros.ciclo === 'Todos' || item.semestre === filtros.ciclo)
    );

    // Usa datosFiltrados para los conteos
    const conteoCarrera = datosFiltrados.reduce((acc, curr) => {
        acc[curr.carrera] = (acc[curr.carrera] || 0) + curr.total;
        return acc;
    }, {});

    const conteoCiclo = datosFiltrados.reduce((acc, curr) => {
        acc[curr.semestre] = (acc[curr.semestre] || 0) + curr.total;
        return acc;
    }, {});

    // Ordenar carreras por cantidad (de mayor a menor)
    const carrerasOrdenadas = Object.entries(conteoCarrera)
        .sort((a, b) => b[1] - a[1])
        .map(([carrera]) => carrera);

    // Ordenar ciclos numéricamente
    const ciclosOrdenados = Object.keys(conteoCiclo)
        .sort()
        .map(semestre => ` ${semestre}`);

    // Datos para los gráficos
    const dataCarreras = {
        labels: carrerasOrdenadas,
        datasets: [
            {
                label: "Derivaciones",
                data: carrerasOrdenadas.map(carrera => conteoCarrera[carrera]),
                backgroundColor: "rgba(99, 102, 241, 0.7)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 1,
            },
        ],
    };

    const dataCiclos = {
        labels: ciclosOrdenados,
        datasets: [
            {
                label: "Sesiones",
                data: Object.keys(conteoCiclo)
                    .sort()
                    .map(semestre => conteoCiclo[semestre]),
                backgroundColor: "rgba(16, 185, 129, 0.7)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Opciones comunes para los gráficos
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#e5e7eb",
                },
            },
            tooltip: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#9ca3af",
                },
                grid: {
                    color: "rgba(55, 65, 81, 0.5)",
                },
            },
            y: {
                ticks: {
                    color: "#9ca3af",
                    stepSize: 1, // <-- fuerza los pasos de 1 en el eje Y
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null; // solo muestra enteros
                    }
                },
                grid: {
                    color: "rgba(55, 65, 81, 0.5)",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                <h2 className="text-white font-semibold text-lg text-center">
                    Análisis de Derivaciones
                </h2>
            </div>
            <div className="p-4 space-y-2">
                {/* Gráfico por Carrera */}
                <div className="bg-gray-800/50 p-2 rounded-lg">
                    <h3 className="text-gray-300 text-md font-semibold mb-4">
                        Derivaciones por Programa de Estudios
                    </h3>
                    <div className="h-30">{/* Cambia h-64 por h-80 para aumentar el alto */}
                        <Bar data={dataCarreras} options={options} />
                    </div>
                </div>

                {/* Gráfico por Ciclo */}
                <div className="bg-gray-800/50 p-2 rounded-lg">
                    <h3 className="text-gray-300 text-md font-semibold mb-4">
                        Derivaciones por Semestre
                    </h3>
                    <div className="h-30">{/* Cambia h-64 por h-80 para aumentar el alto */}
                        <Bar data={dataCiclos} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
}
