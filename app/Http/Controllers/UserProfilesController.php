<?php
// app/Http/Controllers/UserProfilesController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class UserProfilesController extends Controller
{
    public function create(Request $request)
    {
        $userProfile = $request->user()->profile;

        return Inertia::render('Profiles/Create', [
            'userProfile' => $userProfile,
        ]);
    }

    public function store(Request $request)
    {
        // --- Validación ---
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:18',
            'gender' => 'required|string|in:male,female,other',
            'short_description' => 'required|string|max:255',
            // MODIFICACIÓN AQUÍ:  Acepta string o array.
            'looking_in' => 'required|max:255', //Quitar string
            'budget' => 'required|numeric|min:0',
            'ready_to_move' => 'required|date',
            'description' => 'required|string|min:75',
            'phone_number' => 'nullable|string|max:20',
            'images' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'can_be_contacted' => 'boolean',
            'team_up' => 'nullable|string|in:looking,open,not_interested',
            'accommodation_for' => 'string',
            'lgbt_friendly' => 'boolean',
            'cannabis_friendly' => 'boolean',
            'cat_friendly' => 'boolean',
            'dog_friendly' => 'boolean',
            'children_friendly' => 'boolean',
            'student_friendly' => 'boolean',
            'senior_friendly' => 'boolean',
            'requires_background_check' => 'boolean',
            'phone_number_public' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // --- Preparación de los datos ---
        $profileData = $validator->validated(); // Usar los datos validados.

        // MODIFICACIÓN AQUÍ:  Convierte a string si es array.
        if (is_array($profileData['looking_in'])) {
            $profileData['looking_in'] = implode(', ', $profileData['looking_in']);
        }

        $profileData = [
            'name' => $request->name,
            'age' => $request->age,
            'gender' => $request->gender,
            'short_description' => $request->short_description,
            'can_be_contacted' => (bool) $request->can_be_contacted,
            'team_up' => $request->team_up,
            'looking_in' => $profileData['looking_in'], // Usar la variable modificada
            'budget' => $request->budget,
            'accommodation_for' => $request->accommodation_for,
            'ready_to_move' => $request->ready_to_move,
            'lgbt_friendly' => (bool) $request->lgbt_friendly,
            'cannabis_friendly' => (bool) $request->cannabis_friendly,
            'cat_friendly' => (bool) $request->cat_friendly,
            'dog_friendly' => (bool) $request->dog_friendly,
            'children_friendly' => (bool) $request->children_friendly,
            'student_friendly' => (bool) $request->student_friendly,
            'senior_friendly' => (bool) $request->senior_friendly,
            'requires_background_check' => (bool) $request->requires_background_check,
            'description' => $request->description,
            'phone_number' => $request->phone_number,
            'phone_number_public' => (bool) $request->phone_number_public,
            // profile_image se añade abajo.
        ];

        // --- Obtener el perfil existente ---
        $existingProfile = $request->user()->profile;

        // --- Procesamiento de la imagen ---
        if ($request->hasFile('images')) {
            $image = $request->file('images');
            $path = $image->store('profile_images', 'public');

            if ($existingProfile && $existingProfile->profile_image) {
                Storage::disk('public')->delete($existingProfile->profile_image);
            }

            $profileData['profile_image'] = $path;
        } elseif (!$request->hasFile('images') && $existingProfile && $existingProfile->profile_image) {
            Storage::disk('public')->delete($existingProfile->profile_image);
            $profileData['profile_image'] = null;
        }

        // --- Crear o actualizar el perfil ---
        $profile = UserProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $profileData
        );

        return Redirect::route('profiles.create')->with('success', 'Perfil creado/actualizado.');
    }
}