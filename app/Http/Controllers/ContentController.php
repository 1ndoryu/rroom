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
                'looking_in' => $profile->looking_in, // AÑADIDO: Incluir looking_in del perfil
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


    public function show($type, $id)
    {
        Log::info("ContentController:show - Mostrando contenido individual. Tipo: $type, ID: $id");

        if ($type === 'room') {
            $room = Room::with(['user', 'images'])->findOrFail($id);
            $item = [
                'id' => $room->id,
                'address' => $room->address,
                'hide_address' => $room->hide_address,
                'property_type' => $room->property_type,
                'rent' => $room->rent,
                'bills_included' => $room->bills_included,
                'security_deposit' => $room->security_deposit,
                'available_on' => $room->available_on,
                'preferred_gender' => $room->preferred_gender,
                'bathroom_type' => $room->bathroom_type,
                'parking' => $room->parking,
                'internet_access' => $room->internet_access,
                'private_room' => $room->private_room,
                'furnished' => $room->furnished,
                'accessible' => $room->accessible,
                'lgbt_friendly' => $room->lgbt_friendly,
                'cannabis_friendly' => $room->cannabis_friendly,
                'cat_friendly' => $room->cat_friendly,
                'dog_friendly' => $room->dog_friendly,
                'children_friendly' => $room->children_friendly,
                'student_friendly' => $room->student_friendly,
                'senior_friendly' => $room->senior_friendly,
                'requires_background_check' => $room->requires_background_check,
                'description' => $room->description,
                'roomies_description' => $room->roomies_description,
                'bedrooms' => $room->bedrooms,
                'bathrooms' => $room->bathrooms,
                'roomies' => $room->roomies,
                'minimum_stay' => $room->minimum_stay,
                'maximum_stay' => $room->maximum_stay,
                'user' => [
                    'id' => $room->user->id,
                    'name' => $room->user->name,
                ],
                'imageUrls' => $room->images->map(fn($image) => $image->url)->toArray(),
                'created_at' => $room->created_at,
                'updated_at' => $room->updated_at,
                'type' => 'room',
            ];

            Log::info("ContentController:show - Detalles de la habitación cargados", ['room' => $item]);
        } elseif ($type === 'profile') {
            $profile = UserProfile::with('user')->findOrFail($id);
            $item = [
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
                'short_description' => $profile->short_description,
                'can_be_contacted' => $profile->can_be_contacted,
                'team_up' => $profile->team_up,
                'looking_in' => $profile->looking_in,
                'accommodation_for' => $profile->accommodation_for,
                'ready_to_move' => $profile->ready_to_move,
                'description' => $profile->description,
                'phone_number' => $profile->phone_number,
                'phone_number_public' => $profile->phone_number_public,
                'lgbt_friendly' => $profile->lgbt_friendly,
                'cannabis_friendly' => $profile->cannabis_friendly,
                'cat_friendly' => $profile->cat_friendly,
                'dog_friendly' => $profile->dog_friendly,
                'children_friendly' => $profile->children_friendly,
                'student_friendly' => $profile->student_friendly,
                'senior_friendly' => $profile->senior_friendly,
                'requires_background_check' => $profile->requires_background_check,
                'type' => 'profile',
            ];

            Log::info("ContentController:show - Detalles del perfil cargados", ['profile' => $item]);
        } else {
            Log::error("ContentController:show - Tipo de contenido no válido: $type");
            abort(404); // O redirige a una página de error 404.
        }

        return Inertia::render('Content/Show', [
            'item' => $item,
        ]);
    }
}
