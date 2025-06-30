import react from "react";

export default function EstadisticaSG() {
    // Simulación de datos para las sesiones grupales
    const sesionesGrupales = [
        { tema: 'Adaptación', cantidad: 5 },
        { tema: 'Manejo del estrés', cantidad: 3 },
        { tema: 'Orientación profesional', cantidad: 4 },
    ];

    return (
        <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
            <div className="p-4 h-96">
                <h2 className="text-white text-xl font-semibold mb-4">Sesiones Grupales</h2>
                <ul className="text-white space-y-2">
                    {sesionesGrupales.map((sesion, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{sesion.tema}</span>
                            <span>{sesion.cantidad}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
