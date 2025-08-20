<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dev_Maintain extends Model
{
    //
     protected $fillable = [
        'icon',
        'heading',
        'description',
        'priority',
        'availability',
        'features',
    ];

     protected $casts =[
        'features' => 'array',
    ];

    public $timestamps = true;
    protected $table = 'dev_maintains';
}
