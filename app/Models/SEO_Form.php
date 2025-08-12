<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SEO_Form extends Model
{
    //
    protected $fillable = [
        'name',
        'website_url',
        'email',
        'current_traffic',
        'message',
        'button',
    ];

    protected $table = 'seo_forms';
    public $timestamps = true;
}
