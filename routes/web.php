<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//use App\Http\Controllers\AtencionIndividualController;
use App\Http\Controllers\AtencionGrupalController;

Route::get('/', function () {
    return Inertia::render('Auth/Login'); // Especifica el directorio Auth
});

Route::middleware(['auth', 'verified'])->group(function () {
    //Dashboard route para tutor
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    //Dashboard route para Admin/psicologo
    Route::get('/dashboard-Admin', function () {
        return Inertia::render('DashboardAdmin');
    })->name('dashboard.AdminPsicologo');

    Route::get('/prueba', function () {
        return Inertia::render('Admin/GestionUsuarios');
    })->name('GestionUsuarios');

    Route::get('/tutoria', function () {
        return Inertia::render('Admin/SesionesTutoria');
    })->name('STutoria');

    Route::get('/derivaciones', function () {
        return Inertia::render('Admin/Derivaciones');
    })->name('derivaciones');
});


//Asistencia route
Route::get('/asistencia', function () {
    return Inertia::render('Asistencia/RegistroAsistenciaPage');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});





Route::get('/estadisticas', function () {
    return Inertia::render('estadisticaatencion'); // Asegúrate de que el nombre coincida con el archivo en Pages
})->name('estadisticaatencion');

require __DIR__ . '/auth.php';
