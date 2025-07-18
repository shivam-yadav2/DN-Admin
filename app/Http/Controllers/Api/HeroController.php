<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hero;

class HeroController extends Controller
{
    //Get the video
    public function index()
    {
        $heros = Hero::all();
        return response()->json($heros, 200);
    }

    //Store the data
    public function store(Request $request)
    {
        //Validate
        $request->validate([
            'video' =>'required|mimes:mp4,mov,avi|max:10240'
        ]);

        //To check if video file is there
        if(!$request->hasFile('video'))
        {
            return response()->json(['message' => 'Video file is required']);
        }

        //Handle video upload
        $video = $request->file('video');
        $videoName = time() . '.' . $video->getClientOriginalExtension();
        $video->move(public_path('assets/heros'), $videoName);

        //Save to DB
        $record = Hero::create([
        'title' => $request->title,
        'video' => $videoName, // Store only filename or relative path
    ]);

    return response()->json([
        'message' => 'Video uploaded successfully',
        'data' => $record,
        ], 201);
    }

    //Update
}
