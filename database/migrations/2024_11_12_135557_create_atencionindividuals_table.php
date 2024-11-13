<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('atencionindividuals', function (Blueprint $table) {
            $table->date('fecha_atencion'); // Campo fecha_atencion de tipo fecha
            $table->integer('numero_atencion'); // Campo numero_atencion de tipo entero
            $table->string('descripcion_consulta', 900)->nullable(); // Campo descripcion_consulta de tipo VARCHAR(900)
            $table->string('acuerdos_establecidos', 900)->nullable(); // Campo acuerdos_establecidos de tipo VARCHAR(900)
            $table->date('proxima_cita')->nullable(); // Campo proxima_cita de tipo fecha, puede ser nulo
            $table->string('observaciones', 900)->nullable(); // Campo observaciones de tipo VARCHAR(900), puede ser nulo

            // Campos de claves foráneas
            $table->unsignedBigInteger('id_user'); // Clave foránea que apunta a 'users'
            $table->string('codigo_alumno'); // Clave foránea que apunta a 'alumno'
            $table->unsignedBigInteger('id_motivo'); // Clave foránea que apunta a 'motivo'

            // Definir las claves foráneas
            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('codigo_alumno')->references('codigo_alumno')->on('alumnos')->onDelete('cascade');
            $table->foreign('id_motivo')->references('id_motivo')->on('motivos')->onDelete('cascade');



            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atencionindividuals');
    }
};
