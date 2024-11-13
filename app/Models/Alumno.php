<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    /** @use HasFactory<\Database\Factories\AlumnoFactory> */
    use HasFactory;
    protected $table = 'alumnos'; // Nombre de la tabla
    protected $primaryKey = 'codigo_alumno'; // Clave primaria
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
