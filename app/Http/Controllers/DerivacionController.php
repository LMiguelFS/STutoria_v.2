<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Derivacion;

class DerivacionController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos
        $validated = $request->validate([
            'codigo_alumno' => 'required|exists:alumnos,codigo_alumno',
            'domicilio_actual' => 'required|string|max:255',
            'actualmente_vive_con' => 'required|string|max:255',
            'motivo_derivacion' => 'required|string|max:1000',
            'fecha_derivacion' => 'required|date',
        ]);

        // Crear la derivación
        $derivacion = Derivacion::create($validated);

        return response()->json([
            'message' => 'Derivación registrada correctamente',
        ], 201);
    }
}
