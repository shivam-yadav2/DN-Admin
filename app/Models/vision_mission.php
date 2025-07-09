<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class vision_mission extends Model
{
    protected $table='vision_mission';
    protected $fillable = ['heading', 'para', 'subheading', 'subpara'];

}
