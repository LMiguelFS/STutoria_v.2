import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/atencionIndividual.css';  // Asegúrate de importar los estilos
//-------------------------------------------
import { usePage } from '@inertiajs/react';
//-------------------------------------------

const RegistroAtencion = ({ alumno, onClose }) => {
    //------------------------------------------------
    const { auth } = usePage().props;
    //------------------------------------------------
    const getLocalDate = () => {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [formData, setFormData] = useState({
        fecha_atencion: getLocalDate(),
        numero_atencion: alumno?.proxima_sesion,
        descripcion_consulta: '',
        acuerdos_establecidos: '',
        proxima_cita: '',
        observaciones: '',
        id_user: '',
        codigo_alumno: alumno ? alumno.codigo_alumno : '', // Código del alumno seleccionado
        id_categoria: '', // Categoría seleccionada
        email: auth.user.email, // Correo del usuario autenticado
    });

    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [mensaje, setMensaje] = useState('');

    //-------------------------------------------------------------------------------------------------------------------------------
    // Obtener el ID del usuario basado en el correo electrónico
    const fetchUsuarioId = async () => {
        try {
            const response = await axios.post(`/api/recuperar-id?email=${formData.email}`);
            if (response.data && response.data.id) {
                setFormData((prev) => ({ ...prev, id_user: response.data.id }));
            } else {
                setMensaje('No se pudo encontrar el ID del usuario.');
            }
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
            setMensaje('Error al obtener el ID del usuario. Intenta de nuevo.');
        }
    };
    //-------------------------------------------------------------------------------------------------------------------------------

    // Cargar categorías al iniciar el componente
    const fetchCategorias = async () => {
        try {
            const response = await axios.get('/api/categorias');
            setCategorias(response.data); // Asumiendo que la API devuelve las categorías correctamente
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
            setMensaje('Error al cargar las categorías. Intenta de nuevo.');
        }
    };

    useEffect(() => {
        fetchCategorias();
        fetchUsuarioId();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCategoriaSelect = (e) => {
        setFormData({ ...formData, id_categoria: e.target.value });
    };

    const handleCrearCategoria = async () => {
        if (!nuevaCategoria) {
            setMensaje('Por favor ingresa una descripción para la nueva categoría.');
            return;
        }

        try {
            const response = await axios.post('/api/categorias', {
                descripcion: nuevaCategoria,
            });
            setNuevaCategoria('');
            setMensaje('Categoría creada con éxito.');
            // Recargar las categorías después de crear una nueva
            await fetchCategorias(); // Recargar las categorías
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            setMensaje('Error al crear la categoría. Intenta de nuevo.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id_categoria) {
            setMensaje('Por favor selecciona una categoría antes de registrar la atención.');
            return;
        }

        try {
            const response = await axios.post('/api/atencionindividual', formData);
            if (response.status === 201) {
                alert('Atención registrada con éxito.');
                if (onClose) onClose();
                return;
            }
        } catch (error) {
            //console.error('Error al registrar la atención:', error);
            setMensaje('Error al registrar la atención. Intenta de nuevo.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 className='titulo'>Registrar Atención Individual </h2>

            {/* Mensaje de estado */}
            {mensaje && <p className="mensaje">{mensaje}</p>}

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit} className="formulario">
                {/* Datos principales */}
                <div className="panel-promo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    marginBottom: '24px',
                    width: '100%',
                }}>
                    {/* Cada campo en columna */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <label>Fecha de Atención:</label>
                        <input type="date" name="fecha_atencion" value={formData.fecha_atencion} readOnly required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <label>Número de Atención:</label>
                        <input type="number" name="numero_atencion" value={formData.numero_atencion} readOnly required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <label>Código Alumno:</label>
                        <input type="text" name="codigo_alumno" value={formData.codigo_alumno} readOnly required />
                    </div>
                </div>

                {/* Campos de texto */}
                <div className="form-group">
                    <label>Descripción de la Consulta:</label>
                    <textarea name="descripcion_consulta" value={formData.descripcion_consulta} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Acuerdos Establecidos:</label>
                    <textarea name="acuerdos_establecidos" value={formData.acuerdos_establecidos} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: '24px',
                    width: '100%',
                }}>
                    <label>Observaciones:</label>
                    <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} required></textarea>
                </div>

                {/* Categoría y próxima cita */}
                <div className="panel-promo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '40px',
                    marginBottom: '24px',
                    width: '100%',
                }}>
                    <div className="form-group">
                        <label>Selecciona una Categoría:</label>
                        <select name="id_categoria" value={formData.id_categoria} onChange={handleCategoriaSelect} required>
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id_categoria || categoria.descripcion} value={categoria.id_categoria}>
                                    {categoria.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Próxima Cita:</label>
                        <input type="date" name="proxima_cita" value={formData.proxima_cita} onChange={handleChange} />
                    </div>
                </div>

                {/* Botón de registro */}
                <button type="submit" className="btn-submit" style={{ width: '100%', marginTop: '16px' }}>
                    Registrar Atención
                </button>
            </form>

            {/* Crear nueva categoría (puede ir debajo o en modal) */}
            <div className="crear-categoria" style={{ marginTop: '32px' }}>
                <h3>Crear Nueva Categoría</h3>
                <input
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Descripción de la nueva categoría"
                />
                <button type="button" onClick={handleCrearCategoria} className="btn-crear-categoria">
                    Crear Categoría
                </button>
            </div>
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
}

export default RegistroAtencion;
