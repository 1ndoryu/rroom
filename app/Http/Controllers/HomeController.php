<?php
// app/Http/Controllers/HomeController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room; // Asegúrate de tener el modelo Room

class HomeController extends Controller
{
    public function index()
    {
        //  limite a 6 habitaciones, y  ordena aleatoriamente
        $rooms = Room::with('user')->inRandomOrder()->limit(6)->get();

        // Agregar las URLs de las imágenes
        $rooms = $rooms->map(function ($room) {
            $room->imageUrls = $room->images->map(fn($image) => $image->url);
            return $room;
        });

        return Inertia::render('Home', [
            'rooms' => $rooms,
        ]);
    }
}
