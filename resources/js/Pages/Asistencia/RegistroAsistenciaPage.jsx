import React, { useState } from 'react';
import RegistroAsistencia from '@/Components/RegistroAsistencia';
import BusquedaAlumno from '../../Components/busquedaAlumnoRI';

const RegistroAsistenciaPage = () => {
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(true);

    const handleSeleccionAlumno = (alumno) => {
        setAlumnoSeleccionado(alumno);
        setMostrarModal(false);
    };

    const handleCerrarModal = () => {
        setMostrarModal(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            {/* Modal para buscar alumno */}
            {mostrarModal && (
                <BusquedaAlumno
                    onSelect={handleSeleccionAlumno}
                    onClose={handleCerrarModal}
                />
            )}

            {/* Formulario de asistencia */}
            {!mostrarModal && alumnoSeleccionado && (
                <RegistroAsistencia codigo_alumno={alumnoSeleccionado.codigo_alumno} />
            )}
        </div>
    );
};

export default RegistroAsistenciaPage;
