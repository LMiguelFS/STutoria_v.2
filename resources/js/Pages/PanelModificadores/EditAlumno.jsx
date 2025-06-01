import React, { useState } from 'react';
import axios from 'axios';
import "../../../css/RegistroGrupalList.css";

const editAlumno = () => {
    const [codigo_alumno, setcodigo_alumno] = useState('');
    const [nombre, setNombre] = useState('');
    const [semestre, setSemestre] = useState('');
    const [error, setError] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Estado para el modo de edición
    const [selectedStudent, setSelectedStudent] = useState(null); // Estado para el estudiante seleccionado

    const buscarEstudiantes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/alumno', {
                params: { codigo_alumno, nombre, semestre }
            });
            setEstudiantes(response.data);
        } catch (error) {
            setError('Hubo un error al obtener los estudiantes');
        }
    };

    const handleEdit = (student) => {
        setSelectedStudent(student); // Carga el estudiante seleccionado
        setIsEditing(true); // Activa el modo de edición
    };

    const handleCancelEdit = () => {
        setSelectedStudent(null); // Limpia el estudiante seleccionado
        setIsEditing(false); // Desactiva el modo de edición
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8000/api/alumno/${selectedStudent.codigo_alumno}`, selectedStudent);
            setIsEditing(false); // Salir del modo de edición
            buscarEstudiantes(); // Actualiza la lista de estudiantes
        } catch (error) {
            setError('Hubo un error al actualizar el estudiante');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedStudent({ ...selectedStudent, [name]: value });
    };

    return (
        <div >
            <h2 style={styles.title}>Consulta de Estudiantes</h2>
            {error && <p style={styles.error}>{error}</p>}

            {isEditing ? (
                <div style={styles.container} >
                    <h3>Modificar Estudiante</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <label>Código Alumno:</label>
                        <input
                            type="text"
                            name="codigo_alumno"
                            value={selectedStudent.codigo_alumno}
                            onChange={handleInputChange}
                            disabled
                            style={styles.input}
                        />
                        <label>Correo Institucional:</label>
                        <input
                            type="email" // Cambié el tipo de correo a email
                            name="correo_institucional"
                            value={selectedStudent.correo_institucional} // Asegúrate de manejar el caso en que 'correo' sea null o undefined
                            onChange={handleInputChange}
                            style={styles.input}
                        />

                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={selectedStudent.nombre}
                            onChange={handleInputChange}
                            style={styles.input}
                        />

                        <label>Apellidos:</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={selectedStudent.apellidos}
                            onChange={handleInputChange}
                            style={styles.input}
                        />


                        <label>Programa de Estudios:</label>
                        <select
                            name='programa_estudios'
                            value={selectedStudent.programa_estudios}
                            onChange={handleInputChange}
                            style={styles.input}
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



                        <label>Semestre:</label>
                        <select
                            name="semestre"
                            value={selectedStudent.semestre}
                            onChange={handleInputChange}
                            style={styles.input}
                        >
                            <option value="">Seleccione...</option>
                            <option value="1er">1er</option>
                            <option value="2do">2do</option>
                            <option value="3ro">3ro</option>
                            <option value="4to">4to</option>
                            <option value="5to">5to</option>
                            <option value="6to">6to</option>
                        </select>

                        <label>Estado Civil:</label>
                        <select
                            name='estado_civil'
                            value={selectedStudent.estado_civil}
                            onChange={handleInputChange}
                            style={styles.input}
                        >
                            <option value="">Seleccione...</option>
                            <option value="soltero">Soltero(a)</option>
                            <option value="casado">Casado(a)</option>
                            <option value="divorciado">Divorciado(a)</option>
                            <option value="viudo">Viudo(a)</option>
                        </select>
                        <label>Edad:</label>
                        <input
                            type="number"
                            name='edad'
                            value={selectedStudent.edad}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        <label>Celular:</label>
                        <input
                            type="tel"
                            name='celular'
                            value={selectedStudent.celular}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        <label>Sexo:</label>
                        <select
                            name='sexo'
                            value={selectedStudent.sexo}
                            onChange={handleInputChange}
                            style={styles.input}
                        >
                            <option value="">Seleccione...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>

                        <button type="submit" style={styles.button}>Guardar Cambios</button>
                        <button type="button" onClick={handleCancelEdit} style={styles.button}>
                            Cancelar
                        </button>
                    </form>
                </div>
            ) : (
                <>
                    <form onSubmit={(e) => { e.preventDefault(); buscarEstudiantes(); }} style={styles.form}>
                        <div style={styles.inputRow}>
                            <input
                                type="text"
                                placeholder="Código Alumno"
                                value={codigo_alumno}
                                onChange={(e) => setcodigo_alumno(e.target.value)}
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                style={styles.input}
                            />
                            <select
                                value={semestre}
                                onChange={(e) => setSemestre(e.target.value)}
                                style={styles.input}
                            >
                                <option value="">Seleccione...</option>
                                <option value="1er">1er</option>
                                <option value="2do">2do</option>
                                <option value="3ro">3ro</option>
                                <option value="4to">4to</option>
                                <option value="5to">5to</option>
                                <option value="6to">6to</option>
                            </select>
                            <button type="submit" style={styles.button}>Buscar</button>
                        </div>
                    </form>

                    <div style={styles.tableContainer}>
                        <h3>Resultados</h3>
                        <table className='tabla'>
                            <thead>
                                <tr>
                                    <th>Código Alumno</th>
                                    <th>Nombre</th>
                                    <th>Apellidos</th>
                                    <th>Semestre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.length > 0 ? (
                                    estudiantes.map((estudiante) => (
                                        <tr key={estudiante.codigo_alumno}>
                                            <td>{estudiante.codigo_alumno}</td>
                                            <td>{estudiante.nombre}</td>
                                            <td>{estudiante.apellidos}</td>
                                            <td>{estudiante.semestre}</td>
                                            <td>
                                                <button onClick={() => handleEdit(estudiante)}>Editar</button>
                                                <button onClick={() => eliminarRegistro(estudiante.codigo_alumno)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No se encontraron resultados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
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
        gap: '20px', // Asegura espacio entre los campos y el botón
        alignItems: 'center', // Alinea verticalmente los elementos
        marginBottom: '20px', // Ajusta el espacio debajo de los campos
    },
    inputGroup: {
        flex: 1, // Hace que cada campo ocupe el mismo espacio disponible
        display: 'flex',
        flexDirection: 'column', // Los labels y los inputs estarán en columna dentro de cada grupo
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
        fontSize: '16px',
        marginLeft: '10px', // Ajusta el espacio entre el último campo y el botón
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    tableContainer: {
        marginTop: '20px',
    },
};

export default editAlumno;
