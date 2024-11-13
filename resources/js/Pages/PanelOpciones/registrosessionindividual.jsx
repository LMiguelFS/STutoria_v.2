import React, { useState } from 'react';
import axios from 'axios';

const RegistroAtencionIndividual = () => {
    // Form states
    const [fechaAtencion, setFechaAtencion] = useState('');
    const [numeroAtencion, setNumeroAtencion] = useState('');
    const [descripcionConsulta, setDescripcionConsulta] = useState('');
    const [acuerdosEstablecidos, setAcuerdosEstablecidos] = useState('');
    const [proximaCita, setProximaCita] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [idUser, setIdUser] = useState('');
    const [codigoAlumno, setCodigoAlumno] = useState('');
    const [idMotivo, setIdMotivo] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form validation
    const validateForm = () => {
        if (!fechaAtencion || !numeroAtencion || !codigoAlumno || !idMotivo) {
            setError('Todos los campos son obligatorios');
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = {
            fecha_atencion: fechaAtencion,
            numero_atencion: numeroAtencion,
            descripcion_consulta: descripcionConsulta,
            acuerdos_establecidos: acuerdosEstablecidos,
            proxima_cita: proximaCita,
            observaciones: observaciones,
            id_user: idUser,
            codigo_alumno: codigoAlumno,
            id_motivo: idMotivo,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/atencionindividual', data);

            if (response.status === 201) {
                setSuccess('Registro exitoso');
                setFechaAtencion('');
                setNumeroAtencion('');
                setDescripcionConsulta('');
                setAcuerdosEstablecidos('');
                setProximaCita('');
                setObservaciones('');
                setIdUser('');
                setCodigoAlumno('');
                setIdMotivo('');
            }
        } catch (error) {
            setError('Hubo un error al registrar los datos');
        }
    };

    // Cierra el mensaje de éxito o error
    const handleCloseMessage = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div style={styles.container}>

            <h2>Formulario de Registro de Atención Individual</h2>
            {/* Mensaje de error */}
            {error && (
                <div style={styles.messageContainer}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button onClick={handleCloseMessage} style={styles.closeButton}>Cerrar</button>
                </div>
            )}
            {/* Mensaje de éxito */}
            {success && (
                <div style={styles.messageContainer}>
                    <p style={{ color: 'green' }}>{success}</p>
                    <button onClick={handleCloseMessage} style={styles.closeButton}>Cerrar</button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label>Fecha de Atención:</label>
                        <input
                            type="date"
                            value={fechaAtencion}
                            onChange={(e) => setFechaAtencion(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Número de Atención:</label>
                        <input
                            type="number"
                            value={numeroAtencion}
                            onChange={(e) => setNumeroAtencion(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.inputGroupFull}>
                    <label>Descripción de la Consulta:</label>
                    <textarea
                        value={descripcionConsulta}
                        onChange={(e) => setDescripcionConsulta(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroupFull}>
                    <label>Acuerdos Establecidos:</label>
                    <textarea
                        value={acuerdosEstablecidos}
                        onChange={(e) => setAcuerdosEstablecidos(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label>Próxima Cita:</label>
                        <input
                            type="date"
                            value={proximaCita}
                            onChange={(e) => setProximaCita(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Observaciones:</label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label>Usuario:</label>
                        <input
                            type="number"
                            value={idUser}
                            onChange={(e) => setIdUser(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Código Alumno:</label>
                        <input
                            type="text"
                            value={codigoAlumno}
                            onChange={(e) => setCodigoAlumno(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.inputGroupFull}>
                    <label>Motivo:</label>
                    <textarea
                        value={idMotivo}
                        onChange={(e) => setIdMotivo(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Registrar</button>
                {/* Mensaje de éxito */}
                {success && (
                    <div style={styles.messageContainer}>
                        <p style={{ color: 'green' }}>{success}</p>
                        <button onClick={handleCloseMessage} style={styles.closeButton}>Cerrar</button>
                    </div>
                )}
            </form>
        </div>
    );
};

// Styles
const styles = {
    container: {
        backgroundColor: '#E0BBE4',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '1000px',
        maxHeight: '600px', // Limita la altura del contenedor
        overflowY: 'auto',  // Activa la barra de desplazamiento vertical si es necesario,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    inputGroup: {
        marginBottom: '15px',
        width: '48%', // Side-by-side alignment
    },
    inputGroupFull: {
        marginBottom: '15px',
        width: '100%',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        backgroundColor: '#6A0DAD',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '50%',
        marginTop: '20px',
    }
};

export default RegistroAtencionIndividual;
