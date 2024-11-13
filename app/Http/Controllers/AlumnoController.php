<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Alumno;
use Illuminate\Support\Facades\Validator;

class AlumnoController extends Controller
{
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
}
