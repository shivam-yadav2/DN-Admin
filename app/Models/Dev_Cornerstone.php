<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dev_Cornerstone extends Model
{
    //
     protected $fillable = [
        'icon',
        'heading',
        'description',
    ];

    public $timestamps = true;
    protected $table = 'dev_cornerstones';
}
