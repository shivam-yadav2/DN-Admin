<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OurCreative extends Model
{
    //
    protected $table = 'our_creatives'; // Specify the table name if it's not the plural of the model name
    protected $fillable = ['image']; // Specify the fillable attributes for mass assignment
    public $timestamps = false; // Disable timestamps if not needed
}
