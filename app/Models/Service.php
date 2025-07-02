<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    //
    protected $fillable =
    [
        'name' ,
        'description' ,
        'image'
    ];
    public $timestamps = false;

    public function subservices()
    {
        return $this->hasMany(SubService::class);
    }
    protected $table = 'services'; // Specify the table name if it differs from the default naming convention
   

}
