<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegistroGrupal;
use App\Models\Asistencia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;

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
        $validated = $request->validate([
            // Tus reglas de validación existentes para RegistroGrupal
        ]);

        DB::beginTransaction();

        try {
            // 1. Crear el registro grupal
            $registro = RegistroGrupal::create($validated);

            // 2. Registrar las asistencias
            if ($request->has('asistencias')) {
                $asistenciasData = [];

                foreach ($request->asistencias as $codigo_alumno => $asistio) {
                    $asistenciasData[] = [
                        'ID_atenciongrupal' => $registro->id,
                        'codigo_alumno' => $codigo_alumno,
                        'estado' => $asistio,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }

                // Insertar todas las asistencias en una sola operación
                Asistencia::insert($asistenciasData);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registro y asistencias guardados correctamente',
                'data' => $registro->load('asistencias')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el registro',
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

    public function registrarConQR($codigoTemp, Request $request)
    {
        // 1. Verificar código temporal
        $datosSesion = Cache::get('qr-sesion-' . $codigoTemp);

        if (!$datosSesion) {
            return response()->json(['error' => 'El código QR ha expirado'], 410);
        }

        if (now()->gt($datosSesion['valido_hasta'])) {
            return response()->json(['error' => 'El período de registro ha finalizado'], 410);
        }
        // 2. Obtener estudiante autenticado (ajusta según tu sistema)
        $alumno = Auth::user();

        // 3. Registrar en tu tabla asistencias existente
        try {
            DB::transaction(function () use ($datosSesion, $alumno) {
                Asistencia::create([
                    'ID_atenciongrupal' => $datosSesion['ID_atenciongrupal'],
                    'codigo_alumno' => $alumno->codigo_alumno,
                    'estado' => true // Asistió
                ]);

                // Opcional: Actualizar contador en la sesión grupal
                RegistroGrupal::where('id', $datosSesion['ID_atenciongrupal'])
                    ->increment('asistentes_confirmados');
            });

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Ya has registrado asistencia a esta sesión'
            ], 409);
        }
    }
}
