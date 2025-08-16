<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hero;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    //Get the video
    public function index()
    {
        $heroes = Hero::all();
        // return response()->json($heros, 200);

         return Inertia::render('Admin/HomePage/Hero', [
            'videos' => $heroes->map(function ($hero) {
                return [
                    'id' => $hero->id,
                    'video_type' => $hero->video_type,
                    'video_path' => $hero->video,
                    'created_at' => $hero->created_at,
                ];
            }),
        ]);
    }

    //Store the data
    public function store(Request $request)
    {
        //Validate
        $validator = Validator::make($request->all(), [
            'video_type'   => 'required|in:mobile,desktop',
            'video'         =>'required|file|mimes:webm|max:5120' ,
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        //To check if video file is there
        // if(!$request->hasFile('video'))
        // {
        //     return response()->json(['message' => 'Video file is required']);
        // }

        //Handle video upload
        $video = $request->file('video');
        $videoName = time() . '.' . $video->getClientOriginalExtension();
        $video->move(('assets/heros'), $videoName);

        //Save to DB
        $hero = Hero::create([
        'video_type' => $request->video_type,
        'video' => 'assets/heros/' . $videoName, // Store only filename or relative path
        ]);

        return response()->json([
            'message' => 'Video uploaded successfully',
            'data' => $hero,
            ], 201);
        
        // return redirect()->route('hero.index')->with('message', 'Video uploaded successfully');
    }
    

    //Delete
    public function destroy($id)
    {
        $hero = Hero::findOrFail($id);

        // Delete video file from storage
        $videoPath =  public_path($hero->video);
        if (file_exists($videoPath)) 
            {
                unlink($videoPath);
             }

        // Delete record from DB
        $hero->delete();

        // return response()->json(['message' => 'Hero deleted successfully']);
         return redirect()->route('hero.index')->with('message', 'Video deleted successfully');
    }
}
