<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    //
    protected $table = 'home_heros'; // Specify the table name if it's not the plural of the model name
    protected $fillable = ['video']; // Specify the fillable attributes for mass assignment
    public $timestamps = true;
    
}
