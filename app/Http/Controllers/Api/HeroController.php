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
        if(!$request->hasFile('video'))
        {
            return response()->json(['message' => 'Video file is required']);
        }

        //Handle video upload
        $video = $request->file('video');
        $videoName = time() . '.' . $video->getClientOriginalExtension();
        $video->move(public_path('assets/heros'), $videoName);

        //Save to DB
        $hero = Hero::create([
        'video_type' => $request->video_type,
        'video' => $videoName, // Store only filename or relative path
    ]);

    // return response()->json([
    //     'message' => 'Video uploaded successfully',
    //     'data' => $hero,
    //     ], 201);
    // }
    return redirect()->route('hero.index')->with('message', 'Video uploaded successfully');
}
    //Update
    public function update(Request $request, $id)
    {
        $hero = Hero::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'video_type' => 'sometimes|in:mobile,desktop',
            'video' => 'sometimes|file|mimes:webm|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], 422);
        }

        // Update video file if uploaded
        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoName = time() . '.' . $video->getClientOriginalExtension();
            $video->move(public_path('assets/heros'), $videoName);

            // Optional: delete old video file if needed
            $oldPath = public_path('assets/heros/' . $hero->video);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }

            $hero->video = $videoName;
        }

        // Update video_type if provided
        if ($request->has('video_type')) {
            $hero->video_type = $request->video_type;
        }

        $hero->save();

        return response()->json([
            'message' => 'Video updated successfully',
            'data' => $hero
        ]);
    }

    //Delete
    public function destroy($id)
    {
        $hero = Hero::findOrFail($id);

        // Delete video file from storage
        $videoPath = public_path('assets/heros/' . $hero->video);
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
