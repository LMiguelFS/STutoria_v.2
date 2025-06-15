import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
//import { Html5Qrcode } from 'html5-qrcode';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';

const RegistroAsistencia = ({ codigo_alumno }) => {
    const [codigoSesion, setCodigoSesion] = useState('');
    const [codigoAlumno, setCodigoAlumno] = useState(codigo_alumno || '');
    const [mensaje, setMensaje] = useState('');
    const [escanerActivo, setEscanerActivo] = useState(false);
    const [modoManual, setModoManual] = useState(true); // permite editar por defecto
    const qrRef = useRef(null);

    const iniciarEscaner = () => {
        const qrDivId = "qr-reader";
        if (!document.getElementById(qrDivId)) {
            setMensaje('❌ No se encontró el contenedor del lector QR.');
            return;
        }

        setEscanerActivo(true);
        //const html5QrCode = new Html5Qrcode(qrDivId);
        const html5QrCode = new Html5Qrcode("qr-reader", {
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        });



        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                setCodigoSesion(decodedText);
                setMensaje("✅ Código escaneado correctamente.");
                setModoManual(false); // Bloquea la edición
                html5QrCode.stop().then(() => {
                    setEscanerActivo(false);
                });
            },
            () => { }
        ).catch((err) => {
            setMensaje(`❌ Error al iniciar escáner: ${err}`);
            setEscanerActivo(false);
        });
    };

    const activarModoManual = () => {
        setModoManual(true);
        setCodigoSesion('');
    };

    const enviarAsistencia = async () => {
        if (!codigoSesion.trim() || !codigoAlumno.trim()) {
            setMensaje('❌ Debes ingresar tanto el código de sesión como tu código de alumno.');
            return;
        }

        try {
            const response = await axios.post('/api/asistencias/intento', {
                codigo: codigoSesion,
                codigo_alumno: codigoAlumno
            });
            if (response.data.success) {
                setMensaje('✅ Asistencia registrada con éxito.');
            } else {
                setMensaje('⚠️ No se pudo registrar el intento.');
            }
        } catch (error) {
            setMensaje('❌ Error al registrar intento de asistencia.');
        }
    };

    useEffect(() => {
        setCodigoAlumno(codigo_alumno || '');
    }, [codigo_alumno]);

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Registro de Asistencia</h2>

            <label className="block text-sm mb-1">Código de sesión</label>
            <input
                type="text"
                placeholder="Ingrese el código o escanee"
                value={codigoSesion}
                onChange={(e) => setCodigoSesion(e.target.value)}
                readOnly={!modoManual}
                className={`border p-2 w-full mb-3 rounded ${!modoManual ? 'bg-gray-100 text-gray-600' : ''}`}
            />

            {!modoManual && (
                <button
                    onClick={activarModoManual}
                    className="text-sm text-blue-600 mb-3 underline"
                >
                    Escribir código manualmente
                </button>
            )}

            <label className="block text-sm mb-1">Tu código de alumno</label>
            <input
                type="text"
                value={codigoAlumno}
                readOnly
                className="border p-2 w-full mb-3 rounded bg-gray-100 text-gray-700"
            />

            <button
                onClick={iniciarEscaner}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mb-3"
                disabled={escanerActivo}
            >
                📷 Escanear QR
            </button>

            <div id="qr-reader" ref={qrRef} className="mt-2 mb-4" style={{ width: '100%' }}></div>

            <button
                onClick={enviarAsistencia}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
                📝 Enviar Asistencia
            </button>

            {mensaje && (
                <div className={`mt-4 p-2 text-center rounded font-medium ${mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default RegistroAsistencia;
