<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Sesiones Individuales</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f0ff;
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
            color: #6a0dad;
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
            background-color: #6a0dad;
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
            height: auto;
            margin-bottom: 10px;
        }

        footer {
            margin-top: 20px;
            font-size: 0.9rem;
            color: #6a0dad;
            text-align: center;
        }
    </style>
</head>

<body>
    <center>
        <!-- Logo -->
        <img src="{{ public_path('img/logo.png') }}" alt="Logo">

        <!-- Title -->
        <h1>REPORTE DE SESIONES INDIVIDUALES</h1>

        <div class="session-container">
            @foreach($datas as $data)
            <div class="session-box">
                <h3>Sesión Individual - {{$data->codigo_alumno}}</h3>
                <table class="styled-table">
                    <tr>
                        <th>Nombre</th>
                        <td>{{$data->nombre}}</td>
                        <th>Apellidos</th>
                        <td>{{$data->apellidos}}</td>
                    </tr>
                    <tr>
                        <th>Fecha Atención</th>
                        <td>{{$data->fecha_atencion}}</td>
                        <th>N° Atención</th>
                        <td>{{$data->numero_atencion}}</td>
                    </tr>
                    <tr>
                        <th>Descripción</th>
                        <td colspan="3">{{$data->descripcion_consulta}}</td>
                    </tr>
                    <tr>
                        <th>Acuerdos</th>
                        <td colspan="3">{{$data->acuerdos_establecidos}}</td>
                    </tr>
                    <tr>
                        <th>Próxima Cita</th>
                        <td>{{$data->proxima_cita}}</td>
                        <th>Observación</th>
                        <td>{{$data->observaciones}}</td>
                    </tr>
                    <tr>
                        <th>Categoría</th>
                        <td colspan="3">{{$data->descripcion}}</td>
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