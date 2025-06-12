import React, { useState } from 'react';
//import QrReader from 'react-qr-reader';


const RegistroSesionGrupal = () => {
    const [codigoSesion, setCodigoSesion] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mostrarQR, setMostrarQR] = useState(false);

    const manejarEnvio = () => {
        if (!codigoSesion.trim()) {
            setMensaje('❌ Debes ingresar el código de sesión');
            return;
        }
        setMensaje(`✅ Sesión ${codigoSesion} lista para registrar (simulado)`);
    };

    const handleScan = (data) => {
        if (data) {
            setCodigoSesion(data.text);
            setMensaje('✅ Código QR escaneado correctamente');
            setMostrarQR(false);
        }
    };

    const handleError = (err) => {
        setMensaje('❌ Error al acceder a la cámara');
        setMostrarQR(false);
    };

    return (
        <div className="max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-center">Registrar Sesión Grupal</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700">Código de Sesión</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                    value={codigoSesion}
                    onChange={(e) => setCodigoSesion(e.target.value)}
                    placeholder="Ej. SESION2025"
                />
            </div>
            <button
                onClick={manejarEnvio}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Registrar Sesión
            </button>
            <button
                onClick={() => setMostrarQR(true)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                type="button"
            >
                Escanear Código QR
            </button>
            {mostrarQR && (
                <div className="mt-4">
                    <QrReader
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%' }}
                    />

                    <button
                        onClick={() => setMostrarQR(false)}
                        className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            )}
            {mensaje && (
                <div className={`mt-4 p-2 rounded text-center font-medium ${mensaje.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {mensaje}
                </div>
            )}
        </div>
    );
};
