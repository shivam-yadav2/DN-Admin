<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver; // Import GD driver
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Other/Projects', [
            'projects' => $projects,
            'flash' => session('flash')
        ]);
    }

    // POST a new project
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'type'           => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'video'          => 'nullable|file|mimes:webm|max:5120',
            'description'    => 'required|string|max:1000',
            'duration'       => 'required|string|max:255',
            'tech_used'      => 'required|string|max:255',
            'url'            => 'nullable|url|max:255|unique:projects,url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'Image file is required'], 400);
        }

        // Process the uploaded file
        $image = $request->file('image');
        $originalExtension = strtolower($image->getClientOriginalExtension());

        $manager = new ImageManager(new GdDriver());

        $timestampName = time() . '.webp'; // Generate a unique file name
        $imageName = $timestampName;
        $destinationPath = ('assets/images/projects');

        // Create directory if it doesn't exist
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        // Convert and save the image
        if(in_array($originalExtension, ['jpg', 'jpeg', 'png']))
        {
            // Convert image to webp format
            $img = $manager->read($image->getRealPath())->toWebp(80);
            $img->save($destinationPath . '/' . $imageName);
        }
        elseif ($originalExtension === 'webp') 
        {
            // Save webp image directly
            $image->move($destinationPath, $imageName);
        } 
        else 
        {
            return response()->json(['message' => 'Only JPG, JPEG, PNG or WEBP formats allowe'], 400);
        }

        // Handle video file if present
        $videoName = null;
        if ($request->hasFile('video')) 
        {
            $video = $request->file('video');
            $videoExtension = strtolower($video->getClientOriginalExtension());
            if ($videoExtension !== 'webm')
            {
                return response()->json(['message' => 'Only WEBM format allowed for video'],
                    400);
            }
             $videoName = time() . '.' . $videoExtension;
             $video->move(('assets/videos/projects'), $videoName);
        }
    
        // Create new project record
        $project = Project::create([
            'type'          => $request->type,
            'title'         => $request->title,
            'image'         => 'assets/images/projects/' . $imageName,
            'video'         => 'assets/videos/projects/' . $videoName,
            'description'   => $request->description,
            'duration'      => $request->duration,
            'tech_used'     => $request->tech_used,
            'url'           => $request->url,
        ]);

        return redirect()->back()->with('flash', [
            'message' => 'Project created successfully!',
            'type' => 'success'
        ]);
    }

    // Update an existing project
    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'type'           => 'sometimes|required|string|max:255',
            'title'          => 'sometimes|required|string|max:255',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'video'          => 'nullable|file|mimes:webm|max:5120',
            'description'    => 'sometimes|required|string|max:1000',
            'duration'       => 'sometimes|required|string|max:255',
            'tech_used'      => 'sometimes|required|string|max:255',
            'url'            => 'nullable|url|max:255|unique:projects,url,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

           // Default to old image
                $imageName =  $project->image;
                  $videoName = $project->video;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                // $oldImagePath = ('assets/images/projects/' . $project->image);
                // if (file_exists($oldImagePath)) 
                //     {
                //         unlink($oldImagePath);
                //     }
                // Delete old image if exists
                if ($project->image && file_exists(public_path($project->image))) {
                    unlink(public_path($project->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = ('assets/images/projects'); // Define storage path

                // Create directory if it doesn't exist
                if (!file_exists($destinationPath)) 
                {
                    mkdir($destinationPath, 0755, true);
                }

                 if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) 
                {
                    // Convert JPG/PNG to WebP
                    $img = $manager->read($image->getRealPath())->toWebp(80); 
                    $img->save($destinationPath . '/' . $timestampName);
                    // $imageName = $timestampName;
                } 
            
                elseif ($originalExtension === 'webp')
                {
                    // Save WebP as-is
                    $image->move($destinationPath, $timestampName);
                    // $imageName = $timestampName;
                } 
                 else 
                {
                    // Return if unsupported format
                    return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
                }

                 $imageName = 'assets/images/projects/' . $timestampName; // ✅ relative path in DB
            }
         // Handle video update
        // $videoName = $project->video;
        if ($request->hasFile('video'))
        {
            // $oldVideoPath = ('assets/videos /projects/' . $project->video);
            // if (file_exists($oldVideoPath)) 
            //     {
            //         unlink($oldVideoPath);
            //     }

            if ($project->video && file_exists(public_path($project->video))) {
            unlink(public_path($project->video));
        }


            $video = $request->file('video');
            $videoExtension = strtolower($video->getClientOriginalExtension());
            if ($videoExtension !== 'webm')
                {
                    return response()->json(['message' => 'Only WEBM format allowed for video'], 400);
                }
            // $videoName = time() . '.' . $videoExtension;
            // $video->move(('assets/videos/projects'), $videoName);

             $timestampVideo = time() . '.' . $videoExtension;
        $video->move(public_path('assets/videos/projects'), $timestampVideo);

        $videoName = 'assets/videos/projects/' . $timestampVideo; // ✅ relative path in DB
        }

        // Update tag record
        $project->update([
              'type'            => $request->type ?? $project->type,
              'title'           => $request->title ?? $project->title,
              'image'           => $imageName,
              'video'           => $videoName,
              'descripton'      => $request->descripton ?? $project->descripton,
              'duration'        => $request->duration ?? $project->duration,
              'tech_used'       => $request->tech_used ?? $project->tech_used,
              'url'             => $request->url ? $request->url : $project->url,
            
        ]);

         return redirect()->back()->with('flash', [
            'message' => 'Project updated successfully!',
            'type' => 'success'
        ]);
    }
     // Delete a project
    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return redirect()->back()->withErrors(['general' => 'Project not found']);
        }

        // Delete associated files
        if ($project->image) {
            $imagePath = public_path($project->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        if ($project->video) {
            $videoPath = public_path($project->video);
            if (file_exists($videoPath)) {
                unlink($videoPath);
            }
        }

        $project->delete();

        return redirect()->back()->with('flash', [
            'message' => 'Project deleted successfully!',
            'type' => 'success'
        ]);
    }
}
