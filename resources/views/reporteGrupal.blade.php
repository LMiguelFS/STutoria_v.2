<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Sesiones Grupal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .session-container {
            max-width: 1100px;
            margin: 20px auto;
            padding: 10px;
        }

        .session-box {
            background: #fff;
            padding: 16px;
            margin-bottom: 18px;
            border-radius: 8px;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
        }

        .session-box h3 {
            text-align: center;
            margin-bottom: 12px;
            color: #5a1a9e;
        }

        .styled-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            table-layout: fixed;
        }

        .styled-table th,
        .styled-table td {
            border: 1px solid #ddd;
            padding: 6px 4px;
            text-align: left;
            word-break: break-word;
        }

        .styled-table th {
            background-color: #5a1a9e;
            color: #fff;
            font-weight: bold;
        }

        .styled-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .styled-table tr:hover {
            background-color: #f1f1f1;
        }

        .asistentes-table {
            margin-top: 15px;
        }

        .asistentes-table th {
            background-color: #3a0c6e;
        }

        img {
            max-width: 90px;
            height: auto;
            margin-bottom: 8px;
        }

        footer {
            margin-top: 18px;
            text-align: center;
            font-size: 0.9rem;
            color: #5a1a9e;
        }

        /* Organización en dos columnas */
        .fields-table {
            width: 100%;
            border: none;
        }

        .fields-table td {
            vertical-align: top;
            border: none;
            padding: 0;
        }

        /* Estilos para impresión */
        @media print {
            body {
                background: #fff !important;
            }

            .session-container {
                max-width: 100%;
                margin: 0;
                padding: 0;
            }

            .session-box {
                box-shadow: none;
                margin-bottom: 10px;
                page-break-inside: avoid;
            }

            .styled-table th,
            .styled-table td {
                font-size: 11px;
                padding: 4px 2px;
            }

            footer {
                color: #333;
            }

            @page {
                size: A4 landscape;
                margin: 1cm;
            }
        }
    </style>
</head>

<body>
    <center>
        <!-- Logo -->
        <img src="{{ public_path('img/logo.png') }}" alt="Logo">

        <!-- Title -->
        <h1>REPORTE DE SESIONES GRUPAL</h1>

        <div class="session-container">
            @foreach($datas as $data)
            <div class="session-box">
                <h3>Sesión #{{$data['sesion']->Nro_session}}</h3>
                <table class="fields-table">
                    <tr>
                        <td style="width:50%;">
                            <table class="styled-table">
                                <tr>
                                    <th>Fecha</th>
                                    <td>{{$data['sesion']->Fecha}}</td>
                                </tr>
                                <tr>
                                    <th>Tema</th>
                                    <td>{{$data['sesion']->Tema}}</td>
                                </tr>
                                <tr>
                                    <th>Resultado Esperado</th>
                                    <td>{{$data['sesion']->ResultadoEsperado}}</td>
                                </tr>
                                <tr>
                                    <th>Ciclo</th>
                                    <td>{{$data['sesion']->Ciclo}}</td>
                                </tr>
                                <tr>
                                    <th>N° Varones</th>
                                    <td>{{$data['sesion']->NroEstudiantesVarones}}</td>
                                </tr>
                                <tr>
                                    <th>N° Mujeres</th>
                                    <td>{{$data['sesion']->NroEstudiantesMujeres}}</td>
                                </tr>
                                <tr>
                                    <th>Cumplimiento Objetivo</th>
                                    <td>{{$data['sesion']->CumplimientoObjetivo}}</td>
                                </tr>
                                <tr>
                                    <th>Interés</th>
                                    <td>{{$data['sesion']->InteresDelTema}}</td>
                                </tr>
                            </table>
                        </td>
                        <td style="width:50%;">
                            <table class="styled-table">
                                <tr>
                                    <th>Participación</th>
                                    <td>{{$data['sesion']->ParticipacionAlumnos}}</td>
                                </tr>
                                <tr>
                                    <th>Aclaración Dudas</th>
                                    <td>{{$data['sesion']->AclaracionDudas}}</td>
                                </tr>
                                <tr>
                                    <th>Reprogramación</th>
                                    <td>{{$data['sesion']->ReprogramacionDelTema}}</td>
                                </tr>
                                <tr>
                                    <th>Comentario</th>
                                    <td>{{$data['sesion']->ComentarioSignificativo}}</td>
                                </tr>
                                <tr>
                                    <th>Animación/Motivación</th>
                                    <td>{{$data['sesion']->AnimacionMotivacion}}</td>
                                </tr>
                                <tr>
                                    <th>Apropiación/Desarrollo</th>
                                    <td>{{$data['sesion']->ApropiacionDesarrollo}}</td>
                                </tr>
                                <tr>
                                    <th>Transferencia/Práctica/Compromiso</th>
                                    <td>{{$data['sesion']->TransferenciaPracticaCompromiso}}</td>
                                </tr>
                                <tr>
                                    <th>Evaluación</th>
                                    <td>{{$data['sesion']->Evaluacion}}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Tabla de Asistentes -->
                <h4 style="margin-top: 15px; text-align: left; color: #5a1a9e;">Lista de Asistentes ({{ count($data['asistencias']) }})</h4>
                <table class="styled-table asistentes-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Código</th>
                            <th style="width: 25%;">Nombre Completo</th>
                            <th style="width: 10%;">Edad</th>
                            <th style="width: 25%;">Correo Institucional</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($data['asistencias'] as $asistencia)
                        <tr>
                            <td>{{ $asistencia->codigo_alumno }}</td>
                            <td>{{ $asistencia->nombre }} {{ $asistencia->apellidos }}</td>
                            <td>{{ $asistencia->edad }}</td>
                            <td>{{ $asistencia->correo_institucional }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @endforeach
        </div>

        <!-- Footer -->
        <footer>
            <p>Fecha de generación del reporte: {{ date('d/m/Y') }}</p>
        </footer>
    </center>
</body>

</html>