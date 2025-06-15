import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaEstudiantesSesion = ({ codigoAsistencia, recargarTrigger, onAsistenciasChange, onCodigosChange }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tiempoActivo, setTiempoActivo] = useState(true);
    const [asistencias, setAsistencias] = useState({});


    const cargarEstudiantes = async () => {
        if (!codigoAsistencia) return;

        try {
            setLoading(true);
            const res = await axios.get(`/api/asistencias/alumnos-intento?codigo=${codigoAsistencia}`);
            const alumnos = res.data.alumnos || [];
            setEstudiantes(alumnos);

            // Extraer solo códigos
            const codigos = alumnos.map(a => a.codigo_alumno);
            //console.log("Enviando códigos al padre:", codigos);

            if (onCodigosChange) {
                onCodigosChange(codigos);
            }
        } catch (error) {
            //console.error("Error cargando estudiantes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAsistenciaChange = (codigoAlumno) => {
        const nuevasAsistencias = {
            ...asistencias,
            [codigoAlumno]: !asistencias[codigoAlumno]
        };
        setAsistencias(nuevasAsistencias);
        if (onAsistenciasChange) {
            onAsistenciasChange(nuevasAsistencias);
        }
    };

    useEffect(() => {
        if (!codigoAsistencia) return;
        // Función que carga estudiantes Y actualiza asistencias
        const cargarYActualizarAsistencias = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/asistencias/alumnos-intento?codigo=${codigoAsistencia}`);
                const alumnos = res.data.alumnos || [];

                setEstudiantes(alumnos);

                // Inicializar asistencias solo si hay cambios
                if (alumnos.length > 0) {
                    const nuevasAsistencias = {};
                    alumnos.forEach(alumno => {
                        // Mantener el estado previo si existe, o true por defecto
                        nuevasAsistencias[alumno.codigo_alumno] =
                            asistencias[alumno.codigo_alumno] !== undefined
                                ? asistencias[alumno.codigo_alumno]
                                : true;
                    });
                    setAsistencias(nuevasAsistencias);
                    if (onAsistenciasChange) onAsistenciasChange(nuevasAsistencias);
                }
            } catch (error) {
                //console.error("Error cargando estudiantes:", error);
            } finally {
                setLoading(false);
            }
        };

        // Cargar inmediatamente al montar
        cargarYActualizarAsistencias();

        // Configurar intervalo para recargas periódicas
        const intervalId = setInterval(() => {
            if (tiempoActivo) {
                cargarYActualizarAsistencias();
                cargarEstudiantes();
            }
        }, 10000); // 10 segundos

        // Configurar timeout para desactivar después de 15 minutos
        const timeoutId = setTimeout(() => {
            setTiempoActivo(false);
            clearInterval(intervalId);
        }, 900000); // 15 minutos

        // Limpieza
        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [codigoAsistencia, tiempoActivo]);

    // Efecto adicional para manejar cambios externos en recargarTrigger
    useEffect(() => {
        if (recargarTrigger) {
            cargarEstudiantes();
        }
    }, [recargarTrigger]);

    if (!codigoAsistencia) return null;

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Estudiantes de la sesión:</h3>
            {loading ? (
                <p>Cargando...</p>
            ) : estudiantes.length === 0 ? (
                <p className="text-gray-500">No hay estudiantes en la sesión.</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1">N°</th>
                            <th className="border px-2 py-1">Código</th>
                            <th className="border px-2 py-1">Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.map((alumno, index) => (
                            <tr key={alumno.codigo_alumno}>
                                <td className="border px-2 py-1 text-center">{index + 1}</td>
                                <td className="border px-2 py-1 text-center">{alumno.codigo_alumno}</td>
                                <td className="border px-2 py-1">{alumno.nombre} {alumno.apellidos}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListaEstudiantesSesion;
