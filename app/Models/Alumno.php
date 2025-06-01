<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{

    /**
     * La clave primaria asociada con la tabla.
     *
     * @var string
     */
    protected $primaryKey = 'codigo_alumno';

    /**
     * Indica si la clave primaria es incremental.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * El tipo de clave primaria.
     *
     * @var string
     */
    protected $keyType = 'string';

    /** @use HasFactory<\Database\Factories\AlumnoFactory> */
    use HasFactory;
    protected $table = 'alumnos'; // Nombre de la tabla

    protected $fillable = [
        'codigo_alumno',
        'correo_institucional',
        'nombre',
        'apellidos',
        'programa_estudios',
        'semestre',
        'estado_civil',
        'edad',
        'celular',
        'sexo',
        'PefilEstudiante',
    ];
}
