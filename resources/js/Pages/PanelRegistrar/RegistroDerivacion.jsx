import React, { useState, useEffect } from 'react';
import BusquedaAlumno from '../../Components/busquedaAlumnoRI';

const RegistroDerivacion = ({ alumno }) => {
    const [domicilioActual, setDomicilioActual] = useState('');
    const [actualmenteViveCon, setActualmenteViveCon] = useState('');
    const [fechaDerivacion, setFechaDerivacion] = useState('');
    const [motivoDerivacion, setMotivoDerivacion] = useState('');

    useEffect(() => {
        const hoy = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        setFechaDerivacion(hoy);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            codigo_alumno: alumno.codigo_alumno,
            domicilio_actual: domicilioActual,
            actualmente_vive_con: actualmenteViveCon,
            motivo_derivacion: motivoDerivacion,
            fecha_derivacion: fechaDerivacion,
        };

        try {
            const response = await fetch('api/derivaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al registrar la derivación');
            }

            const result = await response.json();
            alert('✅ Derivación registrada correctamente');
            //console.log(result);

            // Limpiar campos
            setDomicilioActual('');
            setActualmenteViveCon('');
            setMotivoDerivacion('');

            
        } catch (error) {
            console.error('❌ Error:', error);
            alert('Ocurrió un error al enviar la derivación.');
        }
    };


    return (
        <form onSubmit={handleSubmit} className="max-w-3x1 mx-auto bg-while p-10 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-[#4b0082] text-center">Ficha de Derivación o Referencia</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-1">
                <div>
                    <label className="font-semibold text">Apellidos y Nombres:</label>
                    <div className="border rounded px-2 py-1 bg-gray-100 text">{alumno.apellidos} {alumno.nombres}</div>
                </div>
                <div>
                    <label className="font-semibold text">Celular:</label>
                    <div className="border rounded px-2 py-1 bg-gray-100 text">{alumno.celular}</div>
                </div>
                <div className="mb-4">
                    <label className="font-semibold text">Fecha de Derivación:</label>
                    <input
                        type="date"
                        className="border rounded px-2 py-1 w-full bg-gray-100 text"
                        value={fechaDerivacion}
                        disabled
                    />
                </div>
            </div>

            {/* Fila con Edad, Sexo y Estado Civil */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="font-semibold text">Edad:</label>
                    <div className="border rounded px-2 py-1 bg-gray-100 text">{alumno.edad}</div>
                </div>
                <div>
                    <label className="font-semibold text">Sexo:</label>
                    <div className="border rounded px-2 py-1 bg-gray-100 text">{alumno.sexo}</div>
                </div>
                <div>
                    <label className="font-semibold text">Estado Civil:</label>
                    <div className="border rounded px-2 py-1 bg-gray-100 text">{alumno.estado_civil}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="font-semibold text">Domicilio Actual:</label>
                    <input
                        type="text"
                        className="border rounded px-2 py-1 w-full text"
                        value={domicilioActual}
                        onChange={e => setDomicilioActual(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="font-semibold text">Actualmente vive con:</label>
                    <input
                        type="text"
                        className="border rounded px-2 py-1 w-full text"
                        value={actualmenteViveCon}
                        onChange={e => setActualmenteViveCon(e.target.value)}
                        required
                    />
                </div>
            </div>



            <div className="mb-6">
                <label className="font-semibold text">Motivo de Derivación o Referencia:</label>
                <textarea
                    className="border rounded px-2 py-1 w-full text"
                    rows="4"
                    value={motivoDerivacion}
                    onChange={e => setMotivoDerivacion(e.target.value)}
                    placeholder="Brevemente describa de forma objetiva las dificultades o problemas que presenta el o la estudiantes.(Aspectos académicos, familiares, sociales, emocionales, conducta, entre otros) "
                    required
                />
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className="bg-[#4b0082] text-white px-6 py-2 rounded hover:bg-[#3a0066] transition"
                >
                    Enviar Derivación
                </button>
            </div>
        </form>
    );
};

export default RegistroDerivacion;
