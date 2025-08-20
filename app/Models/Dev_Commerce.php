<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dev_Commerce extends Model
{
    //
    protected $fillable = [
        'tag',
        'image',
        'heading',
        'description',
        'skills',
        'label'
    ];

    protected $casts = [
        'skills' => 'array',
    ];
    public $timestamps = true;
    protected $table = 'dev_commerces';

}
