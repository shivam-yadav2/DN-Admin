<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    //
    protected $fillable = [
        'desig',
        'title',
        'city',
        'job_type',
        'work_mode',
        'about_role',
        'responsibilities' ,
        'requirements',
        'benefits_perks'
     ];
     protected $casts = [
    'responsibilities' => 'array',
    'requirements' => 'array',
    'benefits_perks' => 'array',
];

     public $timestamps = true;
     protected $table = 'careers' ;
}
 

