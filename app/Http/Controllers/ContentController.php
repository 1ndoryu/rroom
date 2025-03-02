<?php
// app/Http/Controllers/ContentController.php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ContentController extends Controller
{
    public function index(Request $request)
    {
        Log::info('ContentController:index - Iniciando la función index.');

        $searchTerm = $request->input('search');
        Log::info('ContentController:index - Término de búsqueda:', ['searchTerm' => $searchTerm]);

        // Obtener habitaciones
        $roomsQuery = Room::with(['user', 'images']);
        if ($searchTerm) {
            $roomsQuery->where(function ($query) use ($searchTerm) {
                $query->where('address', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%')
                      ->orWhereHas('user', function ($q) use ($searchTerm) { // Buscar en el nombre del usuario
                          $q->where('name', 'like', '%' . $searchTerm . '%');
                      });
            });
        }

        DB::enableQueryLog();
        $rooms = $roomsQuery->latest()->get();
        $queryLogRooms = DB::getQueryLog();
        Log::info('ContentController:index - Consultas SQL de habitaciones:', ['queryLog' => $queryLogRooms]);
        Log::info('ContentController:index - Habitaciones obtenidas:', ['count' => $rooms->count()]);

        $roomsData = $rooms->map(function ($room) {
           //igual
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
        $profilesQuery = UserProfile::with('user')->whereHas('user');
        if ($searchTerm) {
            $profilesQuery->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%')
                      ->orWhereHas('user', function ($q) use ($searchTerm) { // Buscar en el nombre del usuario
                        $q->where('name', 'like', '%' . $searchTerm . '%');
                      });
            });
        }

        DB::disableQueryLog();
        DB::enableQueryLog();
        $profiles = $profilesQuery->latest()->get();
        $queryLogProfiles = DB::getQueryLog();
        Log::info('ContentController:index - Consultas SQL de perfiles:', ['queryLog' => $queryLogProfiles]);
        Log::info('ContentController:index - Perfiles obtenidos:', ['count' => $profiles->count()]);

        $profilesData = $profiles->map(function ($profile) {
             //igual
            $profileData = [
                'id' => $profile->id,
                'user' => [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                ],
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

        $combinedData = $roomsData->concat($profilesData)->sortByDesc('created_at')->values()->all();
        Log::info('ContentController:index - Contenido combinado:', ['combinedData' => $combinedData]);

        return Inertia::render('Content/Index', [
            'content' => $combinedData,
            'searchTerm' => $searchTerm,
        ]);
    }
}