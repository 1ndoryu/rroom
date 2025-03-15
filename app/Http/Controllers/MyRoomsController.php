<?php
// app/Http/Controllers/MyRoomsController.php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MyRoomsController extends Controller
{
    public function index()
    {
        Log::info('MyRoomsController:index - START');
        $userId = Auth::id(); // Obtiene el ID del usuario autenticado.  ¡Importante!

        // Obtener las habitaciones *del usuario actual* con sus relaciones.
        $rooms = Room::with(['user', 'images'])
            ->where('user_id', $userId)  // Filtra por user_id.
            ->latest()
            ->get()
            ->map(function ($room) {
                Log::info("MyRoomsController:index - Procesando Habitación (ID: {$room->id})");
                return [
                    'id'              => $room->id,
                    'user'            => [
                        'id'   => $room->user->id,
                        'name' => $room->user->name,
                    ],
                    'imageUrls'       => $room->images->map(fn($image) => $image->url)->toArray(),
                    'address'         => $room->address,
                    'rent'            => $room->rent,
                    'preferred_gender' => $room->preferred_gender,
                    'description'     => $room->description,
                    'type'            => 'room',
                    'created_at'      => $room->created_at,
                ];
            });

        Log::info('MyRoomsController:index - FIN - Renderizando vista.');
        return Inertia::render('MyRooms/Index', [
            'rooms' => $rooms,  // Pasa *solo* las habitaciones del usuario.
        ]);
    }
}
