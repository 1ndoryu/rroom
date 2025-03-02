<?php
// database/migrations/xxxx_xx_xx_create_user_profiles_table.php
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

        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); //  Importante: Clave foránea
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
            //tags
            $table->boolean('lgbt_friendly')->default(false);
            $table->boolean('cannabis_friendly')->default(false);
            $table->boolean('cat_friendly')->default(false);
            $table->boolean('dog_friendly')->default(false);
            $table->boolean('children_friendly')->default(false);
            $table->boolean('student_friendly')->default(false);
            $table->boolean('senior_friendly')->default(false);
            $table->boolean('requires_background_check')->default(false);
            //
            $table->text('description');
            $table->string('phone_number')->nullable();
            $table->boolean('phone_number_public')->default(false);
            $table->string('profile_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
