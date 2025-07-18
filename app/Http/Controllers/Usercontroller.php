<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;

class Usercontroller extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'rol' => 'required|string|in:tutor,psicologo,admin',
            'programa_estudios' => 'nullable|string|max:255',
            'celular' => 'nullable|string|max:15'
        ]);

        $user = DB::table('users')->insert($data);

        return response()->json(['message' => 'Usuario creado exitosamente', 'user' => $user], 201);
    }

    public function RecuperarID(Request $request)
    {
        $Correo = $request->input('email');

        if (!$Correo) {
            return response()->json(['error' => 'El correo es obligatorio.'], 400);
        }

        $usuario = DB::selectOne("
        SELECT u.id as id FROM users u
        WHERE u.email = :email
    ", ['email' => $Correo]);

        if (!$usuario) {
            return response()->json(['error' => 'No se encontró un usuario con este correo.'], 404);
        }

        return response()->json(['id' => $usuario->id]);
    }

    public function filtrarTutores(Request $request)
    {
        $carrera = $request->input('carrera');
        $nombre = $request->input('nombre');

        $query = DB::table('users')
            ->select('id', 'nombres', 'apellidos', 'programa_estudios')
            ->where('rol', 'tutor'); // Siempre filtra por tutor

        if ($carrera && $carrera !== 'Todos') {
            $query->where('programa_estudios', $carrera);
        }

        if ($nombre) {
            $query->where(function ($q) use ($nombre) {
                $q->where('nombres', 'like', '%' . $nombre . '%')
                    ->orWhere('apellidos', 'like', '%' . $nombre . '%');
            });
        }

        $tutores = $query->get();

        return response()->json($tutores);
    }

    public function tutorPorCarrera(Request $request)
    {

        $tutores = DB::table('users')
            ->select('nombres', 'apellidos', 'programa_estudios', 'rol', 'celular', 'email')
            ->get();

        return response()->json($tutores);
    }

    public function NumeroUsuarios()
    {
        $numeroTutoresPorCarrera = DB::table('users')
            ->select('programa_estudios', DB::raw('COUNT(*) as total'))
            ->where('rol', 'tutor')
            ->groupBy('programa_estudios')
            ->get();

        $numeroPsicologos = DB::table('users')
            ->where('rol', 'psicologo')
            ->count();
        $numeroAdmin = DB::table('users')
            ->where('rol', 'admin')
            ->count();

        return response()
            ->json([
                'numero_tutores' => $numeroTutoresPorCarrera,
                'numero_psicologos' => $numeroPsicologos,
                'numero_admin' => $numeroAdmin
            ]);
    }
}
