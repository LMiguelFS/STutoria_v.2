<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class ReporteIController extends Controller
{
    public function indexReporte()
    {
        // Obtiene los datos desde la tabla 'atencionindividuals'
        // Realizar un JOIN para obtener el nombre del motivo
        $datas = DB::table('atencionindividuals')
            ->join('categorias', 'atencionindividuals.id_categoria', '=', 'categorias.id_categoria')
            ->join('alumnos', 'atencionindividuals.codigo_alumno', '=', 'alumnos.codigo_alumno') // JOIN adicional
            ->select(
                'atencionindividuals.fecha_atencion',
                'atencionindividuals.numero_atencion',
                'atencionindividuals.descripcion_consulta',
                'atencionindividuals.acuerdos_establecidos',
                'atencionindividuals.proxima_cita',
                'atencionindividuals.observaciones',
                'atencionindividuals.id_user',
                'atencionindividuals.codigo_alumno',
                'categorias.descripcion', // Selecciona el nombre del motivo
                'alumnos.nombre',      // Selecciona el nombre del alumno
                'alumnos.apellidos',    // Selecciona el apellido del alumno
            )
            ->get();


        // Genera el PDF en formato horizontal (landscape)
        $pdf = PDF::loadView('reporteIndividual', ['datas' => $datas])
            ->setPaper('a4', 'landscape'); // Configura la orientación

        // Devuelve el PDF en el navegador
        return $pdf->stream('Reporte_Sesiones_Individuales.pdf');
    }
    public function indexReporteG()
    {
        $datas = DB::table('registrogrupals')->get();
        // Genera el PDF en formato horizontal (landscape)
        $pdf = PDF::loadView('reporteGrupal', ['datas' => $datas])
            ->setPaper('a4'); // Configura la orientación

        // Devuelve el PDF en el navegador
        return $pdf->stream('Reporte_Sesiones_Grupales.pdf');
    }
}
