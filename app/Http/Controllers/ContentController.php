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
        // --- INICIO: Configuración Inicial y Recepción de Parámetros ---
        Log::info('INICIO - ContentController:index');

        $searchTerm = $request->input('search');
        $filterCategory = $request->input('filterCategory', 'All Listing');
        $filterGender = $request->input('filterGender', 'All');
        $filterCities = $request->input('cities', []); // Get cities as an array, default empty
        $filterMinPrice = $request->input('minPrice', 0); // Get minPrice, default 0
        $filterMaxPrice = $request->input('maxPrice', 0); // Get maxPrice, default 0


        Log::info('Parámetros Recibidos:', [
            'Término de Búsqueda' => $searchTerm,
            'Categoría'          => $filterCategory,
            'Género'              => $filterGender,
            'Ciudades'            => $filterCities,
            'Precio Mínimo'       => $filterMinPrice,
            'Precio Máximo'       => $filterMaxPrice,
        ]);
        // --- FIN: Configuración Inicial y Recepción de Parámetros ---



        // --- INICIO: Inicialización de Colecciones ---
        $roomsData = collect();     // Colección para los datos de habitaciones
        $profilesData = collect();  // Colección para los datos de perfiles
        // --- FIN: Inicialización de Colecciones ---


        // --- INICIO: Lógica de Filtrado para Habitaciones (Rooms) ---
        if (in_array($filterCategory, ['All Listing', 'Rooms', 'PG'])) {
            Log::info("FILTRO: Categoría incluye Habitaciones ('Rooms', 'PG' o 'All Listing').");

            // 1.  Consulta Base:  Obtener todas las habitaciones *con* sus usuarios e imágenes relacionadas.
            $roomsQuery = Room::with(['user', 'images']);
            Log::info("Consulta Base (Rooms): Inicializada.");

            // 2.  Filtro por Término de Búsqueda (si existe)
            if ($searchTerm) {
                Log::info("FILTRO (Rooms): Aplicando búsqueda por término: '$searchTerm'.");
                $roomsQuery->where(function ($query) use ($searchTerm) {
                    $query->where('address', 'ILIKE', '%' . $searchTerm . '%')           // Buscar en 'address'
                        ->orWhere('description', 'ILIKE', '%' . $searchTerm . '%')     // Buscar en 'description'
                        ->orWhere('city', 'ILIKE', '%' . $searchTerm . '%')          // Buscar en 'city'
                        ->orWhereHas('user', function ($q) use ($searchTerm) {       // Buscar en el 'name' del usuario relacionado
                            $q->where('name', 'ILIKE', '%' . $searchTerm . '%');
                        });
                });
            }

            // 3. Filtro por Género (si no es 'All')
            if ($filterGender !== 'All') {
                Log::info("FILTRO (Rooms): Aplicando filtro por género: '$filterGender'.");

                // Preparar los valores de género para la consulta.
                $roomGenderValues = [];
                if ($filterGender === 'male') {
                    $roomGenderValues = ['males', 'male'];  // Aceptar 'males' y 'male'.
                } elseif ($filterGender === 'female') {
                    $roomGenderValues = ['females', 'female']; // Aceptar 'females' y 'female'.
                } else {
                    $roomGenderValues = [$filterGender];  // Otros casos (aunque no se esperan).
                }
                Log::info("Valores de Género (Rooms): " . json_encode($roomGenderValues));

                // Aplicar el filtro 'whereIn' a la consulta.
                $roomsQuery->whereIn('preferred_gender', $roomGenderValues);
                Log::info("FILTRO (Rooms): Consulta SQL después de aplicar género: " . $roomsQuery->toSql());

            } else {
                Log::info("FILTRO (Rooms): Sin filtro de género (se seleccionó 'All').");
            }

            // 4. Filter by Cities
            if (!empty($filterCities)) {
                Log::info("FILTRO (Rooms): Aplicando filtro por ciudades: " . json_encode($filterCities));
                $roomsQuery->whereIn('city', $filterCities);
            }

            // 5. Filter by price range
            if ($filterMinPrice > 0 || $filterMaxPrice > 0) {
                Log::info("FILTRO (Rooms): Aplicando filtro de rango de precio: Min $filterMinPrice, Max $filterMaxPrice");
                if ($filterMinPrice > 0) {
                    $roomsQuery->where('rent', '>=', $filterMinPrice);
                }
                if ($filterMaxPrice > 0) {
                    $roomsQuery->where('rent', '<=', $filterMaxPrice);
                }
            }

            // 6. Ejecutar la Consulta y Obtener Resultados
            DB::enableQueryLog();          // Habilitar el registro de consultas SQL (para depuración).
            $rooms = $roomsQuery->latest()->get();  // Obtener las habitaciones más recientes que coincidan.
            $queryLogRooms = DB::getQueryLog();     // Obtener el registro *completo* de las consultas ejecutadas.
            DB::disableQueryLog();

            Log::info("CONSULTA (Rooms): SQL Ejecutado: " . json_encode($queryLogRooms));
            //Log::info('Resultados (Rooms): ', $rooms->toArray()); // Muestra *todos* los datos en bruto.  Usar con cuidado.

            // 7.  Transformar los Resultados (Formato Final)
            $roomsData = $rooms->map(function ($room) {
                Log::info("Procesando Habitación (ID: {$room->id}, Género Preferido: {$room->preferred_gender})");
                return [
                    'id'              => $room->id,
                    'user'            => [
                        'id'   => $room->user->id,
                        'name' => $room->user->name,
                    ],
                    'imageUrls'       => $room->images->map(fn($image) => $image->url)->toArray(),  // Obtener URLs de las imágenes.
                    'address'         => $room->address,
                    'rent'            => $room->rent,
                    'city'            => $room->city,
                    'preferred_gender' => $room->preferred_gender,
                    'description'     => $room->description,
                    'type'            => 'room',           // Tipo de contenido (para la vista).
                    'created_at'      => $room->created_at,
                ];
            });
            Log::info("Habitaciones Procesadas: " . $roomsData->count());
        }
        // --- FIN: Lógica de Filtrado para Habitaciones (Rooms) ---




        // --- INICIO: Lógica de Filtrado para Perfiles (Roommates) ---
        if (in_array($filterCategory, ['All Listing', 'Roommates'])) {
             Log::info("FILTRO: Categoría incluye Perfiles ('Roommates' o 'All Listing').");

            // 1. Consulta Base:  Obtener todos los perfiles de usuario *con* sus usuarios relacionados
            $profilesQuery = UserProfile::with('user')->whereHas('user');
            Log::info("Consulta Base (Profiles): Inicializada.");


            // 2. Filtro por Término de Búsqueda
            if ($searchTerm) {
                Log::info("FILTRO (Profiles): Aplicando búsqueda por término: '$searchTerm'.");
                $profilesQuery->where(function ($query) use ($searchTerm) {
                    $query->where('name', 'ILIKE', '%' . $searchTerm . '%')          // Buscar en 'name' del perfil.
                        ->orWhere('description', 'ILIKE', '%' . $searchTerm . '%')   // Buscar en 'description'.
                        ->orWhere('looking_in', 'ILIKE', '%' . $searchTerm . '%')   // Buscar en 'looking_in'.
                        ->orWhereHas('user', function ($q) use ($searchTerm) {      // Buscar en el 'name' del usuario relacionado
                            $q->where('name', 'ILIKE', '%' . $searchTerm . '%');
                        });
                });
            }


            // 3. Filtro por Género
            if ($filterGender !== 'All') {
                Log::info("FILTRO (Profiles): Aplicando filtro por género: '$filterGender'.");

                $profileGenderValues = [];
                if ($filterGender === 'male') {
                    $profileGenderValues = ['male', 'males'];
                } elseif ($filterGender === 'female') {
                    $profileGenderValues = ['female', 'females'];
                } else {
                    $profileGenderValues = [$filterGender]; // otros
                }
                Log::info("Valores de Género (Profiles):" . json_encode($profileGenderValues));

                $profilesQuery->whereIn('gender', $profileGenderValues);
                 Log::info("FILTRO (Profiles): Consulta SQL después de aplicar género: " . $profilesQuery->toSql());
            } else {
                Log::info("FILTRO (Profiles): Sin filtro de género (se seleccionó 'All').");
            }

            // 4. Filter by Cities
            if (!empty($filterCities)) {
                Log::info("FILTRO (Profiles): Aplicando filtro por ciudades: " . json_encode($filterCities));
                $profilesQuery->whereIn('looking_in', $filterCities); // Use looking_in for profiles
            }

            // 5. Filter by price range (budget)
            if ($filterMinPrice > 0 || $filterMaxPrice > 0) {
                Log::info("FILTRO (Profiles): Aplicando filtro de rango de precio: Min $filterMinPrice, Max $filterMaxPrice");
                if ($filterMinPrice > 0) {
                    $profilesQuery->where('budget', '>=', $filterMinPrice);
                }
                if ($filterMaxPrice > 0) {
                    $profilesQuery->where('budget', '<=', $filterMaxPrice);
                }
            }

            // 6. Ejecutar la Consulta y Obtener Resultados
            DB::enableQueryLog();
            $profiles = $profilesQuery->latest()->get();
            $queryLogProfiles = DB::getQueryLog();
             DB::disableQueryLog();
            Log::info("CONSULTA (Profiles): SQL Ejecutado: " . json_encode($queryLogProfiles));
            //Log::info('Resultados (Profiles): ', $profiles->toArray()); // Usar con cuidado.


            // 7. Transformar los Resultados (Formato Final)
            $profilesData = $profiles->map(function ($profile) {
                Log::info("Procesando Perfil (ID: {$profile->id}, Género: {$profile->gender})");
                return [
                    'id'             => $profile->id,
                    'user'           => [
                        'id'   => $profile->user->id,
                        'name' => $profile->user->name,
                    ],
                    'profile_image'  => $profile->profile_image ? Storage::url($profile->profile_image) : null, // URL de la imagen de perfil.
                    'name'           => $profile->name,
                    'budget'         => $profile->budget,
                    'age'            => $profile->age,
                    'gender'         => $profile->gender,
                    'description'    => $profile->description,
                    'type'           => 'profile',        // Tipo de contenido (para la vista).
                    'looking_in'     => $profile->looking_in,
                    'created_at'     => $profile->created_at,
                ];
            });
            Log::info("Perfiles Procesados: " . $profilesData->count());
        }
        // --- FIN: Lógica de Filtrado para Perfiles (Roommates) ---



        // --- INICIO: Combinación y Ordenamiento de Resultados ---
        Log::info("Combinando Habitaciones y Perfiles...");
        $combinedData = $roomsData->concat($profilesData)->sortByDesc('created_at')->values()->all(); // Combinar, ordenar por 'created_at' (descendente) y convertir a array.
        Log::info("Total de Resultados Combinados: " . count($combinedData));
        // --- FIN: Combinación y Ordenamiento de Resultados ---


        // --- INICIO: Retorno de la Vista con Datos ---
        Log::info('FIN - ContentController:index - Renderizando vista.');
        return Inertia::render('Content/Index', [  // Renderizar la vista 'Content/Index' con los datos.
            'content'        => $combinedData,    // Los datos combinados de habitaciones y perfiles.
            'searchTerm'     => $searchTerm,     // El término de búsqueda original.
            'filterCategory' => $filterCategory, // La categoría de filtro original.
            'filterGender'   => $filterGender,   // El género de filtro original.
            'filterCities'    => $filterCities,     // The filter cities
            'filterMinPrice'  => $filterMinPrice,   // The min price
            'filterMaxPrice'  => $filterMaxPrice    // The max price
        ]);
        // --- FIN: Retorno de la Vista con Datos ---
    }


    public function show($type, $id)
    {
       // --- INICIO: Configuración Inicial y Verificación de Tipo ---
        Log::info("INICIO - ContentController:show - Mostrando detalles. Tipo: '$type', ID: $id");

        // Verificar si el tipo es válido ('room' o 'profile').
        if ($type !== 'room' && $type !== 'profile') {
            Log::error("ERROR: Tipo de contenido inválido: '$type'.");
            abort(404); // Terminar la ejecución y mostrar un error 404.
        }
        // --- FIN: Configuración Inicial y Verificación de Tipo ---


        // --- INICIO: Lógica para Mostrar una Habitación (Room) ---
        if ($type === 'room') {
            Log::info("Cargando detalles de la habitación (ID: $id)...");

            // 1.  Obtener la habitación con sus relaciones (usuario e imágenes).
            $room = Room::with(['user', 'images'])->findOrFail($id);  // findOrFail: Lanza una excepción si no se encuentra.

            // 2.  Construir el array de datos para la vista.
            $item = [
                'id'              => $room->id,
                'address'         => $room->address,
                'hide_address'    => $room->hide_address,
                'property_type'   => $room->property_type,
                'rent'            => $room->rent,
                'bills_included'  => $room->bills_included,
                'security_deposit' => $room->security_deposit,
                'available_on'    => $room->available_on,
                'preferred_gender' => $room->preferred_gender,
                'bathroom_type'   => $room->bathroom_type,
                'parking'         => $room->parking,
                'internet_access' => $room->internet_access,
                'private_room'    => $room->private_room,
                'furnished'       => $room->furnished,
                'accessible'      => $room->accessible,
                'lgbt_friendly'   => $room->lgbt_friendly,
                'cannabis_friendly' => $room->cannabis_friendly,
                'cat_friendly'    => $room->cat_friendly,
                'dog_friendly'    => $room->dog_friendly,
                'children_friendly' => $room->children_friendly,
                'student_friendly' => $room->student_friendly,
                'senior_friendly' => $room->senior_friendly,
                'requires_background_check' => $room->requires_background_check,
                'description'     => $room->description,
                'roomies_description' => $room->roomies_description,
                'bedrooms'        => $room->bedrooms,
                'bathrooms'       => $room->bathrooms,
                'roomies'         => $room->roomies,
                'minimum_stay'    => $room->minimum_stay,
                'maximum_stay'    => $room->maximum_stay,
                'user'            => [  // Información del usuario.
                    'id'   => $room->user->id,
                    'name' => $room->user->name,
                ],
                'imageUrls'       => $room->images->map(fn($image) => $image->url)->toArray(), // URLs de las imágenes.
                'created_at'      => $room->created_at,
                'updated_at'      => $room->updated_at,
                'type'            => 'room',  // Tipo de contenido.
                'city'            => $room->city,
            ];

            Log::info("Detalles de la habitación cargados: ", $item); // Mostrar los detalles.
        }
        // --- FIN: Lógica para Mostrar una Habitación (Room) ---



        // --- INICIO: Lógica para Mostrar un Perfil (Profile) ---
         elseif ($type === 'profile') {
            Log::info("Cargando detalles del perfil (ID: $id)...");

            // 1. Obtener el perfil con su usuario relacionado.
            $profile = UserProfile::with('user')->findOrFail($id);

            // 2. Construir el array de datos para la vista.
            $item = [
                'id'             => $profile->id,
                'user'           => [  // Información del usuario.
                    'id'   => $profile->user->id,
                    'name' => $profile->user->name,
                ],
                'profile_image'  => $profile->profile_image ? Storage::url($profile->profile_image) : null,  // URL de la imagen.
                'name'           => $profile->name,
                'budget'         => $profile->budget,
                'age'            => $profile->age,
                'gender'         => $profile->gender,
                'short_description' => $profile->short_description,
                'can_be_contacted' => $profile->can_be_contacted,
                'team_up'        => $profile->team_up,
                'looking_in'     => $profile->looking_in,
                'accommodation_for' => $profile->accommodation_for,
                'ready_to_move'  => $profile->ready_to_move,
                'description'    => $profile->description,
                'phone_number'   => $profile->phone_number,
                'phone_number_public' => $profile->phone_number_public,
                'lgbt_friendly'  => $profile->lgbt_friendly,
                'cannabis_friendly' => $profile->cannabis_friendly,
                'cat_friendly'   => $profile->cat_friendly,
                'dog_friendly'   => $profile->dog_friendly,
                'children_friendly' => $profile->children_friendly,
                'student_friendly' => $profile->student_friendly,
                'senior_friendly' => $profile->senior_friendly,
                'requires_background_check' => $profile->requires_background_check,
                'type'           => 'profile', // Tipo de contenido.
            ];

            Log::info("Detalles del perfil cargados:", $item);
        }
        // --- FIN: Lógica para Mostrar un Perfil (Profile) ---


        // --- INICIO: Retorno de la Vista con Datos ---
        Log::info('FIN - ContentController:show - Renderizando vista.');
        return Inertia::render('Content/Show', [  // Renderizar la vista 'Content/Show' con los datos.
            'item' => $item,  // Los datos del elemento (habitación o perfil).
        ]);
        // --- FIN: Retorno de la Vista con Datos ---
    }
}