<?php
// app/Models/UserProfile.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_image',
        'user_id',
        'name',
        'age',
        'gender',
        'short_description',
        'can_be_contacted',
        'team_up',
        'looking_in',
        'budget',
        'accommodation_for',
        'ready_to_move',
        'lgbt_friendly',
        'cannabis_friendly',
        'cat_friendly',
        'dog_friendly',
        'children_friendly',
        'student_friendly',
        'senior_friendly',
        'requires_background_check',
        'description',
        'phone_number',
        'phone_number_public',
    ];
    //  relación con el usuario
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
