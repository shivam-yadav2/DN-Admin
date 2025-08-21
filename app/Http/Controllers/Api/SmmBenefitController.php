<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sm_Benefit;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\Gd\Driver as GdDriver; // Import GD driver


class SmmBenefitController extends Controller
{
     //Get data
    public function index()
    {
         $sm_benefit = Sm_Benefit::all();
        return response()->json($sm_benefit, 200);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'         => 'required|image|mimes:jpeg,png,jpg,webp|max:512',
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

            // $timestampName = time() . '.webp'; // Generate a unique file name
            // $imageName = $timestampName;

            // Assign filename properly
            $imageName = time() . '.webp'; 
            $destinationPath = 'assets/images/smm_benefit';

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
            $imageName = 'assets/images/smm_benefit/' . $imageName;

        }
        //Create a new seo service
        $sm_benefit = Sm_Benefit::create([
           'image'          => $imageName,
           'heading'        => $request->heading,
           'description'    => $request->description,
         ]);

         return response()->json([
            'message' => 'SMM benefit created successfully.',
            'data' => $sm_benefit,
         ], 201);
        // return redirect()->route('seo-services.index')->with('message', 'SEO service created successfully.');
    }

    //Update a seo servie
    public function update(Request $request, $id)
    {
         $sm_benefit = Sm_Benefit::find($id);

        if (!$sm_benefit) {
            return response()->json(['message' => 'SMM benefit not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'heading'       => 'sometimes|required|string|max:255',
            'subheading'    => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

            // Default to old image
                $imageName = $sm_benefit->image;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                 if ($sm_bebenfit->image && file_exists(public_path($sm_bebenfit->image))) {
                    unlink(public_path($sm_bebenfit->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = 'assets/images/smm_benefit'; // Define storage path

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
            
                // elseif ($originalExtension === 'webp')
                // {
                //     // Save WebP as-is
                //     $image->move($destinationPath, $timestampName);
                //     // $imageName = $timestampName;
                // } 
                 else 
                {
                    // Return if unsupported format
                    return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
                }

                 // Save relative path in DB
                $imageName = 'assets/images/smm_benefit/' . $timestampName;
            }
            // Update tag record
        $sm_benefit->update([
              'image'           => $imageName ?? $sm_benefit->image,
              'heading'         => $request->heading ??  $sm_benefit->heading,
              'description'     => $request->description ?? $sm_benefit->description,
        ]);

        return response()->json([
            'message' => 'SMM benefit updated successfully.',
            'data' => $sm_benefit,
        ], 200);
        // return redirect()->route('seo-services.index')->with('message', 'SEO service updated successfully.');
    }

     // Delete a project
    public function destroy($id)
    {
        $sm_benefit = Sm_Benefit::find($id);

        if (!$sm_benefit) 
            {
                return response()->json([
                    'message' => 'SMM benefit not found',
                
                ], 404);
            }

          // Delete image file if exists
        if ($sm_benefit->image && file_exists(public_path($sm_benefit->image))) {
            unlink(public_path($sm_benefit->image));
        }
        $sm_benefit->delete();

        return response()->json ([
            'message' => 'SMM benefit deleted successfully!',
        ]);

        // return redirect()->route('seo-services.index')->with('message', 'SEO service deleted successfully.');
    }
}
