<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class ReporteIController extends Controller
{
    public function indexReporte(Request $request)
    {
        // Recibe las fechas desde la petición GET
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $idUser = $request->query('id_user');

        // Construye la consulta con filtro de fechas si se proporcionan
        $query = DB::table('atencionindividuals')
            ->join('categorias', 'atencionindividuals.id_categoria', '=', 'categorias.id_categoria')
            ->join('alumnos', 'atencionindividuals.codigo_alumno', '=', 'alumnos.codigo_alumno')
            ->select(
                'atencionindividuals.fecha_atencion',
                'atencionindividuals.numero_atencion',
                'atencionindividuals.descripcion_consulta',
                'atencionindividuals.acuerdos_establecidos',
                'atencionindividuals.proxima_cita',
                'atencionindividuals.observaciones',
                'atencionindividuals.id_user',
                'atencionindividuals.codigo_alumno',
                'categorias.descripcion',
                'alumnos.nombre',
                'alumnos.apellidos',
            );

        if ($startDate && $endDate) {
            $query->whereBetween('atencionindividuals.fecha_atencion', [$startDate, $endDate]);
        }
        if ($idUser) {
            $query->where('atencionindividuals.id_user', $idUser);
        }

        $datas = $query->get();


        // Genera el PDF en formato horizontal (landscape)
        $pdf = PDF::loadView('reporteIndividual', ['datas' => $datas])
            ->setPaper('a4', 'landscape'); // Configura la orientación

        // Devuelve el PDF en el navegador
        return $pdf->stream('Reporte_Sesiones_Individuales.pdf');
    }

    public function indexReporteG(Request $request)
    {
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $idUser = $request->query('id_user');

        $query = DB::table('registrogrupals');

        if ($startDate && $endDate) {
            $query->whereBetween('Fecha', [$startDate, $endDate]);
        } elseif ($startDate) {
            $query->where('Fecha', '>=', $startDate);
        } elseif ($endDate) {
            $query->where('Fecha', '<=', $endDate);
        }

        if ($idUser) {
            $query->where('user_id', $idUser);
        }

        $datas = $query->get();

        $pdf = PDF::loadView('reporteGrupal', ['datas' => $datas])
            ->setPaper('a4'); // Configura la orientación

        return $pdf->stream('Reporte_Sesiones_Grupales.pdf');
    }
}
