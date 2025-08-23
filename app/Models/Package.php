<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'icon',
        'package_for', 
        'package_name', 
        'price', 
        'description', 
        'label',
        'audience'
    ];

    public function features()
    {
        return $this->hasMany(Package_Feature::class, 'package_id');
    }
}
