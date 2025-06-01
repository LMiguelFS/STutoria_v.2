<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atencionindividual extends Model
{
    /** @use HasFactory<\Database\Factories\AtencionindividualFactory> */
    // Definir la tabla asociada
    public $timestamps = false;
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
        'id_categoria',
    ];
    // Relación con la tabla `users`
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    // Relación con la tabla `alumno`
    public function alumnos()
    {
        return $this->belongsTo(Alumnos::class, 'codigo_alumno', 'codigo_alumno');
    }

    // Relación con la tabla `categoria`
    public function categorias()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria', 'id_categoria'); // Ajustado aquí
    }
}
