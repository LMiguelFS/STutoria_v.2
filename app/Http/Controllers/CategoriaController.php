<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;


class CategoriaController extends Controller
{
    public function index()
    {
        try {
            $categorias = Categoria::all();
            return response()->json($categorias);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Error al obtener las categorías.'], 500);
        }
    }

    public function store(Request $request)
    {
        // Validación de datos
        $validated = $request->validate([
            'descripcion' => 'required|string|max:255',
        ]);

        try {
            $categoria = Categoria::create([
                'descripcion' => $validated['descripcion'],
            ]);

            return response()->json([
                'message' => 'Categoría creada exitosamente',
                'categoria' => $categoria
            ], 201);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Error al crear la categoría. Intenta de nuevo.'], 500);
        }
    }




    // En tu controlador, por ejemplo, CategoriaController.php
    public function obtenerEstadisticasCategorias()
    {
        $estadisticas = DB::table('categorias')
            ->leftJoin('atencionindividuals', 'categorias.id_categoria', '=', 'atencionindividuals.id_categoria')
            ->select('categorias.descripcion', DB::raw('COUNT(atencionindividuals.id) as cantidad'))
            ->groupBy('categorias.descripcion')
            ->orderByDesc('cantidad')
            ->get();

        return response()->json($estadisticas);
    }
}
