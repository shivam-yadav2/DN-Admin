<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SEO_Highlight;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver; // Import GD driver

class SeoHighlightController extends Controller
{
    //Get all data
    public function index()
    {
        $seo = SEO_Highlight::all();
        return response()->json($seo, 200);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:512',
            'heading'       => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

         $imageName = null;

        // Only process image if it's uploaded
        if($request->hasFile('image'))
            {
                $image = $request->file('image');
                $originalExtension = strtolower($image->getClientOriginalExtension());

                $manager = new ImageManager(new GdDriver());

                $timestampName = time() . '.webp'; // Generate a unique file name
                $imageName = $timestampName;
                $destinationPath = public_path('assets/images/seo');

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
            }
         else 
            {
                // No image in request: reuse the latest image from existing entry
                $latest = SEO_Highlight::latest()->first();
                $imageName = $latest?->image ?? null;

                if (!$imageName) 
                    {
                        return response()->json(['message' => 'Image is required on first upload.'], 400);
                    }
            }
    
        // Create new project record
        $seo = SEO_Highlight::create([
            'image'         => $imageName,
            'heading'       => $request->heading,
            'description'   => $request->description
        ]);

        return response()->json([
            'message' => 'SEO Highlight created successfully',
            'data' => $seo
        ], 201);
    }

    //Updata data
    public function update(Request $request, $id)
    {
        $seo = SEO_Highlight::find($id);

        if (!$seo) {
            return response()->json(['message' => 'SEO not found'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'heading'       => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
            
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

           // Default to old image
                $imageName = $seo->image;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                $oldImagePath = public_path('assets/images/seo/' . $seo->image);
                if (file_exists($oldImagePath)) 
                    {
                        unlink($oldImagePath);
                    }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = public_path('assets/images/seo'); // Define storage path

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

        // Update tag record
        $seo->update([
               'image'          => $imageName,
              'heading'         => $request->heading ?? $seo->heading,
              'description'      => $request->description ?? $seo->description,
              
            
        ]);

        return response()->json([
            'message' => 'Record updated successfully.',
            'data'    => $seo,
        ], 200);
    }
}
