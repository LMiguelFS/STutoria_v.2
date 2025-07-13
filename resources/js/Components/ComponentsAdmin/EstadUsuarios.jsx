import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function EstadUsuarios() {
    const [tutoresData, setTutoresData] = useState([]);
    const [otrosRoles, setOtrosRoles] = useState({ numero_psicologos: 0, numero_admin: 0 });
    const [modo, setModo] = useState('tutores'); // 'tutores' o 'roles'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/numero-usuarios');
                if (!res.ok) throw new Error('Error al obtener datos');

                const data = await res.json();

                setTutoresData(data.numero_tutores || []);
                setOtrosRoles({
                    numero_psicologos: data.numero_psicologos || 0,
                    numero_admin: data.numero_admin || 0,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalTutores = tutoresData.reduce((sum, item) => sum + item.total, 0);
    const totalOtrosRoles = otrosRoles.numero_psicologos + otrosRoles.numero_admin;

    const opciones = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#d1d5db',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: modo === 'tutores'
                    ? `Número de Tutores por Programa`
                    : `Número de Psicólogos y Administradores`,
                color: '#ffffff',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const total = modo === 'tutores' ? totalTutores : totalOtrosRoles;
                        const percentage = total > 0 ? (context.raw / total * 100).toFixed(1) : 0;
                        return `${context.dataset.label}: ${context.raw} (${percentage}%)`;
                    }
                },
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#d1d5db',
                borderColor: '#374151',
                borderWidth: 1,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                }
            },
            datalabels: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: '#374151',
                    borderColor: '#4b5563'
                }
            },
            y: {
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11
                    },
                    stepSize: 1,
                    precision: 0
                },
                grid: {
                    color: '#374151',
                    borderColor: '#4b5563'
                }
            }
        }
    };

    const datosGrafico = modo === 'tutores'
        ? {
            labels: tutoresData.map((item) => item.programa_estudios || 'No Asignado'),
            datasets: [{
                label: 'Tutores',
                data: tutoresData.map((item) => item.total),
                backgroundColor: '#6366f1',
                borderColor: '#8b5cf6',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: '#8b5cf6',
                hoverBorderColor: '#a78bfa'
            }],
        }
        : {
            labels: ['Psicólogos', 'Administradores'],
            datasets: [{
                label: 'Usuarios',
                data: [otrosRoles.numero_psicologos, otrosRoles.numero_admin],
                backgroundColor: ['#10b981', '#f97316'],
                borderColor: ['#14b8a6', '#fb923c'],
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: ['#14b8a6', '#fb923c'],
                hoverBorderColor: ['#2dd4bf', '#fdba74']
            }],
        };

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-300">Cargando gráfico...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 rounded-xl p-8 border border-red-700">
                <div className="text-center">
                    <div className="text-red-400 mb-2">⚠️</div>
                    <p className="text-red-300">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden ">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Análisis de Usuarios</h2>
                        <p className="text-indigo-100 text-sm">
                            {modo === 'tutores'
                                ? `${totalTutores} tutores en total`
                                : `${totalOtrosRoles} usuarios administrativos`
                            }
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setModo(modo === 'tutores' ? 'roles' : 'tutores')}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border border-white/20 hover:border-white/30"
                        >
                            {modo === 'tutores' ? 'Otros Roles' : 'Rol Tutores'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Compact Version */}
            <div className="p-1 border-b border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    <div className="py-1 bg-gray-800 rounded-md p-1 border border-gray-600">
                        <div className="text-lg font-bold text-white">{totalTutores}</div>
                        <div className="text-gray-400 text-xs">Tutores</div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-1 border border-gray-600">
                        <div className="text-lg font-bold text-emerald-400">{otrosRoles.numero_psicologos}</div>
                        <div className="text-gray-400 text-xs">Psicólogos</div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-1 border border-gray-600">
                        <div className="text-lg font-bold text-orange-400">{otrosRoles.numero_admin}</div>
                        <div className="text-gray-400 text-xs">Administradores</div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-1 border border-gray-600">
                        <div className="text-lg font-bold text-blue-400">{totalTutores + totalOtrosRoles}</div>
                        <div className="text-gray-400 text-xs">Total Usuarios</div>
                    </div>
                </div>
            </div>

            {/* Chart with percentages */}
            <div className="p-2">
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                    <div className="h-80">
                        <Bar data={datosGrafico} options={opciones} />
                    </div>
                </div>
            </div>
        </div>
    );
}
