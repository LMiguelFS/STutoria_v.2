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
            max-width: 1000px;
            margin: 20px auto;
            padding: 10px;
        }

        .session-box {
            background: #fff;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
        }

        .session-box h3 {
            text-align: center;
            margin-bottom: 15px;
            color: #5a1a9e;
        }

        .styled-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 14px;
        }

        .styled-table th,
        .styled-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
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

        img {
            max-width: 100px;
            /* Reducir tamaño de la imagen */
            height: auto;
            margin-bottom: 10px;
        }

        footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9rem;
            color: #5a1a9e;
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
                <h3>Sesión #{{$data->Nro_session}}</h3>
                <table class="styled-table">
                    <tr>
                        <th>Fecha</th>
                        <td>{{$data->Fecha}}</td>
                        <th>Tema</th>
                        <td>{{$data->Tema}}</td>
                    </tr>
                    <tr>
                        <th>Resultado Esperado</th>
                        <td>{{$data->ResultadoEsperado}}</td>
                        <th>Ciclo</th>
                        <td>{{$data->Ciclo}}</td>
                    </tr>
                    <tr>
                        <th>N° Varones</th>
                        <td>{{$data->NroEstudiantesVarones}}</td>
                        <th>N° Mujeres</th>
                        <td>{{$data->NroEstudiantesMujeres}}</td>
                    </tr>
                    <tr>
                        <th>Cumplimiento Objetivo</th>
                        <td>{{$data->CumplimientoObjetivo}}</td>
                        <th>Interés</th>
                        <td>{{$data->InteresDelTema}}</td>
                    </tr>
                    <tr>
                        <th>Participación</th>
                        <td>{{$data->ParticipacionAlumnos}}</td>
                        <th>Aclaración Dudas</th>
                        <td>{{$data->AclaracionDudas}}</td>
                    </tr>
                    <tr>
                        <th>Reprogramación</th>
                        <td>{{$data->ReprogramacionDelTema}}</td>
                        <th>Comentario</th>
                        <td>{{$data->ComentarioSignificativo}}</td>
                    </tr>
                    <tr>
                        <th>Animación/Motivación</th>
                        <td>{{$data->AnimacionMotivacion}}</td>
                        <th>Apropiación/Desarrollo</th>
                        <td>{{$data->ApropiacionDesarrollo}}</td>
                    </tr>
                    <tr>
                        <th>Transferencia/Práctica/Compromiso</th>
                        <td>{{$data->TransferenciaPracticaCompromiso}}</td>
                        <th>Evaluación</th>
                        <td>{{$data->Evaluacion}}</td>
                    </tr>
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