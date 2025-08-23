<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seo_Strategy;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\Gd\Driver as GdDriver; // Import GD driver
use Inertia\Inertia;


class SeoStrategyController extends Controller
{
    //
    //Get data
    public function index()
    {
        $seo_strategies = Seo_Strategy::all();
        // return response()->json($seo_strategies, 200);
        return Inertia::render('Admin/SEO/SeoStrategy', [
            'seoStrategies' => $seo_strategies,
        ]);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'         => 'required|image|mimes:jpeg,png,jpg,gif|max:512',
            'heading'       => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }
     
    
        if($request->hasFile('image'))
        {
            // Process the uploaded file
            $image = $request->file('image');
            $originalExtension = strtolower($image->getClientOriginalExtension());

            $manager = new ImageManager(new GdDriver());

            // Assign filename properly
            $imageName = time() . '.webp'; 
            $destinationPath = 'assets/images/seo_strategy';

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
            // elseif ($originalExtension === 'webp') 
            // {
            //     // Save webp image directly
            //     $image->move($destinationPath, $imageName);
            // } 
            else 
            {
                return response()->json(['message' => 'Only JPG, JPEG, PNG or WEBP formats allowed'], 400);
            }

            // Save relative path in DB
            $imageName = 'assets/images/seo_strategy/' . $imageName;
        }

        //Create a new seo service
        $seo_strategy = Seo_Strategy::create([
           'image'          => $imageName,
           'heading'        => $request->heading,
           'description'    => $request->description,
        ]);

        //  return response()->json([
        //     'message' => 'Seo strategy created successfully.',
        //     'data' => $seo_strategy,
        //  ], 201);
        return redirect()->route('seo-strategy.index')->with('success', 'Seo strategy created successfully.');
    }

    //Update a seo servie
    public function update(Request $request, $id)
    {
         $seo_strategy = Seo_Strategy::find($id);

        if (!$seo_strategy) {
            return response()->json(['message' => 'Seo Service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:512',
            'heading'       => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

            // Default to old image
            $imageName = $seo_strategy->image;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                 if ($seo_strategy->image && file_exists(public_path($seo_strategy->image))) {
                    unlink(public_path($seo_strategy->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = 'assets/images/seo_strategy'; // Define storage path

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
                } 
            
                // elseif ($originalExtension === 'webp')
                // {
                //     // Save WebP as-is
                //     $image->move($destinationPath, $timestampName);
                // } 
                 else 
                {
                    // Return if unsupported format
                    return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
                }

                 // Save relative path in DB
                $imageName = 'assets/images/seo_strategy/' . $timestampName;
            }
            // Update tag record
        $seo_strategy->update([
              'image'           => $imageName ?? $seo_strategy->image,
              'heading'         => $request->heading ??  $seo_strategy->heading,
              'description'     => $request->description ?? $seo_strategy->description,
             
        ]);
        
        return redirect()->route('seo-strategy.index')->with('success', 'Seo strategy updated successfully.');
    }

     // Delete a project
    public function destroy($id)
    {
        $seo_strategy = Seo_Strategy::find($id);

        if (!$seo_strategy) 
            {
                return redirect()->route('seo-strategy.index')->with('error', 'Seo Strategy not found');
            }

          // Delete image file if exists
        if ($seo_strategy->image && file_exists(public_path($seo_strategy->image))) {
            unlink(public_path($seo_strategy->image));
        }

        $seo_strategy->delete();

        return redirect()->route('seo-strategy.index')->with('success', 'Seo strategy deleted successfully!');
    }
}
