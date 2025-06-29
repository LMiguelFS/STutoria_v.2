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
        Schema::create('derivacions', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_alumno');
            $table->string('domicilio_actual');
            $table->string('actualmente_vive_con');
            $table->string('motivo_derivacion');
            $table->date('fecha_derivacion');
            $table->timestamps();

            $table->foreign('codigo_alumno')
                ->references('codigo_alumno')
                ->on('alumnos')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('derivacions');
    }
};
