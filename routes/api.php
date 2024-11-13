<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AtencionindividualController;
use App\Http\Controllers\AlumnoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/atencionindividual', [AtencionindividualController::class, 'store']);

Route::post('/alumno', [AlumnoController::class, 'store']);
route::get(
    '/students',
    function () {
        return 'student list';
    }
);
