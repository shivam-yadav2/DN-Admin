<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sm_Facebook extends Model
{
    //
    protected $fillable = [
        'icon',
        'heading',
        'description',
    ];

    public $timestamps = true;
    protected $table ='sm_facebook';
}
