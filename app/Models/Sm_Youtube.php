<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sm_Youtube extends Model
{
    //
    protected $fillable = [
        'heading',
        'description',
        'image',
        'features',
    ];

    protected $casts = [
        'features' => 'array',
    ];

    public $timestamps = true;
    protected $table = 'sm_youtube';
}
