<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\registrogrupal;
use App\Models\Asistencia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AsistenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

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
        // Validación de los datos recibidos
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'Fecha' => 'required|date',
            'Tema' => 'required|string|max:200',
            'Nro_session' => 'required|integer',
            'ResultadoEsperado' => 'required|string|max:200',
            'ComentarioSignificativo' => 'nullable|string|max:200',
            'NroEstudiantesVarones' => 'nullable|integer',
            'NroEstudiantesMujeres' => 'nullable|integer',
            'CumplimientoObjetivo' => 'required|in:SI,NO',
            'InteresDelTema' => 'required|in:SI,NO',
            'ParticipacionAlumnos' => 'required|in:SI,NO',
            'AclaracionDudas' => 'required|in:SI,NO',
            'ReprogramacionDelTema' => 'required|in:SI,NO',
            'Ciclo' => 'required|string|max:3',
            'AnimacionMotivacion' => 'nullable|string|max:200',
            'ApropiacionDesarrollo' => 'nullable|string|max:200',
            'TransferenciaPracticaCompromiso' => 'nullable|string|max:200',
            'Evaluacion' => 'nullable|string|max:200',
            'asistencias' => 'required|array',
            'asistencias.*.codigo_alumno' => 'required|string',
            'asistencias.*.estado' => 'required|boolean',
        ]);

        DB::beginTransaction();

        try {
            // Crear el registro grupal
            $registro = new registrogrupal();
            $registro->user_id = $validated['user_id'];
            $registro->Fecha = $validated['Fecha'];
            $registro->Tema = $validated['Tema'];
            $registro->Nro_session = $validated['Nro_session'];
            $registro->ResultadoEsperado = $validated['ResultadoEsperado'];
            $registro->ComentarioSignificativo = $validated['ComentarioSignificativo'];
            $registro->NroEstudiantesVarones = $validated['NroEstudiantesVarones'];
            $registro->NroEstudiantesMujeres = $validated['NroEstudiantesMujeres'];
            $registro->CumplimientoObjetivo = $validated['CumplimientoObjetivo'];
            $registro->InteresDelTema = $validated['InteresDelTema'];
            $registro->ParticipacionAlumnos = $validated['ParticipacionAlumnos'];
            $registro->AclaracionDudas = $validated['AclaracionDudas'];
            $registro->ReprogramacionDelTema = $validated['ReprogramacionDelTema'];
            $registro->Ciclo = $validated['Ciclo'];
            $registro->AnimacionMotivacion = $validated['AnimacionMotivacion'];
            $registro->ApropiacionDesarrollo = $validated['ApropiacionDesarrollo'];
            $registro->TransferenciaPracticaCompromiso = $validated['TransferenciaPracticaCompromiso'];
            $registro->Evaluacion = $validated['Evaluacion'];
            $registro->save();

            // Registrar las asistencias
            $asistenciasData = [];
            foreach ($request->asistencias as $asistencia) {
                $asistenciasData[] = [
                    'ID_atenciongrupal' => $registro->id,
                    'codigo_alumno' => $asistencia['codigo_alumno'],
                    'estado' => $asistencia['estado'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            Asistencia::insert($asistenciasData);

            DB::commit();

            return response()->json([
                'message' => 'Sesión grupal y asistencias registradas exitosamente.',
                'data' => $registro->load('asistencias')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al registrar la sesión grupal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function  generarCodigoAsistencia()
    {
        $codigo = Str::random(6); // o usar Str::uuid()
        $idSesionTemp = Str::uuid();

        // Guardamos en cache por 15 minutos (900 segundos)
        Cache::put('asistencia_' . $codigo, $idSesionTemp, 900); // clave: asistencia_ABC123

        return response()->json([
            'codigo' => $codigo,
            'uuid' => $idSesionTemp
        ]);
    }

    public function registrarIntentoAsistencia(Request $request)
    {
        $codigo = $request->input('codigo');
        $codigo_alumno = $request->input('codigo_alumno');
        if (!$codigo || !$codigo_alumno) {
            return response()->json(['error' => 'Datos incompletos'], 400);
        }
        // Guardar el código_alumno en cache (array) por 15 minutos
        $cacheKey = 'asistencia_intentos_' . $codigo;
        $alumnos = Cache::get($cacheKey, []);
        if (!in_array($codigo_alumno, $alumnos)) {
            $alumnos[] = $codigo_alumno;
            Cache::put($cacheKey, $alumnos, 900); // 15 minutos
        }
        return response()->json(['success' => true]);
    }

    public function alumnosIntentaronPorCodigo(Request $request)
    {
        $codigo = $request->query('codigo');
        if (!$codigo) {
            return response()->json(['error' => 'Código requerido'], 400);
        }
        $cacheKey = 'asistencia_intentos_' . $codigo;
        $codigos_alumnos = Cache::get($cacheKey, []);
        // Buscar datos de los alumnos en la base de datos
        $alumnos = \App\Models\Alumno::whereIn('codigo_alumno', $codigos_alumnos)
            ->select('codigo_alumno', 'nombre', 'apellidos')
            ->get();
        return response()->json(['alumnos' => $alumnos]);
    }
}
