import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/RegistroGrupalList.css";
//-------------------------------------------
import { usePage } from '@inertiajs/react';
//-------------------------------------------

const AtencionIndividualList = () => {
    //------------------------------------------------
    const { auth } = usePage().props;
    //------------------------------------------------
    const [filtros, setFiltros] = useState({
        fecha_atencion: "",
        codigo_alumno: "",
        numero_atencion: "",
    });
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [registroEditar, setRegistroEditar] = useState(null);
    const [formularioEdicionVisible, setFormularioEdicionVisible] = useState(false);


    const obtenerDatos = async (idUser, filtros) => {
        try {
            const response = await axios.get(`/api/atencionindividuals`, {
                params: {
                    id_user: idUser,
                    fecha_atencion: filtros.fecha_atencion || "",
                    codigo_alumno: filtros.codigo_alumno || "",
                    numero_atencion: filtros.numero_atencion || "",
                },
            });
            setDatos(response.data); // Guarda los datos en el estado
            //console.log("Datos recuperados:", response.data);
        } catch (error) {
            console.error("Error al obtener datos:");
        }
    };

    const fetchUsuarioId = async () => {
        try {
            const response = await axios.post(`/api/recuperar-id?email=${auth.user.email}`);
            if (response.data && response.data.id) {
                const idUser = response.data.id; // ID del usuario
                //console.log("ID del usuario recuperado:", idUser); // Muestra el ID en la consola
                obtenerDatos(idUser, filtros); // Llama a obtenerDatos con el ID y filtros actuales
            } else {
                //console.error('No se pudo encontrar el ID del usuario.');
            }
        } catch (error) {
            //console.error('Error al obtener el ID del usuario:', error);
        }
    };

    // Aplica filtros con el ID del usuario
    const aplicarFiltros = () => {
        fetchUsuarioId(); // Vuelve a llamar a fetchUsuarioId para refrescar los datos con los filtros actuales
    };

    // Efecto inicial para recuperar datos
    useEffect(() => {
        fetchUsuarioId(); // Carga inicial
    }, []);


    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // const aplicarFiltros = () => {
    //     obtenerDatos(true); // Aplica los filtros
    // };

    const eliminarRegistro = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            try {
                await axios.delete(`/api/atencionindividuals/${id}`);
                obtenerDatos(); // Recarga los datos después de eliminar
            } catch (error) {
                console.error("Error al eliminar el registro:");
            }
        }
    };

    const editarRegistro = (id) => {
        const registro = datos.find((item) => item.id === id);
        setRegistroEditar(registro); // Establecer el registro a editar
        setFormularioEdicionVisible(true); // Mostrar formulario de edición
    };

    const manejarCambioEdicion = (e) => {
        const { name, value } = e.target;
        setRegistroEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [editLoading, setEditLoading] = useState(false);

    const guardarEdicion = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            await axios.put(
                `api/atencionindividuals/${registroEditar.id}`,
                registroEditar
            );
            setRegistroEditar(null);
            setFormularioEdicionVisible(false);
            obtenerDatos();
        } catch (error) {
            console.error("Error al guardar la edición:");
        }
        setEditLoading(false);
    };



    const volverAlFiltro = () => {
        setFormularioEdicionVisible(false); // Ocultar formulario de edición
    };

    return (
        <div style={styles.container}>
            <h2 className="titulo">Lista de Atenciones Individuales</h2>

            {formularioEdicionVisible ? (
                <button onClick={volverAlFiltro} className="volver-filtro">
                    Volver al Panel de Filtro
                </button>
            ) : (
                <div className="filtro-contenedor">
                    <label className="filtro-label">
                        Fecha Atención:
                        <input
                            type="date"
                            name="fecha_atencion"
                            value={filtros.fecha_atencion}
                            onChange={manejarCambio}
                            className="filtro-input"
                        />
                    </label>
                    <label className="filtro-label">
                        Codigo Alumno:
                        <input
                            type="text"
                            name="codigo_alumno"
                            value={filtros.codigo_alumno}
                            onChange={manejarCambio}
                            className="filtro-input"
                        />
                    </label>
                        <label className="filtro-label">
                            Número Atención:
                            <input
                                type="number"
                                name="numero_atencion"
                                value={filtros.numero_atencion}
                                onChange={manejarCambio}
                                className="filtro-input"
                            />
                        </label>

                    <button onClick={aplicarFiltros} className="filtro-boton">
                        Filtrar
                    </button>
                </div>
            )}

            {!formularioEdicionVisible && loading ? (
                <p className="loading-text">Cargando datos...</p>
            ) : (
                <>
                    {!formularioEdicionVisible && (
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha Atención</th>
                                    <th>Codigo Alumno</th>
                                    <th>Número Atención</th>
                                    <th>Descripción Consulta</th>
                                    <th>Acuerdos Establecidos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.length > 0 ? (
                                    datos.map((registro) => (
                                        <tr key={registro.id}>
                                            <td>{registro.id}</td>
                                            <td>{registro.fecha_atencion}</td>
                                            <td>{registro.codigo_alumno}</td>
                                            <td>{registro.numero_atencion}</td>
                                            <td>{registro.descripcion_consulta}</td>
                                            <td>{registro.acuerdos_establecidos}</td>
                                            <td>
                                                {/* <button
                                                    onClick={() => eliminarRegistro(registro.id)}
                                                    title="Eliminar"
                                                    style={{
                                                        backgroundColor: "#ff8787", // Rojo
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        padding: "6px 10px",
                                                        marginRight: "8px",
                                                        cursor: "pointer",
                                                        transition: "background-color 0.3s",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#ff6b6b"}
                                                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#ff8787"}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14H6L5 6" />
                                                        <path d="M10 11v6" />
                                                        <path d="M14 11v6" />
                                                        <path d="M9 6V4h6v2" />
                                                    </svg>
                                                </button> */}

                                                {/* <button
                                                    onClick={() => editarRegistro(registro.id)}
                                                    title="Editar"
                                                    style={{
                                                        backgroundColor: "#ffe066", // Amarillo
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        padding: "6px 10px",
                                                        cursor: "pointer",
                                                        transition: "background-color 0.3s",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#ffd43b"}
                                                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#ffe066"}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                                    </svg>
                                                </button> */}

                                                 <button
                                                    onClick={() => editarRegistro(registro.id)}
                                                    title="Mas detalles"
                                                    style={{
                                                        backgroundColor: "#74c0fc", 
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        padding: "6px 10px",
                                                        cursor: "pointer",
                                                        transition: "background-color 0.3s",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#4dabf7"}
                                                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#74c0fc"}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                    </svg>

                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No se encontraron registros</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {registroEditar && formularioEdicionVisible && (
                        <div className="formulario-edicion">
                            {/* <h3>Editar Atención</h3> */}
                            <form onSubmit={guardarEdicion}>
                                <label>
                                    Fecha Atención:
                                    <input
                                        type="date"
                                        name="fecha_atencion"
                                        value={registroEditar.fecha_atencion}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Codigo Alumno:
                                    <input
                                        type="text"
                                        name="codigo_alumno"
                                        value={registroEditar.codigo_alumno}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Número Atención:
                                    <input
                                        type="number"
                                        name="numero_atencion"
                                        value={registroEditar.numero_atencion}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Descripción Consulta:
                                    <input
                                        type="text"
                                        name="descripcion_consulta"
                                        value={registroEditar.descripcion_consulta}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Acuerdos Establecidos:
                                    <input
                                        type="text"
                                        name="acuerdos_establecidos"
                                        value={registroEditar.acuerdos_establecidos}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Proxima cita:
                                    <input
                                        type="date"
                                        name="proxima_cita"
                                        value={registroEditar.proxima_cita}
                                        onChange={manejarCambioEdicion}
                                        disabled

                                    />
                                </label>
                                <label>
                                    Observaciones:
                                    <input
                                        type="text"
                                        name="observaciones"
                                        value={registroEditar.observaciones}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>


                                {/* <button type="submit" disabled={editLoading}>
                                    {editLoading ? "Guardando..." : "Guardar Cambios"}
                                </button> */}

                            </form>
                        </div>
                    )}
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
        maxWidth: '900px',
        margin: '0 auto',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        maxHeight: '600px',
    },
};

export default AtencionIndividualList;
