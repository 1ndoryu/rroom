<?php
// routes/web.php
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\HomeController; // Importante importar
use Inertia\Inertia;

// Ruta para la página de inicio (usando HomeController)
Route::get('/', [HomeController::class, 'index'])->name('home');

// Rutas para las habitaciones (usando resource controller)
Route::resource('rooms', RoomController::class)->middleware('auth'); // Todas las rutas de rooms requieren autenticación
Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index'); // index no require auth

// Rutas del dashboard y perfil (se mantienen igual)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';