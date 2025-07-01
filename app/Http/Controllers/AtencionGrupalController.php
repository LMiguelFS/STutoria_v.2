<?php

namespace App\Http\Controllers;

use App\Models\registrogrupal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AtencionGrupalController extends Controller
{
    public function index(Request $request)
    {
        $query = registrogrupal::query();

        // Filtrar por id_usuario
        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        // Filtrar por Fecha
        if ($request->has('Fecha') && $request->Fecha) {
            $query->where('Fecha', $request->Fecha);
        }

        // Filtrar por Tema
        if ($request->has('Tema') && $request->Tema) {
            $query->where('Tema', 'like', '%' . $request->Tema . '%');
        }

        // Filtrar por Número de Sesión
        if ($request->has('Nro_session') && $request->Nro_session) {
            $query->where('Nro_session', $request->Nro_session);
        }

        return response()->json($query->get());
    }

    public function destroy($id)
    {
        $registro = RegistroGrupal::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Registro eliminado con éxito']);
    }

    public function update(Request $request, $id)
    {
        $registro = RegistroGrupal::findOrFail($id);

        // Validación de los datos (opcional)
        $request->validate([
            'Fecha' => 'required|date',
            'Tema' => 'required|string|max:200',
            'Nro_session' => 'required|integer',
            'ResultadoEsperado' => 'nullable|string|max:200',
            'NroEstudiantesVarones' => 'required|integer',
            'NroEstudiantesMujeres' => 'required|integer',
            'CumplimientoObjetivo' => 'required|string|max:2',
        ]);

        // Actualización del registro
        $registro->update($request->all());

        return response()->json($registro);
    }

    // Método para crear una nueva sesión grupal
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
        ]);

        // Crear un nuevo registro en la base de datos
        $registro = new RegistroGrupal();
        //$registro->user_id = Auth::id(); // Asumiendo que el usuario está autenticado
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

        $registro->save(); // Guardar el registro

        return response()->json(['message' => 'Sesión grupal registrada exitosamente.', 'data' => $registro], 201);
    }


    // Retorna el conteo de sesiones grupales de un tutor
    public function countByUser(Request $request)
    {
        $userId = $request->query('user_id');
        $count = RegistroGrupal::where('user_id', $userId)->count();
        return response()->json(['count' => $count]);
    }

    public function contarSesionesPorFecha(Request $request, $user_id)
    {
        $resultados = DB::table('registrogrupals')
            ->select('Fecha', DB::raw('COUNT(*) as cantidad'))
            ->where('user_id', $user_id)
            ->groupBy('Fecha')
            ->orderBy('Fecha')
            ->get()
            ->map(function ($item) {
                return [
                    'Fecha' => $item->Fecha,
                    'Cantidad' => $item->cantidad,
                ];
            });
        return response()->json($resultados);
    }

    public function listarTemas($user_id)
    {
        $temas = DB::table('registrogrupals')
            ->select('id', 'Tema')
            ->where('user_id', $user_id)
            ->orderBy('Tema')
            ->get();

        return response()->json($temas);
    }

    public function cantidadAlumnosPorTema(Request $request, $id = null)
    {
        // Permite recibir un solo id por ruta o un array de ids por query/body
        $ids = $id ? [$id] : $request->input('ids', []);

        if (empty($ids)) {
            return response()->json(['error' => 'Debe proporcionar al menos un id'], 400);
        }

        $sesiones = DB::table('registrogrupals')
            ->select('id', 'Tema', 'Fecha', 'NroEstudiantesVarones', 'NroEstudiantesMujeres')
            ->whereIn('id', $ids)
            ->get();

        if ($sesiones->isEmpty()) {
            return response()->json(['error' => 'Sesión(es) no encontrada(s)'], 404);
        }

        // Si solo es un id, devuelve un solo objeto, si son varios, un array
        $resultados = $sesiones->map(function ($sesion) {
            $total = ($sesion->NroEstudiantesVarones ?? 0) + ($sesion->NroEstudiantesMujeres ?? 0);
            return [
                'tema' => $sesion->Tema,
                'fecha' => $sesion->Fecha,
                'varones' => $sesion->NroEstudiantesVarones,
                'mujeres' => $sesion->NroEstudiantesMujeres,
                'total' => $total,
            ];
        });

        // Si solo hay un resultado y se pidió un solo id, devuelve objeto, si no, array
        if (count($resultados) === 1) {
            return response()->json($resultados->first());
        }
        return response()->json($resultados);
    }
}
