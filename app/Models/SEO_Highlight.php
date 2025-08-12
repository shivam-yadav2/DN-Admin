<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SEO_Highlight extends Model
{
    //
    protected $fillable = [
        'image',
        'heading',
        'description',
    ];

    protected $table = 'seo_highlights';
    public $timestamps = true;
}
