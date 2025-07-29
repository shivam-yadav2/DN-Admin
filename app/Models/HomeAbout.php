<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeAbout extends Model
{
    //
    protected $fillable =[
        'tag',
        'heading',
        'sub_heading',
        'image',
        'content',
        'button_text',
        'button_url'
    ];

      public $timestamps = true;
     protected $table = 'home_abouts' ;
}
