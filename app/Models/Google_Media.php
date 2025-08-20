<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Google_Media extends Model
{
    protected $table='google_media';
    public $fillable=[
        'icon',
        'heading',
        'description',
        'platform',
        'benefit',
    ];
}
