<?php
// app/Http/Controllers/ContentController.php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Importa Storage

class ContentController extends Controller
{
    public function index(Request $request)
    {
        Log::info('ContentController:index - Iniciando la función index.');

        // Obtener habitaciones
        $rooms = Room::with(['user', 'images'])->latest()->get();
        Log::info('ContentController:index - Habitaciones obtenidas:', ['count' => $rooms->count()]);

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
            Log::info('ContentController:index - Datos de habitación procesados:', ['room' => $roomData]);
            return $roomData;
        });

        // Obtener perfiles de usuario
        $profiles = UserProfile::with('user')->whereHas('user')->latest()->get();
        Log::info('ContentController:index - Perfiles obtenidos:', ['count' => $profiles->count()]);

        $profilesData = $profiles->map(function ($profile) {
            $profileData = [
                'id' => $profile->id,
                'user' => [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                ],
                //  Usa Storage::url para la URL completa
                'profile_image' => $profile->profile_image ? Storage::url($profile->profile_image) : null,
                'name' => $profile->name,
                'budget' => $profile->budget,
                'age' => $profile->age,
                'gender' => $profile->gender,
                'description' => $profile->description,
                'type' => 'profile',
            ];
            Log::info('ContentController:index - Datos de perfil procesados:', ['profile' => $profileData]);
            return $profileData;
        });

        // Combinar los datos
        $combinedData = $roomsData->concat($profilesData)->sortByDesc('created_at')->values()->all();
        Log::info('ContentController:index - Contenido combinado:', ['combinedData' => $combinedData]);

        return Inertia::render('Content/Index', [
            'content' => $combinedData,
        ]);
    }
}
