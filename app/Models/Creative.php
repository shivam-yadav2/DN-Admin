<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Creative extends Model
{
    //
    protected $table = 'creatives'; // Specify the table name if it's not the plural of the model name

    protected $fillable = ['image']; // Specify the fillable attributes for mass assignment
    
    public $timestamps = true; // Disable timestamps if not needed
}
