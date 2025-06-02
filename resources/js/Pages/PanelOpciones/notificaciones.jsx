import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../../../css/RegistroGrupalList.css';
import 'react-calendar/dist/Calendar.css';
import { FaFilter, FaWhatsapp } from 'react-icons/fa';
import { usePage } from '@inertiajs/react';

const Notificaciones = () => {
    const { auth } = usePage().props;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredResults, setFilteredResults] = useState([]);
    const [customMessage, setCustomMessage] = useState('¡Hola! Le recordamos que tiene una cita de tutoría individual, el día de mañana.');
    const [userId, setUserId] = useState(null);

    // Obtener el userId al cargar el componente
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userResponse = await axios.post(`/api/recuperar-id?email=${auth.user.email}`);
                setUserId(userResponse.data.id);
            } catch (error) {
                alert('Error al obtener el ID del usuario');
                console.error(error);
            }
        };
        fetchUserId();
    }, [auth.user.email]);

    // Cargar datos iniciales cuando ya se tiene el userId
    useEffect(() => {
        if (!userId) return;
        fetchFilteredData(selectedDate.toISOString().split('T')[0]);
        // eslint-disable-next-line
    }, [userId]);

    // Función para obtener atenciones filtradas
    const fetchFilteredData = async (fecha) => {
        if (!userId) return;
        try {
            let url = `/api/atenciones/proxima-cita?id_user=${userId}`;
            if (fecha) {
                url += `&fecha=${fecha}`;
            }
            const response = await axios.get(url);
            setFilteredResults(response.data);
        } catch (error) {
            console.error('Error al obtener los datos filtrados:', error);
        }
    };

    const enviarNotificacion = (celular) => {
        if (!celular) {
            console.error('Número de celular no válido:', celular);
            return;
        }
        const celularString = String(celular);
        const codigoPais = '+51';
        const numeroConCodigo = celularString.startsWith('+')
            ? celularString
            : `${codigoPais}${celularString}`;
        const mensaje = encodeURIComponent(customMessage);
        const numeroSinEspacios = numeroConCodigo.replace(/\s+/g, '');
        const url = `https://wa.me/${numeroSinEspacios}?text=${mensaje}`;
        try {
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al intentar abrir la URL:', error);
        }
    };

    return (
        <div
            className="filter-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                className="calendar-filter-container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                }}
            >
                <div className="calendar-container">
                    <Calendar onChange={setSelectedDate} value={selectedDate} />
                </div>
                <button
                    onClick={() => fetchFilteredData(selectedDate.toISOString().split('T')[0])}
                    className="btn-filtrar"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    <FaFilter /> Filtrar por Fecha
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                    <h3
                        htmlFor="mensaje"
                        style={{
                            fontSize: '17px',
                            fontWeight: 'bold',
                            color: '#333',
                        }}
                    >
                        Coloque el mensaje que quiera enviar:
                    </h3>
                    <textarea
                        id="mensaje"
                        placeholder="Escriba el mensaje aquí..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        style={{
                            width: '300px',
                            height: '80px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            resize: 'none',
                        }}
                    ></textarea>
                </div>
            </div>

            <div style={styles.container} >
                <h3>Resultados:</h3>
                {filteredResults.length > 0 ? (
                    <table className="tabla" style={{ margin: '0 auto' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Código Alumno</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Descripción</th>
                                <th>Observaciones</th>
                                <th>Celular</th>
                                <th>Enviar Notificación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((result) => (
                                <tr key={result.id}>
                                    <td>{result.id}</td>
                                    <td>{result.codigo_alumno}</td>
                                    <td>{result.nombre}</td>
                                    <td>{result.apellidos}</td>
                                    <td>{result.descripcion_consulta}</td>
                                    <td>{result.observaciones}</td>
                                    <td>{result.celular}</td>
                                    <td>
                                        <button
                                            onClick={() => enviarNotificacion(result.celular)}
                                            className="btn-notificacion"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                backgroundColor: '#28a745',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 15px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <FaWhatsapp /> Enviar Notificación
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay resultados para la fecha seleccionada.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#D8BFD8',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        maxHeight: '200px',
    },
}

export default Notificaciones;
