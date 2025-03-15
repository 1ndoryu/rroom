<?php

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

        $roomsData = collect();
        $profilesData = collect();

        if (in_array($filterCategory, ['All Listing', 'Rooms', 'PG'])) {
            $roomsQuery = Room::with(['user', 'images']);

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

            if ($filterGender !== 'All') {
                $roomGenderValues = [];
                if ($filterGender === 'male') {
                    $roomGenderValues = ['males', 'male'];
                } elseif ($filterGender === 'female') {
                    $roomGenderValues = ['females', 'female'];
                } else {
                    $roomGenderValues = [$filterGender];
                }
                $roomsQuery->whereIn('preferred_gender', $roomGenderValues);
            }

            if (!empty($filterCities)) {
                // Change here: Use whereIn for single city, and a loop for multiple
                $roomsQuery->where(function ($query) use ($filterCities) {
                    foreach ($filterCities as $city) {
                        $query->orWhere('city', 'ILIKE', '%' . $city . '%');
                    }
                });
            }

            if ($filterMinPrice > 0 || $filterMaxPrice > 0) {
                if ($filterMinPrice > 0) {
                    $roomsQuery->where('rent', '>=', $filterMinPrice);
                }
                if ($filterMaxPrice > 0) {
                    $roomsQuery->where('rent', '<=', $filterMaxPrice);
                }
            }

            $rooms = $roomsQuery->latest()->get();

            $roomsData = $rooms->map(function ($room) {
                Log::info("ContentController:index: City of Room: " . $room->city);
                return [
                    'id'              => $room->id,
                    'user'            => [
                        'id'   => $room->user->id,
                        'name' => $room->user->name,
                    ],
                    'imageUrls'       => $room->images->map(fn($image) => $image->url)->toArray(),
                    'address'         => $room->address,
                    'rent'            => $room->rent,
                    'city'            => $room->city,
                    'preferred_gender' => $room->preferred_gender,
                    'description'     => $room->description,
                    'type'            => 'room',
                    'created_at'      => $room->created_at,
                ];
            });
        }

        if (in_array($filterCategory, ['All Listing', 'Roommates'])) {
            $profilesQuery = UserProfile::with('user')->whereHas('user');

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

            if ($filterGender !== 'All') {
                $profileGenderValues = [];
                if ($filterGender === 'male') {
                    $profileGenderValues = ['male', 'males'];
                } elseif ($filterGender === 'female') {
                    $profileGenderValues = ['female', 'females'];
                } else {
                    $profileGenderValues = [$filterGender];
                }

                $profilesQuery->whereIn('gender', $profileGenderValues);
            }

            if (!empty($filterCities)) {
            //Crucial change here:  Iterate and use orWhere for *each* city
                $profilesQuery->where(function ($query) use ($filterCities) {
                    foreach ($filterCities as $city) {
                        $query->orWhere('looking_in', 'ILIKE', '%' . $city . '%');
                    }
                });
            }

            if ($filterMinPrice > 0 || $filterMaxPrice > 0) {
                if ($filterMinPrice > 0) {
                    $profilesQuery->where('budget', '>=', $filterMinPrice);
                }
                if ($filterMaxPrice > 0) {
                    $profilesQuery->where('budget', '<=', $filterMaxPrice);
                }
            }

            $profiles = $profilesQuery->latest()->get();


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
        Log::info("ContentController:index: Filter Behavior - Category: $filterCategory, Gender: $filterGender, Cities: " . json_encode($filterCities) . ", MinPrice: $filterMinPrice, MaxPrice: $filterMaxPrice");
        $combinedData = $roomsData->concat($profilesData)->sortByDesc('created_at')->values()->all();

        return Inertia::render('Content/Index', [
            'content'        => $combinedData,
            'searchTerm'     => $searchTerm,
            'filterCategory' => $filterCategory,
            'filterGender'   => $filterGender,
            'filterCities'    => $filterCities,
            'filterMinPrice'  => $filterMinPrice,
            'filterMaxPrice'  => $filterMaxPrice
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
                'user'            => [
                    'id'   => $room->user->id,
                    'name' => $room->user->name,
                ],
                'imageUrls'       => $room->images->map(fn($image) => $image->url)->toArray(),
                'created_at'      => $room->created_at,
                'updated_at'      => $room->updated_at,
                'type'            => 'room',
                'city'            => $room->city,
            ];

        }
        elseif ($type === 'profile') {
            $profile = UserProfile::with('user')->findOrFail($id);

            $item = [
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
                'type'           => 'profile',
            ];
        }

        return Inertia::render('Content/Show', ['item' => $item]);
    }
}