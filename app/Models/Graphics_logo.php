<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Graphics_logo extends Model
{
    protected $table='graphic_logo';
    public $fillable=[
        'name',
        'img',
        'url'
    ];
}
