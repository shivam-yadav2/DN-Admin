<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class packages extends Model
{
    protected $table='package';
     public $fillable=[
        'img',
        'heading',
        'price',
        'description',
        'target_audience',
     ];
}
