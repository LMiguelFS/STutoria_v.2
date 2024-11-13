import React, { useState } from 'react';
import axios from 'axios';

const Registro = () => {
  // Estados para los campos del formulario
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

  // Validación de campos
  const validateForm = () => {
    // Validar que el correo sea un correo válido
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correoInstitucional)) {
      setError('El correo institucional no es válido');
      return false;
    }

    // Validar que los nombres y apellidos no tengan números
    if (/\d/.test(nombre) || /\d/.test(apellidos)) {
      setError('Los nombres y apellidos no deben contener números');
      return false;
    }

    // Validar que la edad sea un número y positivo
    if (isNaN(edad) || edad <= 0) {
      setError('La edad debe ser un número positivo');
      return false;
    }

    // Validar que el celular contenga solo números
    if (isNaN(celular) || celular.length < 9) {
      setError('El celular debe ser un número válido con al menos 9 dígitos');
      return false;
    }

    // Validar que el sexo sea M o F
    if (sexo !== 'M' && sexo !== 'F') {
      setError('Sexo debe ser M o F');
      return false;
    }

    return true;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Crear un objeto con los datos que se enviarán al backend
    const data = {
      codigo_alumno: codigoAlumno,
      correo_institucional: correoInstitucional,
      nombre,
      apellidos,
      programa_estudios: programaEstudios,
      semestre,
      estado_civil: estadoCivil,
      edad: parseInt(edad), // Convierte a entero
      celular: parseInt(celular), // Convierte a entero
      sexo,
    };

    try {
      // Hacer el POST a tu API
      const response = await axios.post('http://localhost:8000/api/alumno', data);

      if (response.status === 200) {
        alert('Registro exitoso');
        // Limpiar los campos después de un registro exitoso
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
      // En caso de error, mostrar el mensaje
      setError('Hubo un error al registrar los datos');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Formulario de Registro</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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
        <div style={styles.inputGroup}>
          <label>Programa de Estudios:</label>
          <input
            type="text"
            value={programaEstudios}
            onChange={(e) => setProgramaEstudios(e.target.value)}
            style={styles.input}
          />
        </div>
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

// Estilos en objeto JS
const styles = {
  container: {
    backgroundColor: '#E0BBE4', // Fondo morado claro
    padding: '20px',
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    backgroundColor: '#6A0DAD', // Botón morado oscuro
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

export default Registro;
