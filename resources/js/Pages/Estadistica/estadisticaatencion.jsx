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

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Tooltip, Legend);

const estadisticasatencion = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/estadisticaatencion');
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
                backgroundColor: 'rgba(54, 162, 235, 0.8)', // Azul intenso
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
                borderColor: 'rgba(255, 99, 132, 1)', // Rojo
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
                backgroundColor: 'rgba(255, 205, 86, 0.8)', // Amarillo intenso
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
                    y: item.duracion_promedio,
                    r: item.cantidad_atenciones * 3, // Tamaño proporcional aumentado
                },
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.8)', // Verde
        })),
    };

    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // Dos columnas
        gridTemplateRows: 'repeat(2, auto)', // Dos filas
        gap: '20px',
        padding: '20px',
    };

    const chartContainerStyle = {
        backgroundColor: '#441a5f',
        color: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div >
            <h2>Estadísticas de Tutorías</h2>
            <div style={containerStyle}>
                {/* Gráfico 1: Atenciones por Tutor */}
                <div style={chartContainerStyle}>
                    <h3>Atenciones por Tutor</h3>
                    {atencionesPorTutor.length > 0 ? (
                        <Bar data={datosAtencionesTutor} options={{ responsive: true }} />
                    ) : (
                        <p>No hay datos disponibles para "Atenciones por Tutor".</p>
                    )}
                </div>

                {/* Gráfico 2: Atenciones por Fecha */}
                <div style={chartContainerStyle}>
                    <h3>Atenciones por Fecha</h3>
                    {atencionesPorFecha.length > 0 ? (
                        <Line data={datosAtencionesFecha} options={{ responsive: true }} />
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
                                            color: '#666', // Color de mallas
                                            lineWidth: 2, // Grosor de mallas
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
                {/* <div style={chartContainerStyle}>
                    <h3>Relación entre Atenciones y Próxima Cita</h3>
                    {relacionAtenciones.length > 0 ? (
                        <Bubble data={datosRelacionAtenciones} options={{ responsive: true }} />
                    ) : (
                        <p>No hay datos disponibles para "Relación entre Atenciones y Próxima Cita".</p>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default estadisticasatencion;
