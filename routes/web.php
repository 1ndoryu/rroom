<?php
// routes/web.php
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\HomeController; 
use Inertia\Inertia;
use App\Http\Controllers\UserProfilesController;
use App\Http\Controllers\ContentController;






Route::get('/', [HomeController::class, 'index'])->name('home');

Route::resource('rooms', RoomController::class)->middleware('auth'); 
Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');

Route::get('/content', [ContentController::class, 'index'])->name('content.index');
Route::get('/content/{type}/{id}', [ContentController::class, 'show'])->name('content.show');

// Rutas del dashboard y perfil (se mantienen igual)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profiles/create', [UserProfilesController::class, 'create'])->name('profiles.create');
    Route::post('/profiles', [UserProfilesController::class, 'store'])->name('profiles.store');
});

require __DIR__ . '/auth.php';
