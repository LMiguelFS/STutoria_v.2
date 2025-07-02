import React from 'react';
import { User, Phone, Mail, GraduationCap, Calendar, MapPin, Users, FileText, Clock } from 'lucide-react';

export default function InformacionDetallada({ estudiante }) {
    if (!estudiante) {
        return (
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 max-w-md">
                <div className="text-center">
                    <User className="mx-auto h-12 w-12 text-gray-600 mb-2" />
                    <h2 className="text-xl font-bold text-white mb-2">Información Detallada</h2>
                    <p className="text-gray-400 text-base">
                        Seleccione un estudiante para ver detalles de la derivación, motivo, fecha, historial, etc.
                    </p>
                </div>
            </div>
        );
    }

    const formatGender = (gender) => {
        if (gender === 'M') return 'Masculino';
        if (gender === 'F') return 'Femenino';
        return gender;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const InfoCard = ({ icon: Icon, title, value, colSpan = 1 }) => (
        <div className={`bg-gray-800 rounded p-2 border border-gray-700 ${colSpan === 2 ? 'col-span-2' : ''}`}>
            <div className="flex items-start space-x-2">
                <Icon className="h-4 w-4 text-blue-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-300 mb-0.5">{title}</p>
                    <p className="text-white text-xs break-words">{value || 'No especificado'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-2">
                <div className="flex items-center space-x-2 ">
                    <User className="h-6 w-6 text-white" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Información Detallada</h2>
                        <p className="text-blue-100 text-xs">Datos completos del estudiante</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-2">
                {/* Información Personal */}
                <Section title="Información Personal" icon={User} color="text-blue-400">
                    <div className="grid grid-cols-2 gap-2">
                        <InfoCard icon={User} title="Nombre Completo" value={`${estudiante.nombre} ${estudiante.apellidos}`} colSpan={2} />
                        <InfoCard icon={Phone} title="Celular" value={estudiante.celular} />
                        <InfoCard icon={Mail} title="Correo Institucional" value={estudiante.correo_institucional} />
                        <InfoCard icon={Calendar} title="Edad" value={estudiante.edad ? `${estudiante.edad} años` : 'No especificada'} />
                        <InfoCard icon={User} title="Género" value={formatGender(estudiante.sexo)} />
                        <InfoCard icon={Users} title="Estado Civil" value={estudiante.estado_civil} colSpan={2} />
                    </div>
                </Section>

                {/* Información Académica */}
                <Section title="Información Académica" icon={GraduationCap} color="text-green-400">
                    <div className="grid grid-cols-2 gap-2">
                        <InfoCard icon={GraduationCap} title="Programa de Estudios" value={estudiante.programa_estudios} />
                        <InfoCard icon={Calendar} title="Semestre" value={estudiante.semestre} />
                    </div>
                </Section>

                {/* Información de Vivienda */}
                <Section title="Información de Vivienda" icon={MapPin} color="text-orange-400">
                    <div className="grid grid-cols-1 gap-2">
                        <InfoCard icon={MapPin} title="Domicilio Actual" value={estudiante.domicilio_actual} />
                        <InfoCard icon={Users} title="Actualmente Vive Con" value={estudiante.actualmente_vive_con} />
                    </div>
                </Section>

                {/* Información de Derivación */}
                <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg p-2 border border-red-800/30">
                    <Section title="Información de Derivación" icon={FileText} color="text-red-400">
                        <div className="grid grid-cols-1 gap-2">
                            <InfoCard icon={FileText} title="Motivo de Derivación" value={estudiante.motivo_derivacion} />
                            <InfoCard icon={Clock} title="Fecha de Derivación" value={formatDate(estudiante.fecha_derivacion)} />
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}

// Componentes auxiliares
const Section = ({ title, icon: Icon, color, children }) => (
    <div className="mb-2">
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center">
            <Icon className={`h-4 w-4 mr-1 ${color}`} />
            {title}
        </h3>
        {children}
    </div>
);
