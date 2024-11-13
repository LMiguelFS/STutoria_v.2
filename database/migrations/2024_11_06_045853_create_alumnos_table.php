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
        Schema::create('alumno', function (Blueprint $table) {
            $table->string('codigo_alumno', 45)->primary();
            $table->string('correo_institucional', 40)->nullable();
            $table->string('nombre', 45);
            $table->string('apellidos', 45);
            $table->string('programa_estudios', 45)->nullable();
            $table->string('semestre', 45)->nullable();
            $table->string('estado_civil', 45)->nullable();
            $table->integer('edad')->nullable();
            $table->integer('celular')->nullable();
            $table->string('sexo', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumnos');
    }
};
