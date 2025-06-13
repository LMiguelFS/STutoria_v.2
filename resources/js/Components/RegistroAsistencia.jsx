import React, { useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const RegistroAsistencia = () => {
    const [codigo, setCodigo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [escanerActivo, setEscanerActivo] = useState(false);
    const qrRef = useRef(null);

    const iniciarEscaner = () => {
        const qrDivId = "qr-reader";
        if (!document.getElementById(qrDivId)) {
            setMensaje('❌ No se encontró el contenedor del lector QR.');
            return;
        }

        setEscanerActivo(true);
        const html5QrCode = new Html5Qrcode(qrDivId);

        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => {
                setCodigo(decodedText);
                setMensaje("✅ Código escaneado correctamente.");
                html5QrCode.stop().then(() => {
                    setEscanerActivo(false);
                });
            },
            (errorMessage) => {
                // Puedes ignorar errores de escaneo intermitentes
            }
        ).catch((err) => {
            setMensaje(`❌ Error al iniciar escáner: ${err}`);
            setEscanerActivo(false);
        });
    };

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Registro de Asistencia</h2>

            <input
                type="text"
                placeholder="Ingrese el código o escanee"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="border p-2 w-full mb-2"
            />

            <button
                onClick={iniciarEscaner}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                disabled={escanerActivo}
            >
                Escanear QR
            </button>

            <div id="qr-reader" ref={qrRef} className="mt-4" style={{ width: '100%' }}></div>

            {mensaje && (
                <div className="mt-4 p-2 bg-gray-100 text-center rounded">
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default RegistroAsistencia;
