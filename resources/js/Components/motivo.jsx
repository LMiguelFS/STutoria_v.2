import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Motivo = () => {
  const [tipoMotivo, setTipoMotivo] = useState('');
  const [motivos, setMotivos] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedMotivo, setSelectedMotivo] = useState(null);

  // Función para manejar el envío del formulario de creación
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedMotivo) {
        // Si hay un motivo seleccionado, lo registramos (enviar a la base de datos)
        const response = await axios.post('http://127.0.0.1:8000/api/motivo', {
          tipo_motivo: selectedMotivo.tipo_motivo,
        });
        setMessage(`Motivo "${selectedMotivo.tipo_motivo}" registrado exitosamente.`);
      } else if (tipoMotivo) {
        // Si no hay un motivo seleccionado, se crea uno nuevo
        const response = await axios.post('http://127.0.0.1:8000/api/motivo', {
          tipo_motivo: tipoMotivo,
        });
        setMessage(response.data.message); // Mensaje de éxito
        setMotivos([...motivos, response.data.motivo]); // Añadir el nuevo motivo a la lista
        setTipoMotivo(''); // Limpiar el campo de texto
      }
    } catch (error) {
      setMessage('Error al crear o seleccionar el motivo');
      console.error(error);
    }
  };

  // Función para obtener los motivos existentes
  const fetchMotivos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/motivo');
      setMotivos(response.data);
    } catch (error) {
      console.error('Error al obtener los motivos:', error);
    }
  };

  // Llamada a la API para obtener los motivos cuando el componente se monta
  useEffect(() => {
    fetchMotivos();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Crear o Seleccionar un Motivo</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.optionContainer}>
          <h3>Seleccionar un motivo existente:</h3>
          <select
            value={selectedMotivo ? selectedMotivo.id_motivo : ''}
            onChange={(e) => {
              const motivo = motivos.find((m) => m.id_motivo === parseInt(e.target.value));
              setSelectedMotivo(motivo);
            }}
            style={styles.select}
          >
            <option value="">-- Elige un motivo --</option>
            {motivos.map((motivo) => (
              <option key={motivo.id_motivo} value={motivo.id_motivo}>
                {motivo.tipo_motivo}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.optionContainer}>
          <h3>O crear un nuevo motivo:</h3>
          <input
            type="text"
            id="tipoMotivo"
            value={tipoMotivo}
            onChange={(e) => setTipoMotivo(e.target.value)}
            style={styles.input}
            required={!selectedMotivo}
            disabled={selectedMotivo}
          />
        </div>

        <button type="submit" style={styles.button}>
          {selectedMotivo ? 'Registrar Motivo Seleccionado' : 'Crear Motivo'}
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  message: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
  },
};

export default Motivo;
