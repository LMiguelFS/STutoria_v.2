import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Radar, Bubble } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { usePage } from '@inertiajs/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Tooltip, Legend);

const estadisticasatencion = () => {
    const { auth } = usePage().props;
    const [estadisticas, setEstadisticas] = useState(null);
    const [mensaje, setMensaje] = useState('');

    // Obtener el ID del usuario basado en el correo electrónico
    const fetchUsuarioId = async () => {
        try {
            if (auth && auth.user && auth.user.id) {
                return auth.user.id;
            }
            // Si necesitas buscarlo por email:
            const response = await axios.post(`/api/recuperar-id?email=${auth.user.email}`);
            if (response.data && response.data.id) {
                return response.data.id;
            } else {
                setMensaje('No se pudo encontrar el ID del usuario.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
            setMensaje('Error al obtener el ID del usuario. Intenta de nuevo.');
            return null;
        }
    };

    useEffect(() => {
        const fetchEstadisticas = async () => {
            const userId = await fetchUsuarioId();
            if (!userId) return;
            try {
                const response = await axios.get(`/api/estadisticaatencion/${userId}`);
                setEstadisticas(response.data);
            } catch (error) {
                console.error('Error al obtener las estadísticas:', error);
                setMensaje('No se pudieron cargar las estadísticas.');
            }
        };
        fetchEstadisticas();
    }, []);

    if (!estadisticas) {
        return <p>{mensaje || 'Cargando estadísticas...'}</p>;
    }

    const atencionesPorTutor = estadisticas.atenciones_por_tutor || [];
    const atencionesPorFecha = estadisticas.atenciones_por_fecha || [];
    const frecuenciaPorCategoria = (estadisticas.frecuencia_por_categoria || []).filter((item) => item.frecuencia > 0);
    const relacionAtenciones = estadisticas.relacion_atenciones || [];

    const datosAtencionesTutor = {
        labels: atencionesPorTutor.map((item) => `Tutor ${item.id_user}`),
        datasets: [
            {
                label: 'Cantidad de Atenciones',
                data: atencionesPorTutor.map((item) => item.cantidad),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
            },
        ],
    };

    const datosAtencionesFecha = {
        labels: atencionesPorFecha.map((item) => item.fecha),
        datasets: [
            {
                label: 'Cantidad de Atenciones',
                data: atencionesPorFecha.map((item) => item.cantidad),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const datosFrecuenciaCategoria = {
        labels: frecuenciaPorCategoria.map((item) => item.nombre_categoria),
        datasets: [
            {
                label: 'Frecuencia',
                data: frecuenciaPorCategoria.map((item) => item.frecuencia),
                backgroundColor: 'rgba(255, 205, 86, 0.8)',
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 2,
            },
        ],
    };

    const datosRelacionAtenciones = {
        datasets: relacionAtenciones.map((item) => ({
            label: `Tutor ${item.id_user}`,
            data: [
                {
                    x: item.cantidad_atenciones,
                    y: Number(item.duracion_promedio),
                    r: item.cantidad_atenciones * 3,
                },
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
        })),
    };

    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, auto)',
        gap: '20px',
        padding: '20px',
    };

    const chartContainerStyle = {
        backgroundColor: '#441a5f',
        color: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minHeight: '420px', // Aumenta el alto mínimo
        minWidth: '420px',  // Aumenta el ancho mínimo
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    return (
        <div>
            <h2 className="titulo" >Estadísticas de Tutorías</h2>
            <div style={containerStyle}>
                {/* Gráfico 1: Atenciones por Tutor */}
                {atencionesPorTutor.length > 0 && (
                    <div style={chartContainerStyle}>
                        <h3>Atenciones por Tutor</h3>
                        <Bar data={datosAtencionesTutor} options={{ responsive: true }} />
                    </div>
                )}

                {/* Gráfico 2: Atenciones por Fecha */}
                <div style={chartContainerStyle}>
                    <h3>Atenciones por Fecha</h3>
                    {atencionesPorFecha.length > 0 ? (
                        <Line
                            data={datosAtencionesFecha}
                            options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1,
                                            callback: function (value) {
                                                return Number.isInteger(value) ? value : null;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    ) : (
                        <p>No hay datos disponibles para "Atenciones por Fecha".</p>
                    )}
                </div>

                {/* Gráfico 3: Frecuencia por Categoría */}
                <div style={chartContainerStyle}>
                    <h3>Frecuencia de Categorías</h3>
                    {frecuenciaPorCategoria.length > 0 ? (
                        <Radar
                            data={datosFrecuenciaCategoria}
                            options={{
                                responsive: true,
                                scales: {
                                    r: {
                                        grid: {
                                            color: '#666',
                                            lineWidth: 2,
                                        },
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p>No hay datos disponibles para "Frecuencia de Categorías".</p>
                    )}
                </div>

                {/* Gráfico 4: Relación entre Atenciones y Próxima Cita */}
                {relacionAtenciones.length > 0 && (
                    <div style={chartContainerStyle}>
                        <h3>Relación entre Atenciones y Próxima Cita</h3>
                        <Bubble data={datosRelacionAtenciones} options={{ responsive: true }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default estadisticasatencion;
