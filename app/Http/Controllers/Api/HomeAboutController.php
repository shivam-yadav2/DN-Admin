<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HomeAbout; // HomeAbout model
// use Inertia\Inertia; // Import Inertia for rendering views
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver; // Import GD driver for image processing
use Illuminate\Support\Facades\Validator;

class HomeAboutController extends Controller
{
   //Get all data
    public function index()
    {
        $homeAbouts = HomeAbout::all();
        return response()->json($homeAbouts, 200);
    }

    // POST a new home about
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'tag'           => 'required|string|max:255',
            'heading'       => 'required|string|max:255',
            'sub_heading'   => 'required|string|max:255',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:512',
            'content'       => 'required|string|max:1000',
            'button_text'   => 'required|string|max:100',
            'button_url'    => 'required|url|unique|max:100',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        if(!$request->hasFile('image'))
        {
            return response()->json(['message' => 'Image file is required'], 400);
        }

        //Initialize variable to hold the final image name
        // $imageName = null;

        //Process the uploaded file
        $image = $request->file('image');       //Get the uploaded file
        $originalExtension = strtolower($image->getClientOriginalExtension());

        $manager = new ImageManager(new GdDriver());

        $timestampName = time(). '.webp';       //Generate a unique file name
        $imageName = $timestampName;
        $destinationPath = public_path('assets/images/homeAbout');

        //Create directory
        if (!file_exists($destinationPath)) {
    mkdir($destinationPath, 0755, true);
    }

    if (in_array($originalExtension, ['jpg', 'jpeg', 'png']))
         {
            // Convert JPG/PNG/JPEG to WebP
            $img = $manager->read($image->getRealPath())->toWebp(80); 
            $img->save($destinationPath . '/' . $imageName);
            // $imageName = $timestampName;
        }    
        elseif ($originalExtension === 'webp') 
        {
            // Save WebP as-is
            $image->move($destinationPath, $imageName);
            // $imageName = $timestampName;
        } 
         else 
        {
            // Return if unsupported format
            return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
        }

        // Create new home about record
        $homeAbout = HomeAbout::create([
             'tag'          => $request->tag,
            'heading'       => $request->heading,
            'sub_heading'   => $request->sub_heading,
            'image'         => $imageName,
            'content'       => $request->content,
            'button_text'   => $request->button_text,
            'button_url'    => $request->button_url
        ]);

        return response()->json([
            'message' => 'Home About created successfully.',
            'data' => $homeAbout,
        ], 201);
    }

    // Update an existing home about
    public function update(Request $request, $id)
    {
        $homeAbout = HomeAbout::find($id);

        if (!$homeAbout) 
            {
                 return response()->json(['message' => 'Home About not found.'], 404);
            }

        // Validate request
        $validator = Validator::make($request->all(), [
            
            'tag'           => 'required|string|max:255',
            'heading'       => 'required|string|max:255',
            'sub_heading'   => 'required|string|max:255',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:512',
            'content'       => 'required|string|max:1000',
            'button_text'   => 'required|string|max:100',
            'button_url'    => 'required|url|unique|max:100',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        // Default to old image
                $imageName = $homeAbout->image;

                // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                $oldImagePath = public_path('assets/images/homeAbout/' . $homeAbout->image);
                if (file_exists($oldImagePath)) 
                    {
                        unlink($oldImagePath);
                    }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = public_path('assets/images/homeAbout'); // Define storage path

                // Create directory if it doesn't exist
                if (!file_exists($destinationPath)) 
                {
                    mkdir($destinationPath, 0755, true);
                }

                 if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) 
                {
                    // Convert JPG/PNG to WebP
                    $img = $manager->read($image->getRealPath())->toWebp(80); 
                    $img->save($destinationPath . '/' . $imageName);
                    $imageName = $timestampName;
                } 
            
                elseif ($originalExtension === 'webp')
                {
                    // Save WebP as-is
                    $image->move($destinationPath, $imageName);
                    $imageName = $timestampName;
                } 
                 else 
                {
                    // Return if unsupported format
                    return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
                }
            }

        // Update home about record
        $homeAbout->update([
             'tag'          => $request->tag ?? $homeAbout->tag,
            'heading'       => $request->heading ?? $homeAbout->heading,
            'sub_heading'   => $request->sub_heading ?? $homeAbout->sub_heading,
            'image'         => $imageName ?? $homeAbout->image,
            'content'       => $request->content ?? $homeAbout->content,
            'button_text'   => $request->button_text ?? $homeAbout->button_text,
            'button_url'    => $request->button_url ?? $homeAbout->button_url
        ]);

        return response()->json([
            'message' => 'Home About updated successfully.',
            'data'    => $homeAbout,
        ], 200);
    }

    // Delete a home about (soft delete)
    public function destroy($id)
    {
        $homeAbout = HomeAbout::findOrFail($id);

        // Delete each image from storage
        // Delete image file
        $filePath = public_path('assets/images/homeAbout/' . $homeAbout->image);
         if (file_exists($filePath))
         {
            unlink($filePath);
        }

        // Delete the DB record
        $homeAbout->delete();

        return response()->json(['message' => 'Record deleted successfully.']);
    }

}
