import React, { useState, useEffect, useCallback } from 'react';
import '../../../css/ModalRegistro.css'; // Estilos separados opcionales
import axios from 'axios';
import QRCode from "react-qr-code";
import ListaEstudiantesSesion from './ListaEstudiantesSesion';
//-------------------------------------------
import { usePage } from '@inertiajs/react';
//-------------------------------------------

const RegistroGrupal = ({ onClose }) => {
    const [asistencias, setAsistencias] = useState({});
    const [recargarTrigger, setRecargarTrigger] = useState(false);
    //------------------------------------------------
    const { auth } = usePage().props;
    //------------------------------------------------
    const [formData, setFormData] = useState({
        user_id: "",
        Fecha: '',
        Tema: '',
        Nro_session: '',
        ResultadoEsperado: '',
        ComentarioSignificativo: '',
        NroEstudiantesVarones: 0,
        NroEstudiantesMujeres: 0,
        CumplimientoObjetivo: 'SI',
        InteresDelTema: 'SI',
        ParticipacionAlumnos: 'SI',
        AclaracionDudas: 'SI',
        ReprogramacionDelTema: 'SI',
        Ciclo: '',
        AnimacionMotivacion: '',
        ApropiacionDesarrollo: '',
        TransferenciaPracticaCompromiso: '',
        Evaluacion: '',
        email: auth.user.email,
    });
    const [codigosEstudiantes, setCodigosEstudiantes] = useState([]);

    // Función para contar por sexo
    const contarPorSexo = useCallback(async (codigos) => {
        if (!codigos || codigos.length === 0) {
            setFormData(prev => ({
                ...prev,
                NroEstudiantesVarones: 0,
                NroEstudiantesMujeres: 0
            }));
            return;
        }

        try {
            const response = await axios.post('/api/estudiantes/contar-sexo', {
                codigos: codigos
            });

            // Verifica la estructura de la respuesta
            console.log("Respuesta del conteo:", response.data);

            setFormData(prev => ({
                ...prev,
                NroEstudiantesVarones: response.data.data?.varones || 0,
                NroEstudiantesMujeres: response.data.data?.mujeres || 0
            }));
        } catch (error) {
            console.error("Error al contar por sexo:", error);
        }
    }, []);

    // Cuando cambian los códigos de estudiantes
    const handleCodigosChange = useCallback((codigos) => {
        console.log("Códigos recibidos:", codigos);
        contarPorSexo(codigos);
    }, [contarPorSexo]);

    const handleConteoChange = (conteo) => {
        setFormData(prev => ({
            ...prev,
            NroEstudiantesVarones: conteo.varones,
            NroEstudiantesMujeres: conteo.mujeres
        }));
    };

    // Obtener el ID del usuario basado en el correo electrónico
    const fetchUsuarioId = async () => {
        try {
            const response = await axios.post(`/api/recuperar-id?email=${formData.email}`);
            if (response.data && response.data.id) {
                setFormData((prev) => ({ ...prev, user_id: response.data.id }));
                fetchNroSession(response.data.id);
            } else {
                setMensaje('No se pudo encontrar el ID del usuario.');
            }
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
            setMensaje('Error al obtener el ID del usuario. Intenta de nuevo.');
        }
    };

    // Estado para manejar la lista de alumnos y su asistencia
    const [alumnos, setAlumnos] = useState([]);
    const [asistencia, setAsistencia] = useState({});
    const [mostrarOpcionales, setMostrarOpcionales] = useState(false);
    const [codigoAsistencia, setCodigoAsistencia] = useState('');
    const [uuidAsistencia, setUuidAsistencia] = useState('');
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrCountdown, setQrCountdown] = useState(900); // 15 minutos en segundos

    const fetchNroSession = async (userId) => {
        try {
            const response = await axios.get(`/api/registrogrupals/count?user_id=${userId}`);
            const nroSession = (response.data.count || 0) + 1;
            setFormData((prev) => ({ ...prev, Nro_session: nroSession }));
        } catch (error) {
            console.error('Error al obtener el número de sesiones', error);
        }
    };

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const localDate = `${yyyy}-${mm}-${dd}`;
        setFormData((prev) => ({ ...prev, Fecha: localDate }));
        fetchUsuarioId();
        fetchCodigoAsistencia();
    }, []);

    // Contador regresivo para el QR
    useEffect(() => {
        if (qrCountdown <= 0) return;
        const timer = setInterval(() => {
            setQrCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [qrCountdown]);

    // Manejar cambios en la lista de asistencia
    const handleAsistenciaChange = (codigo_alumno) => {
        setAsistencia((prevAsistencia) => ({
            ...prevAsistencia,
            [codigo_alumno]: !prevAsistencia[codigo_alumno],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Convertir asistencias al formato correcto
            const asistenciasFormateadas = Object.keys(asistencias).map(codigo => ({
                codigo_alumno: codigo,
                estado: asistencias[codigo] ? 1 : 0
            }));

            // 2. Preparar los datos numéricos
            const datosParaEnviar = {
                ...formData,
                user_id: parseInt(formData.user_id),
                NroEstudiantesVarones: parseInt(formData.NroEstudiantesVarones) || 0,
                NroEstudiantesMujeres: parseInt(formData.NroEstudiantesMujeres) || 0,
                Nro_session: parseInt(formData.Nro_session),
                asistencias: asistenciasFormateadas
            };

            // 3. Validar que hay asistencias
            if (asistenciasFormateadas.length === 0) {
                throw new Error("Debe registrar al menos un estudiante");
            }

            console.log("Datos finales a enviar:", JSON.stringify(datosParaEnviar, null, 2));

            // 4. Enviar con el header Content-Type correcto
            const response = await axios.post('/api/asistencia', datosParaEnviar, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert('¡Registro exitoso!');
            if (onClose) onClose();
        } catch (error) {
            console.error('Error completo:', {
                message: error.message,
                response: error.response?.data,
                requestData: error.config?.data
            });
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const fetchCodigoAsistencia = async () => {
        try {
            const response = await axios.get('/api/generar-codigo-asistencia');
            setCodigoAsistencia(response.data.codigo);
            setUuidAsistencia(response.data.uuid);
        } catch (error) {
            console.error('Error al generar el código de asistencia', error);
        }
    };

    // Formatea el tiempo mm:ss
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    //------------------------------------------------
    const handleAsistenciasChange = (nuevasAsistencias) => {
        setAsistencias(nuevasAsistencias);
    };

    return (
        <div style={styles.container}>

            <div>
                <h2 className='titulo'>Registrar Atención Grupal</h2>
                <form onSubmit={handleSubmit}>

                    <div className="panel-promo" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',
                        marginBottom: '24px',
                        width: '100%',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <label>Fecha:</label>
                            <input type="date" name="Fecha" value={formData.Fecha} readOnly />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <label>N° de Sesión:</label>
                            <input type="number" name="Nro_session" value={formData.Nro_session} onChange={handleChange} readOnly />
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        width: '100%',
                    }}>
                        <div className="form-group">
                            <label>Tema:</label>
                            <input type="text" name="Tema" value={formData.Tema} onChange={handleChange} required />
                        </div>

                        <div className='form-group'>
                            <label>Resultado Esperado:</label>
                            <input type="text" name="ResultadoEsperado" value={formData.ResultadoEsperado} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginBottom: '24px',
                        width: '100%',
                    }}>
                        <label>Comentario Significativo:</label>
                        <textarea name="ComentarioSignificativo" value={formData.ComentarioSignificativo} onChange={handleChange} required />
                    </div>


                    <div className="form-group-row">
                        <div className='form-group'>
                            <label>N° Estudiantes Varones:</label>
                            <input
                                type="number"
                                name="NroEstudiantesVarones"
                                value={formData.NroEstudiantesVarones}
                                readOnly
                                className="contador-automatico"
                            />
                        </div>

                        <div className='form-group'>
                            <label>N° Estudiantes Mujeres:</label>
                            <input
                                type="number"
                                name="NroEstudiantesMujeres"
                                value={formData.NroEstudiantesMujeres}
                                readOnly
                                className="contador-automatico"
                            />
                        </div>
                    </div>


                    <div className="panel-promo">
                        <div className="form-group-row">
                            <div className='form-group'>
                                <label>Cumplimiento Objetivo:</label>
                                <select name="CumplimientoObjetivo" value={formData.CumplimientoObjetivo} onChange={handleChange} required>
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Interés del Tema:</label>
                                <select name="InteresDelTema" value={formData.InteresDelTema} onChange={handleChange} required>
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group-row">
                            <div className='form-group'>
                                <label>Participación Alumnos:</label>
                                <select name="ParticipacionAlumnos" value={formData.ParticipacionAlumnos} onChange={handleChange} required>
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Aclaración de Dudas:</label>
                                <select name="AclaracionDudas" value={formData.AclaracionDudas} onChange={handleChange} required>
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </select>
                            </div>
                        </div>

                        <div className='form-group'>
                            <label>Reprogramación del Tema:</label>
                            <select name="ReprogramacionDelTema" value={formData.ReprogramacionDelTema} onChange={handleChange} required>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                    </div>


                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        width: '100%',
                    }}>
                        <div className='form-group'>
                            <label>Ciclo:</label>
                            <select name="Ciclo" value={formData.Ciclo} onChange={handleChange} required>
                                <option value="">Seleccione</option>
                                <option value="1er">1er</option>
                                <option value="2do">2do</option>
                                <option value="3er">3er</option>
                                <option value="4to">4to</option>
                                <option value="5to">5to</option>
                                <option value="6to">6to</option>
                            </select>
                        </div>


                        {/* Botón para mostrar/ocultar campos opcionales */}
                        <button
                            type="button"
                            className="submit-btn"
                            style={{ marginBottom: '10px', background: '#e0e0e0', color: '#333' }}
                            onClick={() => setMostrarOpcionales((prev) => !prev)}
                        >
                            {mostrarOpcionales ? 'Ocultar campos opcionales' : 'Llenar más campos opcional'}
                        </button>
                    </div>


                    {/* Campos opcionales */}
                    {mostrarOpcionales && (
                        <>
                            <div className='form-group' style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '24px',
                                width: '100%',
                            }}>
                                <label>Animación / Motivación:</label>
                                <textarea name="AnimacionMotivacion" value={formData.AnimacionMotivacion} onChange={handleChange} />
                            </div>

                            <div className='form-group' style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '24px',
                                width: '100%',
                            }}>
                                <label>Apropiación / Desarrollo:</label>
                                <textarea name="ApropiacionDesarrollo" value={formData.ApropiacionDesarrollo} onChange={handleChange} />
                            </div>

                            <div className='form-group' style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '24px',
                                width: '100%',
                            }}>
                                <label>Transferencia / Compromiso:</label>
                                <textarea name="TransferenciaPracticaCompromiso" value={formData.TransferenciaPracticaCompromiso} onChange={handleChange} />
                            </div>

                            <div className='form-group' style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '24px',
                                width: '100%',
                            }}>
                                <label>Evaluación:</label>
                                <textarea name="Evaluacion" value={formData.Evaluacion} onChange={handleChange} />
                            </div>
                        </>
                    )}

                    <button type="submit" className="submit-btn">Registrar</button>
                </form>


            </div>
            <div style={styles.studentList}>
                {/* Columna 2 - Lista de estudiantes */}

                {codigoAsistencia && (
                    <div className="my-4 text-center">
                        <p>Escanea este código o ingresa el código manualmente:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <QRCode value={codigoAsistencia} size={200} />
                            <p className="mt-2 font-mono text-2xl" style={{ fontSize: 28, margin: '16px 0 8px 0' }}>
                                {codigoAsistencia}
                            </p>
                            <p style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>
                                Tiempo restante: {formatTime(qrCountdown)}
                            </p>

                        </div>
                        <button
                            className="btn btn-secondary"
                            style={{ marginTop: 12 }}
                            onClick={() => {
                                setShowQrModal(true);
                            }}
                        >
                            Ampliar QR y Código
                        </button>

                        <ListaEstudiantesSesion
                            codigoAsistencia={codigoAsistencia}
                            recargarTrigger={recargarTrigger}
                            onAsistenciasChange={handleAsistenciasChange}
                            onConteoChange={handleConteoChange}
                            onCodigosChange={handleCodigosChange}
                        />
                    </div>
                )}
            </div>

            {/* Modal para ampliar QR */}
            {showQrModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: '#fff', padding: 40, borderRadius: 16, textAlign: 'center', position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowQrModal(false)}
                            style={{
                                position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer'
                            }}
                        >❌</button>
                        <h2>Código de Asistencia</h2>
                        <QRCode value={codigoAsistencia} size={400} />
                        <p style={{ fontSize: 32, margin: '20px 0', fontFamily: 'monospace' }}>{codigoAsistencia}</p>
                        <p style={{ fontSize: 18, color: '#555' }}>
                            Tiempo restante: {formatTime(qrCountdown)}
                        </p>
                        {qrCountdown <= 0 && (
                            <p style={{ color: 'red', marginTop: 10 }}>El código ha expirado.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#D8BFD8',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '1000px', // Aumenta el ancho
        margin: '0 auto',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        maxHeight: '600px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr', // Dos columnas (formulario | lista)
        gap: '20px'
    },
    studentList: {
        gridColumn: '2', // Coloca en la segunda columna
        backgroundColor: '#f0f0f0',
        padding: '15px',
        borderRadius: '8px',
        height: 'fit-content',
        position: 'sticky',
        top: '20px'
    },
    studentItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        padding: '5px',
        borderBottom: '1px solid #ddd'
    }
}
export default RegistroGrupal;
