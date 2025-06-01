// components/GeneradorQR.jsx
import { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const GeneradorQR = ({ sesionId }) => {
    const [qrData, setQrData] = useState(null);
    const [duracion, setDuracion] = useState(15);

    const generarQR = async () => {
        try {
            const response = await axios.post('/api/sesiones/generar-qr', {
                ID_atenciongrupal: sesionId,
                duracion_minutos: duracion
            });

            setQrData(response.data);
        } catch (error) {
            console.error('Error generando QR:', error);
            alert('Error al generar QR: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="qr-generator">
            <h3>Generar Código de Asistencia</h3>

            <div>
                <label>Duración (minutos): </label>
                <input
                    type="number"
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    min="1"
                    max="120"
                />
            </div>

            <button onClick={generarQR}>Generar QR</button>

            {qrData && (
                <div className="qr-display">
                    <QRCode value={qrData.codigo_temporal} size={200} />
                    <p>Código: {qrData.codigo_temporal}</p>
                    <p>Válido hasta: {new Date(qrData.valido_hasta).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};
