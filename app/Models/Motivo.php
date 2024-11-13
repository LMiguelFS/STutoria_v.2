<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motivo extends Model
{
    /** @use HasFactory<\Database\Factories\MotivoFactory> */
    use HasFactory;
    protected $table = 'motivo';
    protected $fillable = [
        'tipo_motivo',
    ];
}
