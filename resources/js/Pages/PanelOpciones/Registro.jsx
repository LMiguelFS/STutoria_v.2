import React, { useState } from 'react';
import axios from 'axios';

const Registro = () => {
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
            setError('Los nombres y apellidos no deben contener números');
            return false;
        }

        if (isNaN(edad) || edad <= 0) {
            setError('La edad debe ser un número positivo');
            return false;
        }

        if (isNaN(celular) || celular.length < 9) {
            setError('El celular debe ser un número válido con al menos 9 dígitos');
            return false;
        }

        if (sexo !== 'M' && sexo !== 'F') {
            setError('Sexo debe ser M o F');
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
            const response = await axios.post('http://localhost:8000/api/alumno', data);
            if (response.status === 200) {
                alert('Registro exitoso');
                setCodigoAlumno('');
                setCorreoInstitucional('');
                setNombre('');
                setApellidos('');
                setProgramaEstudios('');
                setSemestre('');
                setEstadoCivil('');
                setEdad('');
                setCelular('');
                setSexo('');
            }
        } catch (error) {
            setError('Hubo un error al registrar los datos');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Formulario de Registro</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputRow}>
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
                    <input
                        type="text"
                        value={programaEstudios}
                        onChange={(e) => setProgramaEstudios(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                        <label>Semestre:</label>
                        <input
                            type="text"
                            value={semestre}
                            onChange={(e) => setSemestre(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Estado Civil:</label>
                        <select
                            value={estadoCivil}
                            onChange={(e) => setEstadoCivil(e.target.value)}
                            style={styles.input}
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
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Celular:</label>
                        <input
                            type="tel"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label>Sexo:</label>
                    <select
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                        style={styles.input}
                    >
                        <option value="">Seleccione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>

                <button type="submit" style={styles.button}>Registrar</button>
            </form>
        </div>
    );
};

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
    inputRow: {
        display: 'flex',
        gap: '20px',
        width: '100%',
        justifyContent: 'space-between',
    },
    inputGroup: {
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
    },
};

export default Registro;
