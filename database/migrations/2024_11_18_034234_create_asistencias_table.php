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
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId("ID_atenciongrupal")->constrained('registrogrupals');;
            $table->string("codigo_alumno");
            $table->boolean("estado");
            $table->timestamps();

            // Definir las claves foráneas
            $table->foreign('codigo_alumno')->references('codigo_alumno')->on('alumnos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
