<?php
// app/Models/Room.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
        'hide_address',
        'property_type',
        'rent',
        'bills_included',
        'security_deposit',
        'available_on',
        'preferred_gender',
        'bathroom_type',
        'parking',
        'internet_access',
        'private_room',
        'furnished',
        'accessible',
        'lgbt_friendly',
        'cannabis_friendly',
        'cat_friendly',
        'dog_friendly',
        'children_friendly',
        'student_friendly',
        'senior_friendly',
        'requires_background_check',
        'description',
        'roomies_description',
        'bedrooms',
        'bathrooms',
        'roomies',
        'minimum_stay',
        'maximum_stay',
        'user_id', 
        'city',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }
}
