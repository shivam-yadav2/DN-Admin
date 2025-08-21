<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialService extends Model
{
    protected $table='social_our_service';

    public $fillable=[
        'heading',
        'description',
    ];
}
