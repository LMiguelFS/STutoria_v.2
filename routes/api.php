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
use App\Http\Controllers\DerivacionController;
use App\Models\Asistencia;

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
Route::get('/generar-codigo-asistencia', [AsistenciaController::class, 'generarCodigoAsistencia']);
Route::post('/asistencias/intento', [AsistenciaController::class, 'registrarIntentoAsistencia']);
Route::get('/asistencias/alumnos-intento', [AsistenciaController::class, 'alumnosIntentaronPorCodigo']);

//Conteo de alumnos por sexo
Route::post('/estudiantes/contar-sexo', [AlumnoController::class, 'contarPorSexo']);
//-----------------------------------------------------------------------
Route::apiResource('/alumno', AlumnoController::class);
Route::get('/reporteIndividual', [ReporteIController::class, 'indexReporte']);
Route::get('/reporteGrupal', [ReporteIController::class, 'indexReporteG']);
Route::post('/atencionindividual', [AtencionIndividualController::class, 'store']);


Route::apiResource('/registrogrupals', AtencionGrupalController::class);
Route::apiResource('/asistencia', AsistenciaController::class);
//Route::post('/registrogrupalss', AtencionGrupalController::class);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/motivos/{categoria_id}', [MotivoController::class, 'getByCategoria']);

Route::post('/categorias', [CategoriaController::class, 'store']);
Route::post('/atencionindividual', [AtencionIndividualController::class, 'store']);

Route::put('/alumno/{codigo_alumno}', [AlumnoController::class, 'update']);
Route::apiResource('/alumno', AlumnoController::class);

Route::get('/estadisticaatencion/{id_user}', [AtencionindividualController::class, 'obtenerEstadisticas']);


Route::get('/estadistica/{id_user}', [CategoriaController::class, 'obtenerEstadisticasCategorias']);
Route::get('/atenciones/proxima-cita', [AtencionIndividualController::class, 'filtrarPorProximaCita']);

//ruta para derivar a un alumno al area e psicologia
Route::post('/derivaciones', [DerivacionController::class, 'store']);

// Ruta para obtener los tutores filtrados por carrera y nombre
Route::get('/filtrar/tutores', [Usercontroller::class, 'filtrarTutores']);
//Ruta para obtener cantidad de tutorias grupales por fecha
Route::get('/estadisticaGrupal/por-fecha/{user_id}', [AtencionGrupalController::class, 'contarSesionesPorFecha']);
// Ruta para obtener los temas grupales
Route::get('/temas-grupales/{user_id}', [AtencionGrupalController::class, 'listarTemas']);
// Ruta para obtener la cantidad de alumnos(mujeres y varones) por tema
Route::match(['GET', 'POST'], '/cantidad-alumnos-sesion/{id?}', [AtencionGrupalController::class, 'cantidadAlumnosPorTema']);

// GET y POST en la misma ruta
Route::match(['get', 'post'], '/derivaciones/estadisticas', [DerivacionController::class, 'derivacionesPorCarreraYCiclo']);
//Ruta para mostrar lista de derivaciones
Route::post('/list-derivaciones', [DerivacionController::class, 'getDerivacionesByCodigo']);
//Ruta para obtener los tutores por carrera
Route::get('/tutores/carrera', [Usercontroller::class, 'tutorPorCarrera']);
//Ruta estadistica #N de usuarios
Route::get('/numero-usuarios', [Usercontroller::class, 'NumeroUsuarios']);
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
