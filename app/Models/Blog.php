<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    //
    protected $fillable = [
        'meta_key',
        'meta_desc',
        'title',
        'url',
        'keyword',
        'description',
        'author',
        'published',
        'card_img',
        'banner_img'
     ];
     protected $casts = [
    'keyword' => 'array',
    ];

     public $timestamps = true;
     protected $table = 'blogs' ;
}
