<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Google_Compaigns extends Model
{
    protected  $table='google_compaigns';
    public $fillable=[
        'icon',
        'heading',
        'description',
    ];
    
}
