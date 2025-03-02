<?php
// app/Models/Image.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use HasFactory;

    protected $fillable = ['room_id', 'url'];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    // Crea un "accessor" para obtener la URL absoluta
    public function getUrlAttribute($value)
    {
        // Si ya es una URL absoluta, no hagas nada
        if (strpos($value, 'http') === 0) {
            return $value;
        }
        // Si no, genera la URL absoluta usando asset()
        return asset($value);
    }
}
