<?php
// database/migrations/xxxx_xx_xx_create_user_profiles_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->unsignedInteger('age');
            $table->string('gender');
            $table->string('short_description');
            $table->boolean('can_be_contacted')->default(true);
            $table->string('team_up')->nullable();
            $table->string('looking_in');
            $table->decimal('budget', 8, 2);
            $table->string('accommodation_for');
            $table->date('ready_to_move');
            $table->boolean('lgbt_friendly')->default(false);
            $table->boolean('cannabis_friendly')->default(false);
            $table->boolean('cat_friendly')->default(false);
            $table->boolean('dog_friendly')->default(false);
            $table->boolean('children_friendly')->default(false);
            $table->boolean('student_friendly')->default(false);
            $table->boolean('senior_friendly')->default(false);
            $table->boolean('requires_background_check')->default(false);
            $table->text('description');
            $table->string('phone_number')->nullable();
            $table->boolean('phone_number_public')->default(false);
			//Usa addColumn para que no de error si la columna ya existe
            $table->addColumn('string', 'profile_image', ['nullable' => true, 'after' => 'phone_number_public']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};