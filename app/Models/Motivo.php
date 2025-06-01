<?php

namespace App\Models;

use Inertia\Inertia;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motivo extends Model
{
    protected $table = 'motivos';
    protected $fillable = [
        'id_categoria',
        'nombre',
    ];
}
