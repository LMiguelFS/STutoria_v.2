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
        Schema::create('motivos', function (Blueprint $table) {
            $table->id(); // Clave primaria (id INT AUTO_INCREMENT PRIMARY KEY)
            $table->unsignedBigInteger('id_categoria'); // Relación con categorias
            $table->string('nombre', 255); // Nombre del motivo
            $table->timestamps(); // Campos created_at y updated_at

            // Definir la clave foránea
            $table->foreign('id_categoria')->references('id')->on('categorias')->onDelete('cascade'); // Eliminar en cascada si se borra la categoría
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motivos');
    }
};
