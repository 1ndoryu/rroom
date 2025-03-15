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
use Illuminate\Validation\Rule;



class RoomController extends Controller
{
    public function index()
    {
        Log::info('RoomController:index - Iniciando la función index.');

        $rooms = Room::with(['user', 'images'])->latest()->get();

        $roomsData = $rooms->map(function ($room) {
            return [
                'id' => $room->id,
                'city' => $room->city,
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
                // Usa asset() para generar URLs absolutas para las imágenes, o solo url
                'imageUrls' => $room->images->map(fn($image) => $image->url)->toArray(),
                'created_at' => $room->created_at,
                'updated_at' => $room->updated_at,
            ];
        });

        Log::info('RoomController:index - Habitaciones obtenidas de la base de datos.', ['rooms' => $roomsData]);


        return Inertia::render('Rooms/Index', [
            'rooms' => $roomsData,
        ]);
    }

    public function update(Request $request, Room $room) // Route Model Binding
    {
        Log::info("RoomController:update - START - Updating room with ID: {$room->id}");

        //Verificar propietario
        if (Auth::id() !== $room->user_id) {
            Log::warning("RoomController:update - User is not the owner.  Room ID: {$room->id}, User ID: " . Auth::id());
            abort(403, 'Unauthorized action.');
        }

        // Validación (¡IMPORTANTE!  Reutiliza las reglas de validación, pero adaptadas)
        $validatedData = $request->validate([
            'address'            => 'required|string|max:255',
            'city'                    => 'required',
            'hide_address'         => 'boolean',
            'property_type'        => 'required|string|max:255',
            'rent'                 => 'required|numeric|min:0',
            'bills_included'       => 'boolean',
            'security_deposit'     => 'nullable|numeric|min:0', // Permitir nulo.
            'available_on'         => 'nullable|date',
            'preferred_gender'     => 'required|string|max:255',
            'bathroom_type'        => 'required|string|max:255',
            'parking'              => 'boolean',
            'internet_access'      => 'boolean',
            'private_room'         => 'boolean',
            'furnished'            => 'boolean',
            'accessible'           => 'boolean',
            'lgbt_friendly'        => 'boolean',
            'cannabis_friendly'    => 'boolean',
            'cat_friendly'         => 'boolean',
            'dog_friendly'         => 'boolean',
            'children_friendly'    => 'boolean',
            'student_friendly'     => 'boolean',
            'senior_friendly'      => 'boolean',
            'requires_background_check' => 'boolean',
            'description'          => 'required|string|min:75',
            'roomies_description'  => 'nullable|string|min:75', // Permitir nulo.
            'bedrooms'             => 'required|integer|min:1',
            'bathrooms'            => 'required|integer|min:1',
            'roomies'              => 'required|integer|min:1',
            'minimum_stay'         => 'nullable|integer|min:0', // Permitir nulo.
            'maximum_stay'         => 'nullable|integer|min:0',
            'images.*.id'          => 'nullable|exists:room_images,id', //  IDs de imágenes existentes.
            'images.*.url'         => 'nullable|string',       // URLs de imágenes existentes.
            'new_images.*'      => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Nuevas imágenes

        ]);

        // Actualizar los campos de la habitación.
        $room->update([
            'address'            => $validatedData['address'],
            'city'                    => $validatedData['city'],
            'hide_address'         => $validatedData['hide_address'],
            'property_type'        => $validatedData['property_type'],
            'rent'                 => $validatedData['rent'],
            'bills_included'       => $validatedData['bills_included'],
            'security_deposit'     => $validatedData['security_deposit'],
            'available_on'         => $validatedData['available_on'],
            'preferred_gender'     => $validatedData['preferred_gender'],
            'bathroom_type'        => $validatedData['bathroom_type'],
            'parking'              => $validatedData['parking'],
            'internet_access'      => $validatedData['internet_access'],
            'private_room'         => $validatedData['private_room'],
            'furnished'            => $validatedData['furnished'],
            'accessible'           => $validatedData['accessible'],
            'lgbt_friendly'        => $validatedData['lgbt_friendly'],
            'cannabis_friendly'   => $validatedData['cannabis_friendly'],
            'cat_friendly'          => $validatedData['cat_friendly'],
            'dog_friendly'          => $validatedData['dog_friendly'],
            'children_friendly'   => $validatedData['children_friendly'],
            'student_friendly'    => $validatedData['student_friendly'],
            'senior_friendly'     => $validatedData['senior_friendly'],
            'requires_background_check' => $validatedData['requires_background_check'],
            'description'          => $validatedData['description'],
            'roomies_description'  => $validatedData['roomies_description'],
            'bedrooms'             => $validatedData['bedrooms'],
            'bathrooms'            => $validatedData['bathrooms'],
            'roomies'              => $validatedData['roomies'],
            'minimum_stay'         => $validatedData['minimum_stay'],
            'maximum_stay'         => $validatedData['maximum_stay'],
        ]);

        // --- Gestión de Imágenes ---
        // 1. Eliminar imágenes (si se solicitaron eliminaciones)
        if (!empty($validatedData['images'])) {
            $existingImageIds = collect($validatedData['images'])->pluck('id')->filter(); // Obtener IDs *no nulos*.
            $imagesToDelete = $room->images()->whereNotIn('id', $existingImageIds)->get();

            foreach ($imagesToDelete as $image) {
                Storage::delete($image->url); // Eliminar archivo.
                $image->delete();             // Eliminar registro.
                Log::info("RoomController:update - Imagen eliminada: {$image->url}");
            }
        }

        // 2. Agregar nuevas imágenes
        if ($request->hasFile('new_images')) { // Usar $request directamente.
            foreach ($request->file('new_images') as $imageFile) {
                $path = $imageFile->store('room_images'); // Guarda y obtiene la ruta.
                // Crear el registro en la base de datos.
                $room->images()->create(['url' => $path]);
                Log::info("RoomController:update - Nueva imagen guardada: $path");
            }
        }

        Log::info("RoomController:update - END - Room updated successfully.");
        return redirect()->route('myrooms.index')->with('success', 'Room updated successfully!'); //Redirigir
    }

    public function create()
    {
        Log::info('RoomController:create - Mostrando el formulario de creación de habitación.');
        return Inertia::render('Rooms/Create');
    }

    public function edit(Room $room) // Route Model Binding
    {
        Log::info("RoomController:edit - START - Editing room with ID: {$room->id}");

        //Verificar propietario
        if (Auth::id() !== $room->user_id) {
            Log::warning("RoomController:edit - User is not the owner. Room ID: {$room->id}, User ID: " . Auth::id());
            abort(403, 'Unauthorized action.'); // O redirigir con mensaje de error.
        }

        // Cargar las imágenes relacionadas.  *Importante* para que el formulario las muestre.
        $room->load('images');

        // Preparar los datos para la vista.  Formato compatible con el formulario.
        $roomData = [
            'id'                      => $room->id,
            'address'                 => $room->address,
            'city'                    => $room->city,
            'hide_address'            => (bool)$room->hide_address, // Convertir a boolean.
            'property_type'           => $room->property_type,
            'rent'                    => (string)$room->rent,    // Convertir a string.
            'bills_included'          => (bool)$room->bills_included,
            'security_deposit'        => (string)$room->security_deposit,
            'available_on'            => $room->available_on,
            'preferred_gender'        => $room->preferred_gender,
            'bathroom_type'           => $room->bathroom_type,
            'parking'                 => (bool)$room->parking,
            'internet_access'         => (bool)$room->internet_access,
            'private_room'            => (bool)$room->private_room,
            'furnished'               => (bool)$room->furnished,
            'accessible'              => (bool)$room->accessible,
            'lgbt_friendly'           => (bool)$room->lgbt_friendly,
            'cannabis_friendly'        => (bool)$room->cannabis_friendly,
            'cat_friendly'            => (bool)$room->cat_friendly,
            'dog_friendly'            => (bool)$room->dog_friendly,
            'children_friendly'       => (bool)$room->children_friendly,
            'student_friendly'         => (bool)$room->student_friendly,
            'senior_friendly'         => (bool)$room->senior_friendly,
            'requires_background_check' => (bool)$room->requires_background_check,
            'description'             => $room->description,
            'roomies_description'     => $room->roomies_description,
            'bedrooms'                => (string)$room->bedrooms,
            'bathrooms'               => (string)$room->bathrooms,
            'roomies'                 => (string)$room->roomies,
            'minimum_stay'            => (string)$room->minimum_stay,
            'maximum_stay'            => (string)$room->maximum_stay,
            // Preparar las URLs de las imágenes existentes.
            'images'                  => $room->images->map(fn($image) => ['url' => $image->url, 'id' => $image->id])->toArray(),

        ];

        Log::info("RoomController:edit - END - Rendering view with room data", $roomData);
        return Inertia::render('Rooms/Edit', [  // Renderiza la vista 'Rooms/Edit'.
            'room' => $roomData,        // Pasa los datos *preparados*.
        ]);
    }


    public function store(Request $request)
    {
        Log::info('RoomController:store - Iniciando el proceso de creación de habitación.');

        $validatedData = $request->validate([
            'address' => 'required|string',
            'city' => 'required|string',
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
            Log::info('RoomController:store - Se encontraron archivos de imágenes en la solicitud.');
            $files = $request->file('images');
            $images = is_array($files) ? $files : [$files]; // Ensure $images is always an array

            Log::info('RoomController:store - Cantidad de imágenes recibidas:', ['count' => count($images)]);

            foreach ($images as $image) {
                Log::info('RoomController:store - Procesando imagen:', ['nombre_original' => $image->getClientOriginalName()]);
                try {
                    $path = $image->store('room_images', 'public'); //  Guarda en storage/app/public/room_images
                    Log::info("RoomController:store - Imagen guardada exitosamente en: $path");

                    // Crea un registro en la tabla `images` para cada imagen
                    $room->images()->create([
                        'url' => Storage::url($path), //  Obtiene la URL pública, // Usa Storage::url para URLs relativas al almacenamiento
                    ]);
                    Log::info("RoomController:store - Imagen asociada a la habitación {$room->id} con URL: " . Storage::url($path));
                } catch (\Exception $e) {
                    Log::error('RoomController:store - Error al guardar la imagen:', ['error' => $e->getMessage(), 'nombre_original' => $image->getClientOriginalName()]);
                }
            }
        } else {
            Log::info('RoomController:store - No se encontraron archivos de imágenes en la solicitud.');
        }


        Log::info('RoomController:store - Redirigiendo a rooms.index.');
        return redirect()->route('rooms.index')->with('success', 'Habitación creada: La habitación ha sido creada con éxito.'); //Se redirige a rooms.index
    }

    public function destroy(Room $room) //Usa Route Model Binding
    {
        Log::info("RoomController:destroy - START - Deleting room with ID: {$room->id}");

        //Verificar que sea el propetario
        if (Auth::id() !== $room->user_id) {
            Log::warning("RoomController:destroy - User is not the owner. Room ID: {$room->id}, User ID: " . Auth::id());
            abort(403, 'Unauthorized action.'); // Or redirect with an error message.
        }


        // Eliminar imágenes asociadas (si las hay).  Importante para evitar archivos huérfanos.
        foreach ($room->images as $image) {
            Storage::delete($image->url); //  Elimina el archivo físico.
            $image->delete();             // Elimina el registro de la base de datos.
        }

        $room->delete(); // Elimina la habitación.
        Log::info("RoomController:destroy - END - Room deleted successfully.");

        return redirect()->route('myrooms.index')->with('success', 'Room deleted successfully.'); //Redirige a la pagina principal
    }
}
