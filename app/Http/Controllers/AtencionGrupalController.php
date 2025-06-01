<?php

namespace App\Http\Controllers;

use App\Models\registrogrupal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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

    public function generarQR(Request $request)
    {
        $request->validate([
            'ID_atenciongrupal' => 'required|exists:registrogrupals,id',
            'duracion_minutos' => 'required|integer|min:1|max:120'
        ]);

        $codigoTemporal = Str::upper(Str::random(8)); // Ej: "A1B2C3D4"

        // Almacenar en caché por tiempo limitado (Redis o file)
        Cache::put('qr-sesion-' . $codigoTemporal, [
            'ID_atenciongrupal' => $request->ID_atenciongrupal,
            'valido_hasta' => now()->addMinutes($request->duracion_minutos)
        ], $request->duracion_minutos * 60);

        // Generar QR (usando simplesoftwareio/simple-qrcode)
        $qrCode = QrCode::size(200)
            ->generate(route('asistencia.registrar.qr', $codigoTemporal));

        return response()->json([
            'qr_code' => $qrCode,
            'codigo_temporal' => $codigoTemporal,
            'valido_hasta' => now()->addMinutes($request->duracion_minutos)->toDateTimeString()
        ]);
    }
}
