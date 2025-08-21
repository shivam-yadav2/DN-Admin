<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Google_Ppc extends Model
{
    protected $table='google_ppc';
    public $fillable=[
        'icon',
        'heading',
        'description',
    ];
}
