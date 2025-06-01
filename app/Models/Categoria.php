<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    protected $fillable = [
        'descripcion'
    ];

    // Relación con la tabla `atencionindividual`
    public function atenciones()
    {
        return $this->hasMany(Atencionindividual::class, 'id_categoria', 'id_categoria'); // Ajustado aquí
    }
}
