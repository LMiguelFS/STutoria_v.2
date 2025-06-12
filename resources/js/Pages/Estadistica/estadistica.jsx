import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement, // Registrar este elemento
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

//-------------------------------------------
import { usePage } from '@inertiajs/react';
//-------------------------------------------

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement, // Registrar este elemento
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const EstadisticasCategorias = () => {
    //------------------------------------------------
    const { auth } = usePage().props;
    //------------------------------------------------
    const [estadisticas, setEstadisticas] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [tipoGrafico, setTipoGrafico] = useState('Bar');
    const [idUser, setIdUser] = useState(null);

    // Obtener el ID del usuario basado en el correo electrónico
    const fetchUsuarioId = async () => {
        try {
            // Si ya tienes el id_user en auth, puedes usarlo directamente:
            if (auth && auth.user && auth.user.id) {
                setIdUser(auth.user.id);
                return auth.user.id;
            }
            // Si necesitas buscarlo por email:
            const response = await axios.post(`/api/recuperar-id?email=${auth.user.email}`);
            if (response.data && response.data.id) {
                setIdUser(response.data.id);
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

    // Cargar las estadísticas de las categorías filtradas por tutor
    useEffect(() => {
        const fetchEstadisticas = async () => {
            const userId = await fetchUsuarioId();
            if (!userId) return;
            try {
                const response = await axios.get(`/api/estadistica/${userId}`);
                setEstadisticas(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener las estadísticas:', error);
                setMensaje('Error al obtener las estadísticas. Intenta de nuevo.');
            }
        };

        fetchEstadisticas();
        // eslint-disable-next-line
    }, []);

    // Preparar los datos para el gráfico
    const data = {
        labels: estadisticas.map((categoria) => categoria.descripcion),
        datasets: [
            {
                label: 'Cantidad de Registros',
                data: estadisticas.map((categoria) => categoria.cantidad),
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Estadísticas de Categorías',
            },
        },
    };

    // Renderizar el gráfico según el tipo seleccionado
    const renderGrafico = () => {
        switch (tipoGrafico) {
            case 'Bar':
                return <Bar data={data} options={options} />;
            case 'Doughnut':
                return <Doughnut data={data} options={options} />;
            case 'Line':
                return <Line data={data} options={options} />;
            default:
                return null;
        }
    };
    //-------------------------------------------------------------------------------------------------------------------------------


    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
            <h2 className="titulo">Estadísticas de Categorías</h2>

            {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}

            {/* Selector de tipo de gráfico */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label htmlFor="tipoGrafico" style={{ marginRight: '10px' }}>Seleccionar tipo de gráfico:</label>
                <select id="tipoGrafico" value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
                    <option value="Bar">Barras</option>
                    <option value="Doughnut">Dona</option>
                    <option value="Line">Líneas</option>
                </select>
            </div>

            {/* Mostrar el gráfico */}
            {estadisticas.length > 0 ? (
                <div>{renderGrafico()}</div>
            ) : (
                <p>No hay estadísticas disponibles.</p>
            )}
        </div>
    );
};

export default EstadisticasCategorias;
