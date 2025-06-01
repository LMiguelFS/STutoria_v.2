<?php

namespace App\Http\Controllers;

use App\Models\Atencionindividual;
use App\Models\Categoria;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class AtencionindividualController extends Controller
{
    /**
     * Display a listing of the resource.
     */


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validación de los datos enviados en la solicitud
        $validator = Validator::make($request->all(), [
            'fecha_atencion' => 'required|date',
            'numero_atencion' => 'required|integer',
            'descripcion_consulta' => 'nullable|string|max:900',
            'acuerdos_establecidos' => 'nullable|string|max:900',
            'proxima_cita' => 'nullable|date',
            'observaciones' => 'nullable|string|max:900',
            'id_user' => 'required|exists:users,id',
            'codigo_alumno' => 'required|exists:alumnos,codigo_alumno',
            'id_categoria' => 'required|exists:categorias,id_categoria',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 400); // 400 es el código de "Bad Request"
        }


        // Si la validación falla, retorna los errores
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Crear el nuevo registro en la tabla 'atencionindividual'
        $atencion = Atencionindividual::create([
            'fecha_atencion' => $request->fecha_atencion,
            'numero_atencion' => $request->numero_atencion,
            'descripcion_consulta' => $request->descripcion_consulta,
            'acuerdos_establecidos' => $request->acuerdos_establecidos,
            'proxima_cita' => $request->proxima_cita,
            'observaciones' => $request->observaciones,
            'id_user' => $request->id_user,
            'codigo_alumno' => $request->codigo_alumno,
            'id_categoria' => $request->id_categoria,
        ]);

        // Responder con éxito y devolver el registro creado
        return response()->json([
            'message' => 'Atención individual creada exitosamente',
            'data' => $atencion
        ], 201);
    }

    public function obtenerEstadisticas()
    {
        // 1. Cantidad de atenciones por tutor
        $atencionesPorTutor = AtencionIndividual::select('id_user', DB::raw('COUNT(*) as cantidad'))
            ->groupBy('id_user')
            ->get()
            ->map(function ($item) {
                return [
                    'id_user' => $item->id_user,
                    'cantidad' => $item->cantidad,
                ];
            });

        // 2. Cantidad de atenciones por fecha
        $atencionesPorFecha = AtencionIndividual::select(DB::raw('DATE(fecha_atencion) as fecha'), DB::raw('COUNT(*) as cantidad'))
            ->groupBy('fecha')
            ->get()
            ->map(function ($item) {
                return [
                    'fecha' => $item->fecha,
                    'cantidad' => $item->cantidad,
                ];
            });

        // 3. Frecuencia de acuerdos establecidos por categoría
        $frecuenciaPorCategoria = Categoria::withCount(['atenciones' => function ($query) {
            $query->whereNotNull('acuerdos_establecidos');
        }])->get()
            ->map(function ($categoria) {
                return [
                    'id_categoria' => $categoria->id_categoria,
                    'nombre_categoria' => $categoria->descripcion,
                    'frecuencia' => $categoria->atenciones_count,
                ];
            });

        // 4. Relación entre atenciones y próxima cita
        $relacionAtenciones = AtencionIndividual::select('id_user', DB::raw('COUNT(*) as cantidad_atenciones'), DB::raw('AVG(DATEDIFF(proxima_cita, fecha_atencion)) as duracion_promedio'))
            ->groupBy('id_user')
            ->get()
            ->map(function ($item) {
                return [
                    'id_user' => $item->id_user,
                    'cantidad_atenciones' => $item->cantidad_atenciones,
                    'duracion_promedio' => $item->duracion_promedio,
                ];
            });

        // Retornar todas las estadísticas en un solo JSON
        return response()->json([
            'atenciones_por_tutor' => $atencionesPorTutor,
            'atenciones_por_fecha' => $atencionesPorFecha,
            'frecuencia_por_categoria' => $frecuenciaPorCategoria,
            'relacion_atenciones' => $relacionAtenciones,
        ]);
    }

    public function filtrarPorProximaCita(Request $request)
    {
        $request->validate([
            'fecha' => 'nullable|date',

        ]);

        $fecha = $request->input('fecha');
        $id_user = $request->input('id_user');

        if (!$fecha) {
            $atenciones = DB::select("
            SELECT
                ai.id,
                ai.codigo_alumno,
                a.nombre,
                a.apellidos,
                ai.descripcion_consulta,
                ai.proxima_cita,
                ai.observaciones,
                a.celular
            FROM
                atencionindividuals ai
            INNER JOIN
                alumnos a
                ON ai.codigo_alumno = a.codigo_alumno
            WHERE
                ai.proxima_cita > NOW()
                AND ai.id_user = :id_user
        ", ['id_user' => $id_user]);
        } else {
            $atenciones = DB::select("
            SELECT
                ai.id,
                ai.codigo_alumno,
                a.nombre,
                a.apellidos,
                ai.descripcion_consulta,
                ai.proxima_cita,
                ai.observaciones,
                a.celular
            FROM
                atencionindividuals ai
            INNER JOIN
                alumnos a
                ON ai.codigo_alumno = a.codigo_alumno
            WHERE
                DATE(ai.proxima_cita) = :fecha
                AND ai.id_user = :id_user
        ", ['fecha' => $fecha, 'id_user' => $id_user]);
        }

        return response()->json($atenciones);
    }

    //----------------------------------------------------------------------------------------------------------

    public function index(Request $request)
    {
        $id_user = $request->query('id_user'); // Asegúrate de usar 'query' para obtener parámetros de la URL

        $query = AtencionIndividual::query();

        // Verifica que `id_user` se pase correctamente y es válido
        if ($id_user) {
            $query->where('id_user', $id_user);
        } else {
            return response()->json(['error' => 'El ID de usuario es obligatorio'], 400);
        }

        $codigo_alumno = $request->query('codigo_alumno');
        $fecha_atencion = $request->query('fecha_atencion');

        if ($codigo_alumno) {
            $query->where('codigo_alumno', $codigo_alumno);
        }

        if ($fecha_atencion) {
            $query->where('fecha_atencion', $fecha_atencion);
        }

        $registros = $query->get();

        return response()->json($registros, 200);
    }




    // Mostrar un registro específico
    public function show($id)
    {
        $registro = AtencionIndividual::find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        return response()->json($registro, 200);
    }

    // Actualizar un registro
    public function update(Request $request, $id)
    {
        $registro = AtencionIndividual::find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'fecha_atencion' => 'required|date',
            'numero_atencion' => 'required|integer',
            'descripcion_consulta' => 'nullable|string|max:900',
            'acuerdos_establecidos' => 'nullable|string|max:900',
            'proxima_cita' => 'nullable|date',
            'observaciones' => 'nullable|string|max:900',
            'codigo_alumno' => 'required|exists:alumnos,codigo_alumno',
        ]);

        $registro->update($validatedData);

        return response()->json($registro, 200);
    }

    // Eliminar un registro
    public function destroy($id)
    {
        $registro = AtencionIndividual::find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $registro->delete();

        return response()->json(['message' => 'Registro eliminado con éxito'], 200);
    }
}
