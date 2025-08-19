<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seo_Strategy extends Model
{
    //
    protected $fillable = [
        'image',
        'heading',
        'description',
    ];
     public $timestamps =true;
     protected $table = 'seo_strategies';

}
