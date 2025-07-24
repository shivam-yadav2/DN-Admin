<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class our_team extends Model
{
    protected $table='our_team';
    protected $fillable = ['name', 'designation', 'img', 'joining_date'];

}
