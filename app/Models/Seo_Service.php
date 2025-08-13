<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seo_Service extends Model
{
    //
    protected $fillable = [
        'image',
        'heading',
        'subheading',
        'description',
        'features'
    ];

    protected $casts = [
        'features' => 'array',
    ];
    public $timestamps = true;
    protected $table = 'seo_services';
}
