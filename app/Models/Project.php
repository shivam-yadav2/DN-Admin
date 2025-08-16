<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    //
    protected $fillable = [
        'type',
        'title',
        'image',
        'video',
        'description',
        'duration',
        'tech_used',
        'url'
    ];
    public $timestamps = true;
    protected $table = 'projects';
    protected $casts =[
        'tech_used' => 'array'    
    ];
}
