<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package_Feature extends Model
{
    protected $fillable =[
        'package_id',
        'feature_key',
        'feature_value',
    ];
    protected $table = 'package_Features';
    public $timestamps = true; 

    public function package()
    {
        return $this->belongsTo(Package::class, 'package_id');
    }
}
