<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Creative; 
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver; // Import GD driver for image processing
use Illuminate\Support\Facades\Validator;

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
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if (!$request->hasFile('images')) {
            return response()->json(['message' => 'Image file is required.'], 400);
        }

        $manager = new ImageManager(new GdDriver());
        $uploaded = [];

        foreach ($request->file('images') as $imageFile) {
            $image = $manager->read($imageFile);
            $width = $image->width();
            $height = $image->height();

            if ($width <= $height) {
                continue; // Skip portrait images
            }

            $webpName = time() . '_' . uniqid() . '.webp';
            $webpPath = public_path('assets/creatives/' . $webpName);

            $image->toWebp(80)->save($webpPath);

            $creative = OurCreative::create([
                'image' => $webpName,
            ]);

            $uploaded[] = $creative;
        }

        // ✅ Return error if no valid images uploaded
        if (count($uploaded) === 0) {
            return response()->json(['message' => 'No valid landscape images uploaded.'], 422);
        }

        return response()->json([
            'message' => 'Creatives uploaded successfully.',
            'data' => $uploaded,
        ], 201);
    }
   
    //Update a creative
     public function update(Request $request, $id)
    {
        $creative = OurCreative::find($id);

        if (!$creative) {
            return response()->json(['message' => 'Creative not found.'], 404);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $manager = new ImageManager(new GdDriver());
            $image = $manager->read($request->file('image'));
            $width = $image->width();
            $height = $image->height();

            if ($width <= $height) {
                return response()->json(['message' => 'Image must be in landscape orientation.'], 422);
            }

            $webpName = time() . '_' . uniqid() . '.webp';
            $webpPath = public_path('assets/creatives/' . $webpName);
            $image->toWebp(85)->save($webpPath);

            // Optional: delete old image file here if needed
            $creative->image = $webpName;
        }

        $creative->save();

        return response()->json([
            'message' => 'Creative updated successfully.',
            'data' => $creative,
        ], 200);
    }
    
     //Delete a creative
    public function destroy($id)
    {
        $creative = Creative::findOrFail($id);

        // Delete each image from storage
        foreach ($creative->images as $filename) 
        {
            $filePath = public_path('assets/creatives/' . $filename);
            if (file_exists($filePath)) 
            {
                unlink($filePath);
            }
        }

        // Delete the DB record
        $creative->delete();

        return response()->json(['message' => 'Creative and associated images deleted successfully.']);
    }
}

