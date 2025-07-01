import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Radar, Bubble, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { usePage } from '@inertiajs/react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
);

const EstadisticasAtencion = ({ tutorId }) => {
    const { auth } = usePage().props;
    const [estadisticas, setEstadisticas] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedChart, setSelectedChart] = useState('fecha');

    useEffect(() => {
        const fetchEstadisticas = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/estadisticaatencion/${tutorId}`);
                setEstadisticas(response.data);
            } catch (error) {
                setMensaje('No se pudieron cargar las estadísticas.');
            } finally {
                setLoading(false);
            }
        };
        fetchEstadisticas();
    }, [tutorId]);

    // Configuración global para modo oscuro
    const darkThemeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e5e7eb',
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f9fafb',
                bodyColor: '#d1d5db',
                borderColor: '#374151',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#9ca3af',
                    font: { size: 11 }
                },
                grid: {
                    color: 'rgba(75, 85, 99, 0.3)',
                    drawBorder: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#9ca3af',
                    font: { size: 11 },
                    stepSize: 1,
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                    }
                },
                grid: {
                    color: 'rgba(75, 85, 99, 0.2)',
                    drawBorder: false
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <p className="text-gray-300 text-sm">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    if (!estadisticas) {
        return (
            <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-gray-300 text-sm">{mensaje || 'No hay datos disponibles'}</p>
                </div>
            </div>
        );
    }

    const atencionesPorTutor = estadisticas.atenciones_por_tutor || [];
    const atencionesPorFecha = estadisticas.atenciones_por_fecha || [];
    const frecuenciaPorCategoria = (estadisticas.frecuencia_por_categoria || []).filter((item) => item.frecuencia > 0);
    const relacionAtenciones = estadisticas.relacion_atenciones || [];

    // Datos para gráfico de línea (por fecha)
    const datosAtencionesFecha = {
        labels: atencionesPorFecha.map((item) => {
            const fecha = new Date(item.fecha);
            return fecha.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Atenciones',
                data: atencionesPorFecha.map((item) => item.cantidad),
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#1e40af',
                pointRadius: 4,
                pointHoverRadius: 6
            },
        ],
    };

    // Datos para gráfico de barras (por categoría)
    const datosFrecuenciaCategoriaBar = {
        labels: frecuenciaPorCategoria.map((item) => item.nombre_categoria),
        datasets: [
            {
                label: 'Frecuencia',
                data: frecuenciaPorCategoria.map((item) => item.frecuencia),
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
                borderColor: [
                    '#dc2626',
                    '#d97706',
                    '#16a34a',
                    '#2563eb',
                    '#9333ea',
                    '#db2777',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartTypes = [
        { key: 'fecha', label: 'Por Fecha', icon: '📈' },
        { key: 'categoria', label: 'Categorías', icon: '🎯' }
    ];

    const renderSelectedChart = () => {
        const chartProps = { options: darkThemeOptions };

        switch (selectedChart) {
            case 'fecha':
                return atencionesPorFecha.length > 0 ? (
                    <Line data={datosAtencionesFecha} {...chartProps} />
                ) : (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-gray-400 text-sm">Sin datos de fechas</p>
                    </div>
                );
            case 'tutor':
                return atencionesPorTutor.length > 0 ? (
                    <Bar data={datosAtencionesTutor} {...chartProps} />
                ) : (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-gray-400 text-sm">Sin datos de tutores</p>
                    </div>
                );
            case 'categoria':
                return frecuenciaPorCategoria.length > 0 ? (
                    <Bar
                        data={datosFrecuenciaCategoriaBar}
                        options={{
                            ...darkThemeOptions,
                            plugins: {
                                ...darkThemeOptions.plugins,
                                legend: {
                                    ...darkThemeOptions.plugins.legend,
                                    display: false
                                }
                            }
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-gray-400 text-sm">Sin datos de categorías</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">

                {/* Tabs de navegación */}
                <div className="flex space-x-5">
                    <h3 className="text-white font-semibold text-sm mb-2 ">Tutorias Individuales</h3>

                    {chartTypes.map((chart) => (
                        <button
                            key={chart.key}
                            onClick={() => setSelectedChart(chart.key)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${selectedChart === chart.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            <span className="mr-1">{chart.icon}</span>
                            {chart.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Container (Modificar el tamaño del panel)*/}
            <div className="p-4 ">
                {renderSelectedChart()}
            </div>

            {/* Footer con métricas resumidas */}
            <div className="px-4 py-2 bg-gray-800/30 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-blue-400 text-lg font-bold">
                            {atencionesPorFecha.reduce((acc, item) => acc + item.cantidad, 0)}
                        </div>
                        <div className="text-gray-400 text-xs">Total</div>
                    </div>
                    <div>
                        <div className="text-green-400 text-lg font-bold">
                            {atencionesPorFecha.length > 0 ? 1 : 0}
                        </div>
                        <div className="text-gray-400 text-xs">Tutores</div>
                    </div>
                    <div>
                        <div className="text-purple-400 text-lg font-bold">
                            {frecuenciaPorCategoria.length}
                        </div>
                        <div className="text-gray-400 text-xs">Categorías</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstadisticasAtencion;
