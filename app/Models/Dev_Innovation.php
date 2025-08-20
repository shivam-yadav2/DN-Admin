<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dev_Innovation extends Model
{
    //
     protected $fillable = [
        'icon',
        'heading',
        'sub_heading',
        'description',
        'features',
    ];

    protected $casts =[
        'features' => 'array',
    ];

    public $timestamps = true;
    protected $table = 'dev_innovations';
}
