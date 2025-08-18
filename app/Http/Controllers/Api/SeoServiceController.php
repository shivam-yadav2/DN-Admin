<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seo_Service;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\Gd\Driver as GdDriver; // Import GD driver
use Inertia\Inertia;

class SeoServiceController extends Controller
{
    //Get data
    public function index()
    {
        return Inertia::render('Admin/SEO/Service', [
            'seo_services' => Seo_Service::all(),
        ]);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'         => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'heading'       => 'required|string|max:255',
            'subheading'    => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
            'features'      => 'required|array',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
            ], 422);
            }
     
        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'Image file is required'], 400);
        }

        // Process the uploaded file
        $image = $request->file('image');
        $originalExtension = strtolower($image->getClientOriginalExtension());

        $manager = new ImageManager(new GdDriver());

        // $timestampName = time() . '.webp'; // Generate a unique file name
        // $imageName = $timestampName;

          // Assign filename properly
        $imageName = time() . '.webp'; 
        $destinationPath = 'assets/images/seo_service';

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
            return response()->json(['message' => 'Only JPG, JPEG, PNG or WEBP formats allowed'], 400);
        }

         // Save relative path in DB
                $imageName = 'assets/images/seo_service/' . $imageName;

        //Create a new seo service
        $seo_service = Seo_Service::create([
           'image'          => $imageName,
           'heading'        => $request->heading,
           'subheading'     => $request->subheading,
           'description'    => $request->description,
           'features'       => $request->features,
         ]);

        //  return response()->json([
        //     'message' => 'Seo service created successfully.',
        //     'data' => $seo_service,
        //  ], 201);
        return redirect()->route('seo-services.index')->with('message', 'SEO service created successfully.');
    }

    //Update a seo servie
    public function update(Request $request, $id)
    {
         $seo_service = Seo_Service::find($id);

        if (!$seo_service) {
            return response()->json(['message' => 'Seo Service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'heading'       => 'sometimes|required|string|max:255',
            'subheading'    => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
            'features'      => 'sometimes|required|array',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

            // Default to old image
                $imageName = $seo_service->image;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                // $oldImagePath = public_path('assets/images/projects/' . $seo_service->image);
                // if (file_exists($oldImagePath)) 
                //     {
                //         unlink($oldImagePath);
                //     }
                 if ($seo_service->image && file_exists(public_path($seo_service->image))) {
                    unlink(public_path($seo_service->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = 'assets/images/seo_service'; // Define storage path

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

                 // Save relative path in DB
                $imageName = 'assets/images/seo_service
                /' . $timestampName;
            }
            // Update tag record
        $seo_service->update([
              'image'           => $imageName ?? $seo_service->image,
              'heading'         => $request->heading ??  $seo_service->heading,
              'subheading'      => $request->subheading ?? $seo_service->subheading,
              'description'     => $request->description ?? $seo_service->description,
              'features'        => $request->features ?? $seo_service->features,
        ]);
        // return response()->json([
        //     'message' => 'Seo service updated successfully.',
        //     'data' => $seo_service,
        // ], 200);
        return redirect()->route('seo-services.index')->with('message', 'SEO service updated successfully.');
    }

     // Delete a project
    public function destroy($id)
    {
        $seo_service = Seo_Service::find($id);

        if (!$seo_service) {
        return response()->json([
            'message' => 'Seo Service not found',
          
        ], 404);
    }

        // Delete associated files
        if ($seo_service->image) {
            $imagePath = ('assets/images/seo-service/' . $seo_service->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $seo_service->delete();

        // return response()->json ([
        //     'message' => 'Seo Service deleted successfully!',
        // ]);
        return redirect()->route('seo-services.index')->with('message', 'SEO service deleted successfully.');
    }
}
