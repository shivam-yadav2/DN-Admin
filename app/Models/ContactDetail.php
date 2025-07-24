<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactDetail extends Model
{
    //
    protected $fillable = [
        'email' ,
        'phone_no' ,
        'whatsapp_no' ,
        'location'
    ];

    protected $casts = [
        'email' => 'array',
        'phone_no' => 'array',
        'whatsapp_no' => 'array' ,
    ];

     public $timestamps = true;
     protected $table = 'contact_details' ;
}
