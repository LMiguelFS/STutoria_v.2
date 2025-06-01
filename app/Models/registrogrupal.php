<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class registrogrupal extends Model
{
    protected $table = 'registrogrupals';

    // Clave primaria de la tabla
    protected $primaryKey = 'id';

    // Desactivar timestamps si no los estás utilizando
    public $timestamps = true;

    // Especificar los campos que son asignables
    protected $fillable = [
        'id',
        'user_id',
        'Nro_session',
        'Fecha',
        'Tema',
        'ResultadoEsperado',
        'NroEstudiantesVarones',
        'NroEstudiantesMujeres',
        'CumplimientoObjetivo',
        'InteresDelTema',
        'ParticipacionAlumnos',
        'AclaracionDudas',
        'ReprogramacionDelTema',
        'Ciclo',
        'ComentarioSignificativo',
        'AnimacionMotivacion',
        'ApropiacionDesarrollo',
        'TransferenciaPracticaCompromiso',
        'Evaluacion',
    ];

    // Relación con el modelo User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
