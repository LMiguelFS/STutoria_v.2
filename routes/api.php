<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AtencionindividualController;
use App\Http\Controllers\MotivoController;
use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\notificacionController;
use App\Http\Controllers\ReporteIController;
use App\Http\Controllers\AtencionGrupalController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\Usercontroller;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Rutas operaciones Alumnos
Route::post('/alumno', [AlumnoController::class, 'store']);
Route::get('/alumnos', [AlumnoController::class, 'index']);
Route::get('/alumnos/buscar', [AlumnoController::class, 'buscar']);

// Ruta para obtener todos los motivos
Route::get('/motivo', [MotivoController::class, 'index']);
Route::apiResource('/atencionindividual', AtencionindividualController::class);
Route::apiResource('/categorias', CategoriaController::class);
Route::post('/motivo', [MotivoController::class, 'store']);
Route::get('/buscar', [notificacionController::class, 'buscar']);

//Ruta para importar alumnos desde un archivo CSV
Route::post('/alumnos/import', [AlumnoController::class, 'import']);
//Contar registros de atención grupal por usuario
Route::get('/registrogrupals/count', [AtencionGrupalController::class, 'countByUser']);
//Generar QR para asistencia
Route::post('/sesiones/generar-qr', [AtencionGrupalController::class, 'generarQR']);
Route::post('/asistencias/registrar/{codigoTemp}', [AsistenciaController::class, 'registrarConQR']);
//-----------------------------------------------------------------------
Route::apiResource('/alumno', AlumnoController::class);
Route::get('/reporteIndividual', [ReporteIController::class, 'indexReporte']);
Route::post('/atencionindividual', [AtencionIndividualController::class, 'store']);
Route::get('/reporteGrupal', [ReporteIController::class, 'indexReporteG']);

Route::apiResource('/registrogrupals', AtencionGrupalController::class);
Route::apiResource('/asistencia', AsistenciaController::class);
//Route::post('/registrogrupalss', AtencionGrupalController::class);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/motivos/{categoria_id}', [MotivoController::class, 'getByCategoria']);

Route::post('/categorias', [CategoriaController::class, 'store']);
Route::post('/atencionindividual', [AtencionIndividualController::class, 'store']);

Route::put('/alumno/{codigo_alumno}', [AlumnoController::class, 'update']);
Route::apiResource('/alumno', AlumnoController::class);

Route::get('/estadisticaatencion', [AtencionindividualController::class, 'obtenerEstadisticas']);


Route::get('/estadistica', [CategoriaController::class, 'obtenerEstadisticasCategorias']);
Route::get('/atenciones/proxima-cita', [AtencionIndividualController::class, 'filtrarPorProximaCita']);

//---------------------------------------@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-----------------------------
// APIs para Atención Individual
Route::prefix('atencionindividuals')->group(function () {
    //Route::get('/', [AtencionIndividualController::class, 'index']); // Obtener todos los registros
    Route::get('/{id}', [AtencionIndividualController::class, 'show']); // Obtener un registro por ID
    Route::post('/', [AtencionIndividualController::class, 'store']); // Crear un nuevo registro
    Route::put('/{id}', [AtencionIndividualController::class, 'update']); // Actualizar un registro existente
    Route::delete('/{id}', [AtencionIndividualController::class, 'destroy']); // Eliminar un registro
});

Route::get('/atencionindividuals', [AtencionIndividualController::class, 'index']);

Route::post('/recuperar-id', [Usercontroller::class, 'RecuperarID']);

//use App\Http\Controllers\RegistroGrupalController;

Route::post('/registro-grupal', [AtencionGrupalController::class, 'store']);
Route::get('/registro-grupal', [AtencionGrupalController::class, 'index']);



