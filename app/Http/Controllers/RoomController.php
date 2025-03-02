<?php
// app/Http/Controllers/RoomController.php
namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Image;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class RoomController extends Controller
{
    public function index()
    {
        Log::info('RoomController:index - Iniciando la función index.');

        $rooms = Room::with(['user', 'images'])->get();

        $roomsData = $rooms->map(function ($room) {
            return [
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
                // Usa asset() para generar URLs absolutas para las imágenes
                'imageUrls' => $room->images->map(fn ($image) => asset($image->url))->toArray(),
                'created_at' => $room->created_at,
                'updated_at' => $room->updated_at,
            ];
        });

        Log::info('RoomController:index - Habitaciones obtenidas de la base de datos.', ['rooms' => $roomsData]);


        return Inertia::render('Rooms/Index', [
            'rooms' => $roomsData,
        ]);
    }
     public function create()
    {
        Log::info('RoomController:create - Mostrando el formulario de creación de habitación.');
        return Inertia::render('Rooms/Create');
    }

    public function store(Request $request)
{
    Log::info('RoomController:store - Iniciando el proceso de creación de habitación.');

    $validatedData = $request->validate([
        'address' => 'required|string',
        'hide_address' => 'required|boolean',
        'property_type' => 'required|string',
        'rent' => 'required|integer',
        'bills_included' => 'required|boolean',
        'security_deposit' => 'required|integer',
        'available_on' => 'required|date',
        'preferred_gender' => 'required|string',
        'bathroom_type' => 'required|string',
        'parking' => 'required|boolean',
        'internet_access' => 'required|boolean',
        'private_room' => 'required|boolean',
        'furnished' => 'required|boolean',
        'accessible' => 'required|boolean',
        'lgbt_friendly' => 'required|boolean',
        'cannabis_friendly' => 'required|boolean',
        'cat_friendly' => 'required|boolean',
        'dog_friendly' => 'required|boolean',
        'children_friendly' => 'required|boolean',
        'student_friendly' => 'required|boolean',
        'senior_friendly' => 'required|boolean',
        'requires_background_check' => 'required|boolean',
        'description' => 'required|string',
        'roomies_description' => 'required|string',
        'bedrooms' => 'required|integer',
        'bathrooms' => 'required|integer',
        'roomies' => 'required|integer',
        'minimum_stay' => 'required|integer',
        'maximum_stay' => 'required|integer',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    Log::info('RoomController:store - Datos validados exitosamente.');

    $user = Auth::user();
    Log::info("RoomController:store - Usuario autenticado: {$user->name} ({$user->id})");
    $validatedData['user_id'] = $user->id;

     // Crea la habitación *primero* (sin las imágenes)
    $room = Room::create($validatedData);
    Log::info("RoomController:store - Habitación creada con ID: {$room->id}");


    if ($request->hasFile('images')) {
        Log::info('RoomController:store - Procesando imágenes.');
        foreach ($request->file('images') as $image) {
            $path = $image->store('room_images', 'public'); //  Guarda en storage/app/public/room_images
            Log::info("RoomController:store - Imagen guardada en: $path");

            // Crea un registro en la tabla `images` para cada imagen
            $room->images()->create([
                'url' => Storage::url($path), //  Obtiene la URL pública
            ]);
            Log::info("RoomController:store - Imagen asociada a la habitación {$room->id}");
        }
    }

        Log::info('RoomController:store - Redirigiendo a rooms.index.');
        return redirect()->route('rooms.index')->with('success', 'Habitación creada: La habitación ha sido creada con éxito.');
    }

}