<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use Illuminate\Http\Request;

class notificacionController extends Controller
{
    // Buscar estudiantes por código o nombre y mostrar y enviar por wasap
    public function buscar(Request $request)
    {
        $resultados = Alumno::query()
            ->select('codigo_alumno', 'nombre', 'apellidos', 'celular')  // Asegúrate de que proximaCita esté incluido
            ->when($request->codigo, function ($query) use ($request) {
                return $query->where('codigo', 'like', '%' . $request->codigo . '%');
            })
            ->when($request->nombre, function ($query) use ($request) {
                return $query->where('nombre', 'like', '%' . $request->nombre . '%');
            })
            ->get();

        return view('buscar.buscar', compact('resultados'));
    }
}
