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

    protected $primaryKey = 'id_categoria';
    public $incrementing = true;
    protected $keyType = 'int'; // o 'string' si fuera otro tipo


    // Relación con la tabla `atencionindividual`
    public function atenciones()
    {
        return $this->hasMany(Atencionindividual::class, 'id_categoria', 'id_categoria'); // Ajustado aquí
    }
}
