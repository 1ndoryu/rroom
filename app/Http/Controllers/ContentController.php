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
        $searchTerm = $request->input('search');
        $filterCategory = $request->input('filterCategory', 'All Listing');
        $filterGender = $request->input('filterGender', 'All');
        $filterCities = $request->input('cities', []);
        $filterMinPrice = $request->input('minPrice', 0);
        $filterMaxPrice = $request->input('maxPrice', 0);
        $selectedSort = $request->input('selectedSort', 'recents'); // Nuevo: Obtener opción de ordenamiento

        $roomsData = collect();
        $profilesData = collect();

        // Rooms filtering
        if (in_array($filterCategory, ['All Listing', 'Rooms', 'PG'])) {
            $roomsQuery = Room::with(['user', 'images']);

            // Search term
            if ($searchTerm) {
                $roomsQuery->where(function ($query) use ($searchTerm) {
                    $query->where('address', 'ILIKE', '%' . $searchTerm . '%')
                        ->orWhere('description', 'ILIKE', '%' . $searchTerm . '%')
                        ->orWhere('city', 'ILIKE', '%' . $searchTerm . '%')
                        ->orWhereHas('user', function ($q) use ($searchTerm) {
                            $q->where('name', 'ILIKE', '%' . $searchTerm . '%');
                        });
                });
            }

            // Gender filter for rooms
            if ($filterGender !== 'All') {
                $filterGenderAdjusted = $filterGender;
                if (strtolower($filterGender) === 'male') {
                    $filterGenderAdjusted = 'males';
                } elseif (strtolower($filterGender) === 'female') {
                    $filterGenderAdjusted = 'females';
                }
                $roomsQuery->where('preferred_gender', $filterGenderAdjusted);
            }

            // City filter for rooms
            if (!empty($filterCities)) {
                $roomsQuery->where(function ($query) use ($filterCities) {
                    foreach ($filterCities as $city) {
                        $query->orWhere('city', 'ILIKE', '%' . $city . '%');
                    }
                });
            }

            // Price filter for rooms
            if ($filterMinPrice > 0) {
                $roomsQuery->where('rent', '>=', $filterMinPrice);
            }
            if ($filterMaxPrice > 0) {
                $roomsQuery->where('rent', '<=', $filterMaxPrice);
            }

             // Ordenamiento para cuartos
            if ($selectedSort === 'recents') {
                $roomsQuery->latest();
            } elseif ($selectedSort === 'relevant') {
                 // Preparación para la relevancia (aún no implementada)
                $roomsQuery->orderBy('id', 'desc');  // Temporal, cambia esto luego
            }

            $rooms = $roomsQuery->get();
            $roomsData = $rooms->map(function ($room) {
                Log::info("ContentController:index: City of Room: " . $room->city);
                return [
                    'id'               => $room->id,
                    'user'             => [
                        'id'   => $room->user->id,
                        'name' => $room->user->name,
                    ],
                    'imageUrls'        => $room->images->map(fn($image) => $image->url)->toArray(),
                    'address'          => $room->address,
                    'rent'             => $room->rent,
                    'city'             => $room->city,
                    'preferred_gender' => $room->preferred_gender,
                    'description'      => $room->description,
                    'type'             => 'room',
                    'created_at'       => $room->created_at,
                ];
            });
        }

        // Roommates (UserProfiles) filtering
        if (in_array($filterCategory, ['All Listing', 'Roommates'])) {
            $profilesQuery = UserProfile::with('user')->whereHas('user');

            // Search term
            if ($searchTerm) {
                $profilesQuery->where(function ($query) use ($searchTerm) {
                    $query->where('name', 'ILIKE', '%' . $searchTerm . '%')
                        ->orWhere('description', 'ILIKE', '%' . $searchTerm . '%')
                        ->orWhere('looking_in', 'ILIKE', '%' . $searchTerm . '%')
                        ->orWhereHas('user', function ($q) use ($searchTerm) {
                            $q->where('name', 'ILIKE', '%' . $searchTerm . '%');
                        });
                });
            }

            // Gender filter for profiles
            if ($filterGender !== 'All') {
                $profilesQuery->where('gender', $filterGender);
            }

            // City filter for profiles
            if (!empty($filterCities)) {
                $profilesQuery->where(function ($query) use ($filterCities) {
                    foreach ($filterCities as $city) {
                        $query->orWhere('looking_in', 'ILIKE', '%' . $city . '%');
                    }
                });
            }
            // Price filter (budget) for profiles
            if ($filterMinPrice > 0) {
                $profilesQuery->where('budget', '>=', $filterMinPrice);
            }
            if ($filterMaxPrice > 0) {
                $profilesQuery->where('budget', '<=', $filterMaxPrice);
            }

            // Ordenamiento para perfiles
            if ($selectedSort === 'recents') {
                $profilesQuery->latest();
            } elseif ($selectedSort === 'relevant') {
                 // Preparación para la relevancia (aún no implementada)
                 $profilesQuery->orderBy('id', 'desc'); // Temporalmente, para que no de error.
            }

            $profiles = $profilesQuery->get();
            $profilesData = $profiles->map(function ($profile) {
                Log::info("ContentController:index: City of Profile: " . $profile->looking_in);
                return [
                    'id'             => $profile->id,
                    'user'           => [
                        'id'   => $profile->user->id,
                        'name' => $profile->user->name,
                    ],
                    'profile_image'  => $profile->profile_image ? Storage::url($profile->profile_image) : null,
                    'name'           => $profile->name,
                    'budget'         => $profile->budget,
                    'age'            => $profile->age,
                    'gender'         => $profile->gender,
                    'description'    => $profile->description,
                    'type'           => 'profile',
                    'looking_in'     => $profile->looking_in,
                    'created_at'     => $profile->created_at,
                ];
            });
        }

        // Combinar y ordenar los resultados *después* de filtrar y mapear
        $combinedData = $roomsData->concat($profilesData);

        if ($selectedSort === 'recents') {
            $combinedData = $combinedData->sortByDesc('created_at')->values()->all();
        } elseif ($selectedSort === 'relevant') {
             // Orden temporal mientras se implementa la relevancia
             $combinedData = $combinedData->sortByDesc('id')->values()->all(); // Cambia esto
        }


        return Inertia::render('Content/Index', [
            'content'         => $combinedData,
            'searchTerm'      => $searchTerm,
            'filterCategory'  => $filterCategory,
            'filterGender'    => $filterGender,
            'filterCities'    => $filterCities,
            'filterMinPrice'  => $filterMinPrice,
            'filterMaxPrice'  => $filterMaxPrice,
            'selectedSort'   => $selectedSort, // Pasar la opción de ordenamiento a la vista
        ]);
    }

    public function show($type, $id)
    {
        if ($type !== 'room' && $type !== 'profile') {
            abort(404);
        }

        if ($type === 'room') {
            $room = Room::with(['user', 'images'])->findOrFail($id);

            $item = [
                'id'                    => $room->id,
                'address'               => $room->address,
                'hide_address'          => $room->hide_address,
                'property_type'         => $room->property_type,
                'rent'                  => $room->rent,
                'bills_included'        => $room->bills_included,
                'security_deposit'      => $room->security_deposit,
                'available_on'          => $room->available_on,
                'preferred_gender'      => $room->preferred_gender,
                'bathroom_type'         => $room->bathroom_type,
                'parking'               => $room->parking,
                'internet_access'       => $room->internet_access,
                'private_room'          => $room->private_room,
                'furnished'             => $room->furnished,
                'accessible'            => $room->accessible,
                'lgbt_friendly'         => $room->lgbt_friendly,
                'cannabis_friendly'     => $room->cannabis_friendly,
                'cat_friendly'          => $room->cat_friendly,
                'dog_friendly'          => $room->dog_friendly,
                'children_friendly'     => $room->children_friendly,
                'student_friendly'      => $room->student_friendly,
                'senior_friendly'       => $room->senior_friendly,
                'requires_background_check' => $room->requires_background_check,
                'description'           => $room->description,
                'roomies_description'   => $room->roomies_description,
                'bedrooms'              => $room->bedrooms,
                'bathrooms'             => $room->bathrooms,
                'roomies'               => $room->roomies,
                'minimum_stay'          => $room->minimum_stay,
                'maximum_stay'          => $room->maximum_stay,
                'user'                  => [
                    'id'   => $room->user->id,
                    'name' => $room->user->name,
                ],
                'imageUrls'             => $room->images->map(fn($image) => $image->url)->toArray(),
                'created_at'            => $room->created_at,
                'updated_at'            => $room->updated_at,
                'type'                  => 'room',
                'city'                  => $room->city,
            ];
        } elseif ($type === 'profile') {
            $profile = UserProfile::with('user')->findOrFail($id);

            $item = [
                'id'                    => $profile->id,
                'user'                  => [
                    'id'   => $profile->user->id,
                    'name' => $profile->user->name,
                ],
                'profile_image'         => $profile->profile_image ? Storage::url($profile->profile_image) : null,
                'name'                  => $profile->name,
                'budget'                => $profile->budget,
                'age'                   => $profile->age,
                'gender'                => $profile->gender,
                'short_description'     => $profile->short_description,
                'can_be_contacted'      => $profile->can_be_contacted,
                'team_up'               => $profile->team_up,
                'looking_in'            => $profile->looking_in,
                'accommodation_for'     => $profile->accommodation_for,
                'ready_to_move'         => $profile->ready_to_move,
                'description'           => $profile->description,
                'phone_number'          => $profile->phone_number,
                'phone_number_public'   => $profile->phone_number_public,
                'lgbt_friendly'         => $profile->lgbt_friendly,
                'cannabis_friendly'     => $profile->cannabis_friendly,
                'cat_friendly'          => $profile->cat_friendly,
                'dog_friendly'          => $profile->dog_friendly,
                'children_friendly'     => $profile->children_friendly,
                'student_friendly'      => $profile->student_friendly,
                'senior_friendly'       => $profile->senior_friendly,
                'requires_background_check' => $profile->requires_background_check,
                'type'                  => 'profile',
            ];
        }

        return Inertia::render('Content/Show', ['item' => $item]);
    }
}
