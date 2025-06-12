import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/RegistroGrupalList.css";
//-------------------------------------------
import { usePage } from '@inertiajs/react';
//-------------------------------------------
const RegistroGrupalList = () => {
    //------------------------------------------------
    const { auth } = usePage().props;
    //------------------------------------------------
    const [filtros, setFiltros] = useState({
        Fecha: "",
        Tema: "",
        Nro_session: "",
    });
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [registroEditar, setRegistroEditar] = useState(null);
    const [formularioEdicionVisible, setFormularioEdicionVisible] = useState(false); // Nuevo estado
    const [userId, setUserId] = useState(null); // Nuevo estado para guardar el id del usuario

    const fetchUsuarioId = async () => {
        try {
            const response = await axios.post(`/api/recuperar-id?email=${auth.user.email}`);
            if (response.data && response.data.id) {
                const idUser = response.data.id;
                setUserId(idUser); // Guarda el id en el estado
                obtenerDatos(idUser, false); // Llama a obtenerDatos sin filtros al inicio
            } else {
                console.error('No se pudo encontrar el ID del usuario.');
            }
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
        }
    };

    // Modifica obtenerDatos para aceptar userId y filtros
    const obtenerDatos = async (userId, applyFilters = false) => {
        setLoading(true);
        try {
            const params = {
                user_id: userId,
                ...(applyFilters
                    ? Object.fromEntries(
                        Object.entries(filtros).filter(([_, value]) => value)
                    )
                    : {})
            };
            const response = await axios.get("/api/registrogrupals", { params });
            setDatos(response.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsuarioId(); // Llama a fetchUsuarioId al montar el componente
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const aplicarFiltros = () => {
        if (userId) {
            obtenerDatos(userId, true); // Pasa el userId y activa los filtros
        }
    };

    const eliminarRegistro = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            try {
                await axios.delete(`api/registrogrupals/${id}`);
                if (userId) obtenerDatos(userId, false); // Recarga los datos después de eliminar
            } catch (error) {
                console.error("Error al eliminar el registro:", error);
            }
        }
    };

    const editarRegistro = async (id) => {
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

    const guardarEdicion = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`api/registrogrupals/${registroEditar.id}`, registroEditar);
            setRegistroEditar(null);
            setFormularioEdicionVisible(false);
            if (userId) obtenerDatos(userId, false); // Recargar los datos después de editar
        } catch (error) {
            console.error("Error al guardar la edición:", error);
        }
    };

    const volverAlFiltro = () => {
        setFormularioEdicionVisible(false); // Ocultar formulario de edición
    };

    return (
        <div style={styles.container}>
            <h2 className="titulo">Lista de Registros Grupales</h2>


            {/* Botón para volver al panel de filtrado */}
            {formularioEdicionVisible ? (
                <button onClick={volverAlFiltro} className="volver-filtro">
                    Volver al Panel de Filtro
                </button>
            ) : (
                <div className="filtro-contenedor">
                    <label className="filtro-label">
                        Fecha:
                        <input
                            type="date"
                            name="Fecha"
                            value={filtros.Fecha}
                            onChange={manejarCambio}
                            className="filtro-input"
                        />
                    </label>
                    <label className="filtro-label">
                        Tema:
                        <input
                            type="text"
                            name="Tema"
                            value={filtros.Tema}
                            onChange={manejarCambio}
                            className="filtro-input"
                        />
                    </label>
                    <label className="filtro-label">
                        Nro_session:
                        <input
                            type="number"
                            name="Nro_session"
                            value={filtros.Nro_session}
                            onChange={manejarCambio}
                            className="filtro-input"
                        />
                    </label>
                    <button onClick={aplicarFiltros} className="filtro-boton">
                        Filtrar
                    </button>
                </div>
            )}

            {/* Mostrar la tabla solo si el formulario de edición está oculto */}
            {!formularioEdicionVisible && loading ? (
                <p className="loading-text">Cargando datos...</p>
            ) : (
                <>
                    {!formularioEdicionVisible && (
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Tema</th>
                                    <th>Nro_session</th>
                                    <th>ResultadoEsperado</th>
                                    <th>CumplimientoObjetivo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.length > 0 ? (
                                    datos.map((registro) => (
                                        <tr key={registro.id}>
                                            <td>{registro.id}</td>
                                            <td>{registro.Fecha}</td>
                                            <td>{registro.Tema}</td>
                                            <td>{registro.Nro_session}</td>
                                            <td>{registro.ResultadoEsperado}</td>
                                            <td>{registro.CumplimientoObjetivo}</td>
                                            <td>
                                                <button
                                                    onClick={() => editarRegistro(registro.id)}
                                                    title="Editar"
                                                    style={{
                                                        backgroundColor: "#ffe066", 
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        padding: "4px 8px",
                                                        marginRight: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {/* Lápiz SVG simple */}
                                                    <svg width="18" height="18" viewBox="0 0 20 20">
                                                        <rect x="3" y="14" width="4" height="3" fill="none" stroke="#111" strokeWidth="1.5" />
                                                        <polygon points="4,13 15,2 18,5 7,16" fill="none" stroke="#111" strokeWidth="2" />
                                                        <line x1="15" y1="2" x2="18" y2="5" stroke="#111" strokeWidth="2" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => eliminarRegistro(registro.id)}
                                                    title="Eliminar"
                                                    style={{
                                                        backgroundColor: "#ff4444",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        padding: "4px 8px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {/* Tacho SVG simple */}
                                                    <svg width="18" height="18" viewBox="0 0 20 20">
                                                        <rect x="5" y="7" width="10" height="8" fill="none" stroke="#111" strokeWidth="2" />
                                                        <line x1="7" y1="7" x2="7" y2="15" stroke="#111" strokeWidth="1.5" />
                                                        <line x1="10" y1="7" x2="10" y2="15" stroke="#111" strokeWidth="1.5" />
                                                        <line x1="13" y1="7" x2="13" y2="15" stroke="#111" strokeWidth="1.5" />
                                                        <rect x="8" y="4" width="4" height="2" fill="none" stroke="#111" strokeWidth="2" />
                                                        <line x1="6" y1="7" x2="14" y2="7" stroke="#111" strokeWidth="2" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No se encontraron registros</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Formulario de Edición */}
                    {registroEditar && formularioEdicionVisible && (
                        <div className="formulario-edicion">
                            <h3>Editar Registro</h3>
                            <form onSubmit={guardarEdicion}>
                                <label>
                                    Fecha:
                                    <input
                                        type="date"
                                        name="Fecha"
                                        value={registroEditar.Fecha}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Tema:
                                    <input
                                        type="text"
                                        name="Tema"
                                        value={registroEditar.Tema}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <label>
                                    Nro_session:
                                    <input
                                        type="number"
                                        name="Nro_session"
                                        value={registroEditar.Nro_session}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <label>
                                    ResultadoEsperado:
                                    <input
                                        type="text"
                                        name="ResultadoEsperado"
                                        value={registroEditar.ResultadoEsperado}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <label>
                                    ComentarioSignificativo:
                                    <input
                                        type="text"
                                        name="ComentarioSignificativo"
                                        value={registroEditar.ComentarioSignificativo}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <label>
                                    NroEstudiantesVarones:
                                    <input
                                        type="number"
                                        name="NroEstudiantesVarones"
                                        value={registroEditar.NroEstudiantesVarones}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <label>
                                    NroEstudiantesMujeres:
                                    <input
                                        type="number"
                                        name="NroEstudiantesMujeres"
                                        value={registroEditar.NroEstudiantesMujeres}
                                        onChange={manejarCambioEdicion}
                                        disabled
                                    />
                                </label>
                                <div className="panel-promo">
                                    <label>
                                        CumplimientoObjetivo:
                                        <select
                                            name="CumplimientoObjetivo"
                                            value={registroEditar.CumplimientoObjetivo}
                                            onChange={manejarCambioEdicion}
                                        >
                                            <option value="SI">Sí</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </label>

                                    <label>
                                        InteresDelTema:
                                        <select
                                            name="InteresDelTema"
                                            value={registroEditar.InteresDelTema}
                                            onChange={manejarCambioEdicion}
                                        >
                                            <option value="SI">Sí</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </label>

                                    <label>
                                        ParticipacionAlumnos:
                                        <select
                                            name="ParticipacionAlumnos"
                                            value={registroEditar.ParticipacionAlumnos}
                                            onChange={manejarCambioEdicion}
                                        >
                                            <option value="SI">Sí</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </label>

                                    <label>
                                        AclaracionDudas:
                                        <select
                                            name="AclaracionDudas"
                                            value={registroEditar.AclaracionDudas}
                                            onChange={manejarCambioEdicion}
                                        >
                                            <option value="SI">Sí</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </label>

                                    <label>
                                        ReprogramacionDelTema:
                                        <select
                                            name="ReprogramacionDelTema"
                                            value={registroEditar.ReprogramacionDelTema}
                                            onChange={manejarCambioEdicion}
                                        >
                                            <option value="SI">Sí</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </label>
                                </div>

                                <label>
                                    Ciclo:
                                    <select
                                        name="Ciclo"
                                        value={registroEditar.Ciclo}
                                        onChange={manejarCambioEdicion}
                                    >
                                        <option value="1er">1er</option>
                                        <option value="2do">2do</option>
                                        <option value="3er">3er</option>
                                        <option value="4to">4to</option>
                                        <option value="5to">5to</option>
                                        <option value="6to">6to</option>
                                    </select>
                                </label>

                                <label>
                                    AnimacionMotivacion:
                                    <input
                                        type="text"
                                        name="AnimacionMotivacion"
                                        value={registroEditar.AnimacionMotivacion}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <label>
                                    ApropiacionDesarrollo:
                                    <input
                                        type="text"
                                        name="ApropiacionDesarrollo"
                                        value={registroEditar.ApropiacionDesarrollo}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <label>
                                    TransferenciaPracticaCompromiso:
                                    <input
                                        type="text"
                                        name="TransferenciaPracticaCompromiso"
                                        value={registroEditar.TransferenciaPracticaCompromiso}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <label>
                                    Evaluacion:
                                    <input
                                        type="text"
                                        name="Evaluacion"
                                        value={registroEditar.Evaluacion}
                                        onChange={manejarCambioEdicion}
                                    />
                                </label>
                                <button type="submit">Guardar Cambios</button>
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
}

export default RegistroGrupalList;
