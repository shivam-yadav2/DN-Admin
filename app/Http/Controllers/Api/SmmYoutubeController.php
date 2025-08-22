<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sm_Youtube;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\Gd\Driver as GdDriver; // Import GD driver
use Inertia\Inertia;

class SmmYoutubeController extends Controller
{
     //Get data
    public function index()
    {
         $smm_youtube = Sm_Youtube::all();
        // return response()->json($sm_youtube, 200);
        return Inertia::render('Admin/SMM/SmmYoutube', [
            'smmYoutube' => $smm_youtube,
        ]);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'         => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'heading'       => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
            'features'      => 'required|array',
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
            $destinationPath = 'assets/images/smm_youtube';

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
            $imageName = 'assets/images/smm_youtube/' . $imageName;

        }
        //Create a new seo service
        $sm_youtube = Sm_Youtube::create([
           'image'          => $imageName,
           'heading'        => $request->heading,
           'description'    => $request->description,
           'features'       => $request->features,
         ]);

        //  return response()->json([
        //     'message' => 'Youtube marketing service created successfully.',
        //     'data' => $sm_youtube,
        //  ], 201);
        return redirect()->route('smm-youtube.index')->with('success', 'YouTube marketing service created successfully.');
    }

    //Update a seo servie
    public function update(Request $request, $id)
    {
         $sm_youtube = Sm_Youtube::find($id);

        if (!$sm_youtube) {
            return response()->json(['message' => 'Youtube marketing service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
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
                $imageName = $sm_youtube->image;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                 if ($sm_youtube->image && file_exists(public_path($sm_youtube->image))) {
                    unlink(public_path($sm_youtube->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = 'assets/images/smm_youtube'; // Define storage path

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
                $imageName = 'assets/images/smm_youtube/' . $timestampName;
            }
            // Update tag record
        $sm_youtube->update([
              'image'           => $imageName ?? $sm_youtube->image,
              'heading'         => $request->heading ??  $sm_youtube->heading,
              'description'     => $request->description ?? $sm_youtube->description,
              'features'        => $request->features ?? $sm_youtube->features,
        ]);

        // return response()->json([
        //     'message' => 'Youtube marketing service updated successfully.',
        //     'data' => $sm_youtube,
        // ], 200);
        // return redirect()->route('seo-services.index')->with('message', 'SEO service updated successfully.');
        return redirect()->route('smm-youtube.index')->with('success', 'YouTube marketing service updated successfully.');
    }

     // Delete a project
    public function destroy($id)
    {
        $sm_youtube = Sm_Youtube::find($id);

        if (!$smm_youtube) {
            return redirect()->route('smm-youtube.index')->with('error', 'YouTube marketing service not found');
        }

        if ($smm_youtube->image && file_exists(public_path($smm_youtube->image))) {
            unlink(public_path($smm_youtube->image));
        }

        $smm_youtube->delete();

        return redirect()->route('smm-youtube.index')->with('success', 'YouTube marketing service deleted successfully!');
    }

}
