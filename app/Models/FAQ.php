<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FAQ extends Model
{
    //
    protected $fillable = ['question', 'answer'];
    protected $table = 'faqs';
    public $timestamps = true;
}
