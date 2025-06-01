<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    /** @use HasFactory<\Database\Factories\AsistenciaFactory> */
    use HasFactory;
    protected $fillable = ["ID_atenciongrupal", "codigo_alumno", "estado"];

    public function atencionGrupal()
    {
        return $this->belongsTo(RegistroGrupal::class, 'ID_atenciongrupal');
    }

    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'codigo_alumno', 'codigo_alumno');
    }

    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'ID_atenciongrupal');
    }
}
