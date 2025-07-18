<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    //
    protected $fillable = [
        'name',
        'email',
        'number',
        'city',
        'service_id',
        'subservice_id',
        'message',
        'isDeleted',
        'status'
    ];
    public $timestamps = true; // Enable timestamps for created_at and updated_at
    protected $table = 'enquiries'; // Specify the table name if it differs

    //Add relationships
    //One to
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    public function subservice()
    {
        return $this->belongsTo(SubService::class);
    }
}
