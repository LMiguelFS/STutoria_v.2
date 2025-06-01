<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Motivo;

class MotivoController extends Controller
{
    public function getByCategoria($categoria_id)
    {
        return response()->json(Motivo::where('id_categoria', $categoria_id)->get());
    }
    // Método para obtener todos los motivos

    public function index()
    {
        // Obtener todos los motivos existentes
        $motivos = Motivo::all();
        return response()->json($motivos);
    }

    public function store(Request $request)
    {
        // Validación de datos
        $request->validate([
            'tipo_motivo' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
        ]);

        $motivo = Motivo::create([
            'id_categoria'  => $request->categoria_id,
            'nombre'  => $request->nombre,
        ]);


        return response()->json(['message' => 'Motivo creado exitosamente', 'motivo' => $motivo]);
    }
}
