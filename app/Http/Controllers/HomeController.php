<?php
// app/Http/Controllers/HomeController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; 


class HomeController extends Controller
{
    public function index()
    {
        Log::info('HomeController:index - Iniciando la función index.');

        // Obtener habitaciones aleatorias (máximo 6)
        $rooms = Room::with(['user', 'images'])->inRandomOrder()->limit(6)->get();
        Log::info('HomeController:index - Habitaciones obtenidas:', ['count' => $rooms->count()]);

        $roomsData = $rooms->map(function ($room) {
            $roomData = [
                'id' => $room->id,
                'user' => [
                    'id' => $room->user->id,
                    'name' => $room->user->name,
                ],
                'imageUrls' => $room->images->map(fn($image) => $image->url)->toArray(),
                'address' => $room->address,
                'rent' => $room->rent,
                'preferred_gender' => $room->preferred_gender,
                'description' => $room->description,
                'type' => 'room',
            ];
            Log::info('HomeController:index - Datos de habitación procesados:', ['room' => $roomData]);
            return $roomData;
        });

        // Obtener perfiles de usuario aleatorios (máximo 6)
        $profiles = UserProfile::with('user')->whereHas('user')->inRandomOrder()->limit(6)->get();
        Log::info('HomeController:index - Perfiles obtenidos:', ['count' => $profiles->count()]);

        $profilesData = $profiles->map(function ($profile) {
            $profileData = [
                'id' => $profile->id,
                'user' => [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                ],
                // Usa Storage::url para obtener la URL completa
                'profile_image' => $profile->profile_image ? Storage::url($profile->profile_image) : null,
                'name' => $profile->name,
                'age' => $profile->age,
                'gender' => $profile->gender,
                'budget' => $profile->budget,
                'description' => $profile->description,
                'type' => 'profile',
                'looking_in' => $profile->looking_in, // AÑADIDO: Incluir looking_in del perfil
            ];
            Log::info('HomeController:index - Datos de perfil procesados:', ['profile' => $profileData]);
            return $profileData;
        });

        // Combinar y limitar a 6 elementos en total
        $combinedData = $roomsData->concat($profilesData)->shuffle()->take(6)->values()->all();
        Log::info('HomeController:index - Contenido combinado y limitado:', ['combinedData' => $combinedData]);

        return Inertia::render('Home', [
            'rooms' => $combinedData, // NOTA: Aquí la variable se llama 'rooms' en lugar de 'content'
        ]);
    }
}