<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OurCreative; 
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver; // Import GD driver for image processing

class CreativesController extends Controller
{
    //Get all creatives
    public function index()
    {
        $creatives = OurCreative::all();
        return response()->json($creatives, 200);
    }

    //Store a new creative
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'image' => 'required|image|mimes:jpg,png,jpeg|max:512', // Validate image file
        ]);

        // Handle file upload
        if (!$request->hasFile('image'))
         {
            return response()->json(['message' => 'Image file is required.'], 400);
         }

         //Read image and check orientation
         $manager = new ImageManager(new GdDriver()); 
         $image = $manager->read($request->file('image'));

         $width = $image->width(); // Get image width
         $height = $image->height(); // Get image height

            // Check if the image is in landscape orientation
            if ($width <= $height) {
                return response()->json(['message' => 'Image must be in landscape orientation.'
            ], 422);
         }

        // Convert and save image to webp format
            $webpName = time() . '.webp';                   // Name for the webp file
            $webpPath = public_path('assets/creatives/' . $webpName); 

            $image->toWebp(75)->save($webpPath); // Convert to webp format with quality 75

            // //Create a new instance of Manager
            // $manager = new ImageManager(new GdDriver()); // or 'imagick'
            // $image = $manager->read($request->file('image'))->toWebp(75); // Adjust quality as needed
            // $image->save($webpPath);

             $imagePath =  $webpName; // Store the path to the webp image in db

            //Store the creative in the database
            $creative = OurCreative::create([
                'image' => $imagePath, // Save the image path
            ]);

            return response()->json([
                'message' => 'Creative created successfully.', 
                'data' => $creative,
            ], 201);
     }

    //Delete a creative
    // public function destroy($id)
    // {
    //     $creative = OurCreative::find($id);

    //     if (!$creative) {
    //         return response()->json(['message' => 'Creative not found.'], 404);
    //     }

    //     // Delete the creative
    //     $creative->delete();

    //     return response()->json(['message' => 'Creative deleted successfully.'], 200);
    // }

    //Update a creative
    public function update(Request $request, $id)
    {
        $creative = OurCreative::find($id);

        if (!$creative) {
            return response()->json(['message' => 'Creative not found.'], 404);
        }

        // Validate request
        $request->validate([
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:512', // Validate image file
        ]);

        // Handle file upload if provided
        if ($request->hasFile('image'))
         {
            $manager = new ImageManager(new GdDriver()); // Ensure you have the GD driver installed
            $image = $manager->read($request->file('image'))->toWebp(75); // Adjust quality as needed

            $width = $image->width(); // Get image width
            $height = $image->height(); // Get image height

            // Check if the image is in landscape orientation
            if ($width <= $height)
             {
                return response()->json(['message' => 'Image must be in landscape orientation.'
                ], 422);
            }

            //Convert to webp format
            $webpName = time() . '.webp'; // Name for the webp file
           $webpPath = public_path('assets/creatives/' . $webpName);

           // Convert and save image to webp format
            // $manager = new ImageManager(new GdDriver()); // Ensure you have the GD driver installed
            // $image = $manager->read($request->file('image'))->toWebp(75); // Adjust quality as needed
            // $image->save($webpPath);

            //Update DB path
            $creative->image = $webpName; // Update the image path
         }

         //Save the updated creative
        $creative->save();

        return response()->json([
            'message' => 'Creative updated successfully.',
            'data' => $creative,
        ], 200);
    }
    
}

