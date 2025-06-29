<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Derivacion extends Model
{
    protected $fillable = [
        'codigo_alumno',
        'domicilio_actual',
        'actualmente_vive_con',
        'motivo_derivacion',
        'fecha_derivacion',
    ];

    // Relación con el modelo Alumno
    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'codigo_alumno', 'codigo_alumno');
    }
}
