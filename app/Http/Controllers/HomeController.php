<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Storage; 

class HomeController extends Controller
{
    public function index()
    {
        $rooms = Room::with(['user', 'images'])->inRandomOrder()->limit(6)->get();

        $roomsData = $rooms->map(function ($room) {
            $roomData = [
                'id' => $room->id,
                'user' => [
                    'id' => $room->user->id,
                    'name' => $room->user->name,
                ],
                'imageUrls' => $room->images->map(fn($image) => $image->url)->toArray(),
                'city' => $room->city,
                'address' => $room->address,
                'rent' => $room->rent,
                'preferred_gender' => $room->preferred_gender,
                'description' => $room->description,
                'type' => 'room',
            ];
            return $roomData;
        });

        $profiles = UserProfile::with('user')->whereHas('user')->inRandomOrder()->limit(6)->get();

        $profilesData = $profiles->map(function ($profile) {
            $profileData = [
                'id' => $profile->id,
                'user' => [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                ],
                'profile_image' => $profile->profile_image ? Storage::url($profile->profile_image) : null,
                'name' => $profile->name,
                'age' => $profile->age,
                'gender' => $profile->gender,
                'budget' => $profile->budget,
                'description' => $profile->description,
                'type' => 'profile',
                'looking_in' => $profile->looking_in,
            ];
            return $profileData;
        });

        $combinedData = $roomsData->concat($profilesData)->shuffle()->take(6)->values()->all();

        return Inertia::render('Home', [
            'rooms' => $combinedData,
        ]);
    }
}