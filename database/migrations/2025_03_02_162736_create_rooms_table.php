<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_rooms_table.php

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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('address');
            $table->boolean('hide_address');
            $table->string('property_type');
            $table->integer('rent');
            $table->boolean('bills_included');
            $table->integer('security_deposit');
            $table->date('available_on');
            $table->string('preferred_gender');
            $table->string('bathroom_type');
            $table->boolean('parking');
            $table->boolean('internet_access');
            $table->boolean('private_room');
            $table->boolean('furnished');
            $table->boolean('accessible');
            $table->boolean('lgbt_friendly');
            $table->boolean('cannabis_friendly');
            $table->boolean('cat_friendly');
            $table->boolean('dog_friendly');
            $table->boolean('children_friendly');
            $table->boolean('student_friendly');
            $table->boolean('senior_friendly');
            $table->boolean('requires_background_check');
            $table->text('description');
            $table->text('roomies_description');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('roomies');
            $table->integer('minimum_stay');
            $table->integer('maximum_stay');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
