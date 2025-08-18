<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubService extends Model
{
    //
    protected $fillable = [
        'service_id',
        'name',
        'description',
        'image' ,
        'is_deleted'  
    ];
    public $timestamps = true;
    protected $table = 'subservices'; // Specify the table name if it differs from the default naming convention

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    
}
