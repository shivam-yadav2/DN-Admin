<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seo_Digital extends Model
{
    //
     protected $fillable = [
        'icon',
        'heading',
        'description',
    ];

    public $timestamps = true;
    protected $table = 'seo_digital';
}
