<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atencionindividual extends Model
{
    /** @use HasFactory<\Database\Factories\AtencionindividualFactory> */
    // Definir la tabla asociada
    protected $table = 'atencionindividuals';

    // Definir las columnas que pueden ser asignadas en masa (Mass Assignment)
    protected $fillable = [
        'fecha_atencion',
        'numero_atencion',
        'descripcion_consulta',
        'acuerdos_establecidos',
        'proxima_cita',
        'observaciones',
        'id_user',
        'codigo_alumno',
        'id_motivo',
    ];
}
