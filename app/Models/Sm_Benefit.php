<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sm_Benefit extends Model
{
    //
    protected $fillable = [
        'heading',
        'description',
        'image',
    ];

    public $timestamps = true;
    protected $table = 'sm_benefits';
}
