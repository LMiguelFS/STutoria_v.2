<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Alumno;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AlumnoController extends Controller
{
    public function index(Request $request)
    {
        $query = Alumno::query(); // Asegúrate de que el modelo sea el correcto

        if ($request->has('codigo_alumno') && $request->codigo_alumno) {
            $codigo = $request->codigo_alumno;
            $query->whereRaw('CAST(codigo_alumno AS CHAR) = ?', [$codigo]);
        }


        // Filtrar por nombre (usando LIKE para buscar coincidencias parciales)
        if ($request->has('nombre') && $request->nombre) {
            $query->where('nombre', 'like', '%' . $request->nombre . '%');
        }

        // Filtrar por semestre
        if ($request->has('semestre') && $request->semestre) {
            $query->where('semestre', $request->semestre);
        }

        // Obtener los resultados filtrados
        return response()->json($query->get());
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'codigo_alumno'  => 'required',
            'correo_institucional' => 'required',
            'nombre' => 'required',
            'apellidos' => 'required',
            'programa_estudios' => 'required',
            'semestre' => 'required',
            'estado_civil' => 'required',
            'edad' => 'required',
            'celular' => 'required',
            'sexo' => 'required',


        ]);

        $alumno = Alumno::create([
            'codigo_alumno'  => $request->codigo_alumno,
            'correo_institucional' => $request->correo_institucional,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'programa_estudios' => $request->programa_estudios,
            'semestre' => $request->semestre,
            'estado_civil' => $request->estado_civil,
            'edad' => $request->edad,
            'celular' => $request->celular,
            'sexo' => $request->sexo

        ]);
    }

    public function update(Request $request, $codigo_alumno)
    {
        // Validación
        $request->validate([
            'nombre' => 'required|string|max:45',
            'apellidos' => 'required|string|max:45',
            'semestre' => 'nullable|string|max:45',
            'correo_institucional' => 'nullable|string|max:40',
            'programa_estudios' => 'nullable|string|max:45',
            'estado_civil' => 'nullable|string|max:45',
            'edad' => 'nullable|integer',
            'celular' => 'nullable|integer',
            'sexo' => 'nullable|string|max:45',
        ]);

        // Encuentra al alumno
        $alumno = Alumno::findOrFail($codigo_alumno);

        // Actualiza los campos
        $alumno->update([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'semestre' => $request->semestre,
            'correo_institucional' => $request->correo_institucional,
            'programa_estudios' => $request->programa_estudios,
            'estado_civil' => $request->estado_civil,
            'edad' => $request->edad,
            'celular' => $request->celular,
            'sexo' => $request->sexo,
        ]);

        return response()->json($alumno, 200); // Responde con los datos actualizados
    }

    public function destroy($codigo_alumno)
    {
        try {
            // Buscar al alumno por su código
            $alumno = Alumno::find($codigo_alumno);

            // Verificar si el alumno existe
            if (!$alumno) {
                return response()->json([
                    'success' => false,
                    'message' => 'El alumno no fue encontrado.',
                ], 404);
            }

            // Eliminar el registro
            $alumno->delete();

            return response()->json([
                'success' => true,
                'message' => 'Alumno eliminado correctamente.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al intentar eliminar el alumno.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function buscar(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:50'
        ]);

        $query = $request->input('q');

        $alumnos = Alumno::select([
            'alumnos.codigo_alumno',
            'alumnos.nombre',
            'alumnos.apellidos',
            'atencionindividuals.numero_atencion',
            DB::raw('(SELECT MAX(numero_atencion) FROM atencionindividuals WHERE codigo_alumno = alumnos.codigo_alumno) as ultima_sesion')
        ])
            ->leftJoin('atencionindividuals', function ($join) {
                $join->on('alumnos.codigo_alumno', '=', 'atencionindividuals.codigo_alumno')
                    ->whereRaw('atencionindividuals.id = (
                     SELECT MAX(id)
                     FROM atencionindividuals
                     WHERE codigo_alumno = alumnos.codigo_alumno
                 )');
            })
            ->where(function ($q) use ($query) {
                $q->where('alumnos.nombre', 'like', "%$query%")
                    ->orWhere('alumnos.apellidos', 'like', "%$query%")
                    ->orWhere('alumnos.codigo_alumno', 'like', "%$query%");
            })
            ->orderBy('alumnos.apellidos')
            ->limit(10)
            ->get()
            ->map(function ($alumno) {
                $alumno->proxima_sesion = $alumno->ultima_sesion ? $alumno->ultima_sesion + 1 : 1;
                return $alumno;
            });

        return response()->json([
            'success' => true,
            'data' => $alumnos,
            'count' => $alumnos->count()
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'alumnos' => 'required|array',
            'alumnos.*.Codigo' => 'required|unique:alumnos,codigo_alumno',
            'alumnos.*.Nombre' => 'required|string|max:45',
            'alumnos.*.Apellidos' => 'required|string',
            'alumnos.*.Semestre' => 'nullable|string|max:45',
            'alumnos.*.Correo' => 'nullable|string|max:40|email',
            'alumnos.*.Programa' => 'nullable|string|max:45',
            'alumnos.*.EstadoCivil' => 'nullable|string|max:45',
            'alumnos.*.Edad' => 'nullable|integer|min:15|max:80',
            'alumnos.*.Celular' => 'nullable|integer|digits_between:9,15',
            'alumnos.*.Sexo' => 'nullable|string|max:45|in:M,F,Otro',
        ]);

        DB::beginTransaction();

        try {
            $imported = 0;
            $skipped = 0;
            $errors = [];

            foreach ($request->alumnos as $index => $alumnoData) {
                try {
                    if (!Alumno::where('codigo_alumno', $alumnoData['Codigo'])->exists()) {
                        Alumno::create([
                            'codigo_alumno' => $alumnoData['Codigo'],
                            'nombre' => $alumnoData['Nombre'],
                            'apellidos' => $alumnoData['Apellidos'],
                            'semestre' => $alumnoData['Semestre'] ?? null,
                            'correo_institucional' => $alumnoData['Correo'] ?? null,
                            'programa_estudios' => $alumnoData['Programa'] ?? null,
                            'estado_civil' => $alumnoData['EstadoCivil'] ?? null,
                            'edad' => $alumnoData['Edad'] ?? null,
                            'celular' => $alumnoData['Celular'] ?? null,
                            'sexo' => $alumnoData['Sexo'] ?? null,
                        ]);
                        $imported++;
                    } else {
                        $skipped++;
                        $errors[] = "Fila {$index}: Alumno con código {$alumnoData['Codigo']} ya existe";
                    }
                } catch (\Exception $e) {
                    $errors[] = "Fila {$index}: " . $e->getMessage();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Importación completada: $imported nuevos registros, $skipped existentes omitidos",
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error en la importación',
                'error' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }
}
