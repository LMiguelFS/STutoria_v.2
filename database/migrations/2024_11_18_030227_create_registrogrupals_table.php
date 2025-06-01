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
        Schema::create('registrogrupals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Relación con la tabla users
            $table->integer('Nro_session');
            $table->date('Fecha');
            $table->string('Tema', 200);
            $table->string('ResultadoEsperado', 200);
            $table->integer('NroEstudiantesVarones');
            $table->integer('NroEstudiantesMujeres');
            $table->char('CumplimientoObjetivo', 2);
            $table->char('InteresDelTema', 2);
            $table->char('ParticipacionAlumnos', 2);
            $table->char('AclaracionDudas', 2);
            $table->char('ReprogramacionDelTema', 2);
            $table->char('Ciclo', 3);
            $table->string('ComentarioSignificativo', 200)->nullable();
            $table->string('AnimacionMotivacion', 200)->nullable();
            $table->string('ApropiacionDesarrollo', 200)->nullable();
            $table->string('TransferenciaPracticaCompromiso', 200)->nullable();
            $table->string('Evaluacion', 200)->nullable();
            $table->timestamps(); // Opcional: agrega timestamps para created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrogrupals');
    }
};
