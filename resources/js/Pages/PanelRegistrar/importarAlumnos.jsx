import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const ImportarAlumnos = ({ onImport, onClose }) => {
    const [file, setFile] = useState(null);
    const [alumnosExcel, setAlumnosExcel] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [mapping, setMapping] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [alumnosParaConfirmar, setAlumnosParaConfirmar] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length) {
                setFile(acceptedFiles[0]);
                readExcel(acceptedFiles[0]);
            }
        }
    });

    // En la función que lee el Excel, asegúrate de convertir correctamente:
    const readExcel = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet); // Esto debe devolver un array

            if (Array.isArray(jsonData)) {
                setAlumnosExcel(jsonData); // Guardar como array
            } else {
                console.error('Los datos del Excel no son un array:', jsonData);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleImport = async (alumnosData) => {
        try {
            // 1. Verificación extrema de los datos de entrada
            if (!alumnosData) {
                throw new Error('No se proporcionaron datos para importar');
            }

            const alumnosArray = Array.isArray(alumnosData) ? alumnosData : [alumnosData];

            console.log('Datos recibidos para importación:', alumnosArray);

            // 2. Transformación segura de datos
            const alumnosParaEnviar = alumnosArray
                .filter(alumno => alumno && typeof alumno === 'object')
                .map((alumno, index) => ({
                    Codigo: alumno.Codigo || alumno.codigo || `TEMP_${index}`,
                    Nombre: alumno.Nombre || alumno.nombre || '',
                    Apellidos: alumno.Apellidos || alumno.apellidos || '',
                    Semestre: alumno.Semestre || alumno.semestre || null,
                    Correo: alumno.Correo || alumno.correo || null,
                    Programa: alumno.Programa || alumno.programa || null,
                    EstadoCivil: alumno.EstadoCivil || alumno.estadoCivil || null,
                    Edad: alumno.Edad ? parseInt(alumno.Edad) : null,
                    Celular: alumno.Celular ? parseInt(alumno.Celular.toString().replace(/\D/g, '')) : null,
                    Sexo: alumno.Sexo || alumno.sexo || null,
                    _row: index + 2
                }));

            // 3. Validación de campos obligatorios
            const alumnosValidos = alumnosParaEnviar.filter(alumno => {
                const isValid = alumno.Codigo && alumno.Nombre && alumno.Apellidos;
                if (!isValid) {
                    console.warn(`Fila ${alumno._row}: Datos incompletos`, alumno);
                }
                return isValid;
            });

            if (alumnosValidos.length === 0) {
                throw new Error('No hay registros válidos para importar');
            }

            console.log('Datos a enviar al servidor:', { alumnos: alumnosValidos });

            // 4. Envío al servidor
            const response = await axios.post('/api/alumnos/import', {
                alumnos: alumnosValidos
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // 5. Manejo de respuesta
            if (response.data.success) {
                alert(`Importación exitosa: ${response.data.imported} alumnos registrados`);
                onClose();
            } else {
                console.error('Respuesta inesperada del servidor:', response.data);
                alert('El servidor respondió con un estado inesperado. Ver consola.');
            }

        } catch (error) {
            console.error('Detalles completos del error:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data
            });

            let errorMessage = 'Error durante la importación:\n';

            if (error.response?.data?.errors) {
                errorMessage += Object.entries(error.response.data.errors)
                    .map(([field, errors]) => `• ${field}: ${errors.join(', ')}`)
                    .join('\n');
            } else {
                errorMessage += error.message || 'Consulta la consola para más detalles';
            }

            alert(errorMessage);
        }
    };

    const prepararConfirmacion = () => {
        const alumnosArray = Array.isArray(alumnosExcel) ? alumnosExcel : [alumnosExcel];
        const alumnosParaEnviar = alumnosArray
            .filter(alumno => alumno && typeof alumno === 'object')
            .map((alumno, index) => ({
                Codigo: alumno.Codigo || alumno.codigo || `TEMP_${index}`,
                Nombre: alumno.Nombre || alumno.nombre || '',
                Apellidos: alumno.Apellidos || alumno.apellidos || '',
                Semestre: alumno.Semestre || alumno.semestre || null,
                Correo: alumno.Correo || alumno.correo || null,
                Programa: alumno.Programa || alumno.programa || null,
                EstadoCivil: alumno.EstadoCivil || alumno.estadoCivil || null,
                Edad: alumno.Edad ? parseInt(alumno.Edad) : null,
                Celular: alumno.Celular ? parseInt(alumno.Celular.toString().replace(/\D/g, '')) : null,
                Sexo: alumno.Sexo || alumno.sexo || null,
            }));

        setAlumnosParaConfirmar(alumnosParaEnviar);
        setMostrarConfirmacion(true);
    };

    return (
        <div style={styles.modal}>
            <div style={styles.content}>
                <h2>Importar Alumnos desde Excel</h2>
                <h3>Ejemplo de como tiene que estar su lista de estudiantes</h3>
                <img

                    src="/img/FormatoListaExcel.png"
                    alt="Ejemplo de formato de Excel para importar alumnos"
                    style={{ width: '100%', maxWidth: 700, margin: '16px 0', border: '1px solid #ccc', borderRadius: 8 }}
                />
                <div {...getRootProps()} style={styles.dropzone}>
                    <input {...getInputProps()} />
                    <p>Arrastra tu archivo Excel aquí o haz clic para seleccionarlo</p>
                    {file && <p>Archivo seleccionado: {file.name}</p>}
                </div>

                {previewData.length > 0 && (
                    <div style={styles.preview}>
                        <h3>Vista previa (primeras filas):</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {Object.keys(mapping).map(key => (
                                        <th key={key}>
                                            <select
                                                value={mapping[key]}
                                                onChange={(e) => setMapping({ ...mapping, [key]: parseInt(e.target.value) })}
                                            >
                                                {previewData[0].map((_, index) => (
                                                    <option key={index} value={index}>
                                                        Columna {index + 1}
                                                    </option>
                                                ))}
                                            </select>
                                            <br />{key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, i) => (
                                    <tr key={i}>
                                        {Object.values(mapping).map((colIndex, j) => (
                                            <td key={j}>{row[colIndex]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={styles.buttons}>
                    <button onClick={onClose} style={styles.cancelButton}>Cancelar</button>
                    <button
                        style={styles.importButton}
                        onClick={prepararConfirmacion}
                        className="import-button"
                    >
                        Importar Datos
                    </button>
                </div>

                {mostrarConfirmacion && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: 24,
                            borderRadius: 8,
                            width: 'auto', // Se ajusta al contenido
                            minWidth: 300,
                            maxWidth: '98vw',
                            maxHeight: '90vh',
                            overflowX: 'auto', // Scroll horizontal si la tabla es muy ancha
                            overflowY: 'auto'
                        }}>
                            <h3>¿Confirmas importar estos alumnos?</h3>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>N°</th>
                                        <th style={styles.th}>Código</th>
                                        <th style={styles.th}>Nombre</th>
                                        <th style={styles.th}>Apellidos</th>
                                        <th style={styles.th}>Semestre</th>
                                        <th style={styles.th}>Correo</th>
                                        <th style={styles.th}>Programa</th>
                                        <th style={styles.th}>Estado Civil</th>
                                        <th style={styles.th}>Edad</th>
                                        <th style={styles.th}>Celular</th>
                                        <th style={styles.th}>Sexo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnosParaConfirmar.map((al, i) => (
                                        <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                                            <td style={styles.td}>{i + 1}</td>
                                            <td style={styles.td}>{al.Codigo}</td>
                                            <td style={styles.td}>{al.Nombre}</td>
                                            <td style={styles.td}>{al.Apellidos}</td>
                                            <td style={styles.td}>{al.Semestre}</td>
                                            <td style={styles.td}>{al.Correo}</td>
                                            <td style={styles.td}>{al.Programa}</td>
                                            <td style={styles.td}>{al.EstadoCivil}</td>
                                            <td style={styles.td}>{al.Edad}</td>
                                            <td style={styles.td}>{al.Celular}</td>
                                            <td style={styles.td}>{al.Sexo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                                <button onClick={() => setMostrarConfirmacion(false)} style={styles.cancelButton}>Cancelar</button>
                                <button
                                    onClick={() => {
                                        setMostrarConfirmacion(false);
                                        handleImport(alumnosParaConfirmar);
                                    }}
                                    style={styles.importButton}
                                >
                                    Confirmar Importación
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    dropzone: {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        margin: '20px 0',
    },
    preview: {
        margin: '20px 0',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
        backgroundColor: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    th: {
        background: 'linear-gradient(90deg, #6c63ff 60%, #4e54c8 100%)',
        color: '#fff',
        padding: '5px 3px', // Más espacio
        border: '1px solid #d1d5db',
        textAlign: 'center', // Centrado
        fontWeight: 'bold',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        fontSize: '1.05rem',
        letterSpacing: '0.5px',
    },
    td: {
        padding: '1px 6px', // Más espacio
        border: '1px solid #d1d5db',
        textAlign: 'center',
        backgroundColor: '#fafbfc',
        fontSize: '1rem',
    },
    trEven: {
        backgroundColor: '#f4f6fb',
    },
    trOdd: {
        backgroundColor: '#fff',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: 'Red',
        border: 'none',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    importButton: {
        padding: '8px 16px',
        backgroundColor: 'Green',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default ImportarAlumnos;
