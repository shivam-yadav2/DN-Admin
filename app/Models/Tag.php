<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    //
    protected $fillable =[
        'title',
        'description',
        'keyword',
        'page_url',
        'image'
    ];

      public $timestamps = true;
     protected $table = 'tags' ;
}
