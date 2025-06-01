import React, { useState } from 'react';
import axios from 'axios';
import ImportarAlumnos from './importarAlumnos';

const Registro = ({ onClose }) => {
    const [showImportModal, setShowImportModal] = useState(false);
    const [codigoAlumno, setCodigoAlumno] = useState('');
    const [correoInstitucional, setCorreoInstitucional] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [programaEstudios, setProgramaEstudios] = useState('');
    const [semestre, setSemestre] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [edad, setEdad] = useState('');
    const [celular, setCelular] = useState('');
    const [sexo, setSexo] = useState('');
    const [error, setError] = useState(null);

    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(correoInstitucional)) {
            setError('El correo institucional no es válido');
            return false;
        }

        if (/\d/.test(nombre) || /\d/.test(apellidos)) {
            alert('Los nombres y apellidos no deben contener números');
            return false;
        }

        if (isNaN(edad) || edad <= 0) {
            alert('La edad debe ser un número positivo');
            return false;
        }

        if (isNaN(celular) || celular.length < 9) {
            alert('El celular debe ser un número válido con al menos 9 dígitos');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = {
            codigo_alumno: codigoAlumno,
            correo_institucional: correoInstitucional,
            nombre,
            apellidos,
            programa_estudios: programaEstudios,
            semestre,
            estado_civil: estadoCivil,
            edad: parseInt(edad),
            celular: parseInt(celular),
            sexo,
        };

        try {
            const response = await axios.post('/api/alumno', data);
            if (response.status === 200) {
                alert('Registro exitoso');
                if (onClose) onClose();
                return;
            }
        } catch (error) {
            setError('Hubo un error al registrar los datos');
        }
    };

    const handleImport = async (alumnos) => {
        try {
            // Enviar todos los alumnos al backend
            const response = await axios.post('/api/alumnos/import', { alumnos });

            if (response.data.success) {
                alert(`Se importaron ${alumnos.length} alumnos correctamente`);
                if (onClose) onClose();
            }
        } catch (error) {
            alert('Error al importar alumnos: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 className='titulo'>Formulario de Registro</h2>
                <button
                    onClick={() => setShowImportModal(true)}
                    style={styles.importButton}
                >
                    Importar desde Excel
                </button>
            </div>

            {showImportModal && (
                <ImportarAlumnos
                    onImport={handleImport}
                    onClose={() => setShowImportModal(false)}
                />
            )}

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
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

                <div style={styles.inputGroup}>
                    <label>Correo Institucional:</label>
                    <input
                        type="email"
                        value={correoInstitucional}
                        onChange={(e) => setCorreoInstitucional(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Apellidos:</label>
                        <input
                            type="text"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label>Programa de Estudios:</label>
                    <select
                        value={programaEstudios}
                        onChange={(e) => setProgramaEstudios(e.target.value)}
                        style={styles.input}
                        required
                    >
                        <option value="">Seleccione...</option>
                        <option value="DSI">DSI</option>
                        <option value="ASH">ASH</option>
                        <option value="CO">CO</option>
                        <option value="EA">EA</option>
                        <option value="EN">EN</option>
                        <option value="MA">MA</option>
                        <option value="MP">MP</option>
                        <option value="GOT">GOT</option>
                        <option value="EI">EI</option>
                        <option value="TLC">TLC</option>
                    </select>
                </div>

                <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                        <label>Semestre:</label>
                        <select
                            value={semestre}
                            onChange={(e) => setSemestre(e.target.value)}
                            style={styles.input}
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="1er">1er</option>
                            <option value="2do">2do</option>
                            <option value="3ro">3ro</option>
                            <option value="4to">4to</option>
                            <option value="5to">5to</option>
                            <option value="6to">6to</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Estado Civil:</label>
                        <select
                            value={estadoCivil}
                            onChange={(e) => setEstadoCivil(e.target.value)}
                            style={styles.input}
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="soltero">Soltero</option>
                            <option value="casado">Casado</option>
                            <option value="divorciado">Divorciado</option>
                            <option value="viudo">Viudo</option>
                        </select>
                    </div>
                </div>

                <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                        <label>Edad:</label>
                        <input
                            type="number"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Celular:</label>
                        <input
                            type="tel"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label>Sexo:</label>
                    <select
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                        style={styles.input}
                        required
                    >
                        <option value="">Seleccione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>

                <button type="submit" style={styles.button}>Registrar</button>
            </form>
        </div >
    );
};

const styles = {
    container: {
        backgroundColor: '#D8BFD8',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        maxHeight: '600px',
    },
    title: {
        color: '#4B0082',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputRow: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    inputGroup: {
        width: '100%',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #CCC',
    },
    button: {
        backgroundColor: '#6A0DAD',
        color: '#FFF',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
        fontSize: '16px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    importButton: {
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Registro;
