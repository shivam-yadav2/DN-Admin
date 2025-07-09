<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeAbout extends Model
{
    //
    protected $fillable = [
        'title',
        'description',
        'metric',
        'is_deleted'
    ];
    public $timestamps = true;
    protected $table = 'home_abouts'; // Specify the table name if it differs from the default naming convention
    
}
