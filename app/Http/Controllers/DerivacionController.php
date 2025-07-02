<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Derivacion;
use Illuminate\Support\Facades\DB;

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

    public function derivacionesPorCarreraYCiclo(Request $request)
    {
        if ($request->isMethod('post')) {
            // Construye el query base con join a alumnos
            $baseQuery = Derivacion::join('alumnos', 'derivacions.codigo_alumno', '=', 'alumnos.codigo_alumno');

            if ($request->filled('carrera')) {
                $baseQuery->where('alumnos.programa_estudios', $request->input('carrera'));
            }

            if ($request->filled('ciclo')) {
                $baseQuery->where('alumnos.semestre', $request->input('ciclo'));
            }

            // Copiar antes de modificar con groupBy
            $codigos = (clone $baseQuery)->select('derivacions.codigo_alumno')->pluck('derivacions.codigo_alumno')->unique()->values();

            // Agrupación para conteo
            $result = $baseQuery
                ->select('alumnos.programa_estudios as carrera', 'alumnos.semestre', DB::raw('count(*) as total'))
                ->groupBy('alumnos.programa_estudios', 'alumnos.semestre')
                ->get();

            return response()->json([
                'data' => $result,
                'codigos_alumno' => $codigos,
            ]);
        } else {
            // GET sin filtros
            $conteo = Derivacion::join('alumnos', 'derivacions.codigo_alumno', '=', 'alumnos.codigo_alumno')
                ->select('alumnos.programa_estudios as carrera', 'alumnos.semestre', DB::raw('count(*) as total'))
                ->groupBy('alumnos.programa_estudios', 'alumnos.semestre')
                ->get();

            $codigos = Derivacion::pluck('codigo_alumno')->unique()->values();

            return response()->json([
                'data' => $conteo,
                'codigos_alumno' => $codigos,
            ]);
        }
    }

    public function getDerivacionesByCodigo(Request $request)
    {
        $codigos = $request->input('codigos_alumno');

        // Validar que se envíe un array no vacío
        if (!is_array($codigos) || empty($codigos)) {
            return response()->json(['error' => 'Se requiere un array de códigos de alumno.'], 400);
        }

        // Buscar derivaciones por múltiples códigos con datos del alumno
        $derivaciones = Derivacion::join('alumnos', 'derivacions.codigo_alumno', '=', 'alumnos.codigo_alumno')
            ->select(
                'derivacions.*',
                'alumnos.nombre',
                'alumnos.apellidos',
                'alumnos.correo_institucional',
                'alumnos.programa_estudios',
                'alumnos.semestre',
                'alumnos.estado_civil',
                'alumnos.edad',
                'alumnos.celular',
                'alumnos.sexo'
            )
            ->whereIn('derivacions.codigo_alumno', $codigos)
            ->get();

        if ($derivaciones->isEmpty()) {
            return response()->json(['message' => 'No se encontraron derivaciones para los códigos proporcionados.'], 404);
        }

        return response()->json($derivaciones);
    }
}
