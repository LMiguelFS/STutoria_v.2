<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//use App\Http\Controllers\AtencionIndividualController;
use App\Http\Controllers\AtencionGrupalController;

// Route::get('/login', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });




Route::get('/registroindividual', function () {
    return Inertia::render('registroindividual'); // Asegúrate de que el nombre coincida con el archivo en Pages
})->name('registroindividual');



Route::get('/', function () {
    return Inertia::render('Auth/Login'); // Especifica el directorio Auth
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// Route::view('/atencion-grupal', 'welcome');
// Route::prefix('api/atencion-grupal')->group(function () {
//     Route::get('/', [AtencionGrupalController::class, 'index']);
//     Route::post('/', [AtencionGrupalController::class, 'store']);
//     Route::put('/{id}', [AtencionGrupalController::class, 'update']);
//     Route::delete('/{id}', [AtencionGrupalController::class, 'destroy']);
// });

Route::get('/estadisticas', function () {
    return Inertia::render('estadisticaatencion'); // Asegúrate de que el nombre coincida con el archivo en Pages
})->name('estadisticaatencion');

require __DIR__ . '/auth.php';
