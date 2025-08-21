<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dev_Commerce;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\Gd\Driver as GdDriver; // Import GD driver
use Inertia\Inertia;

class DevCommerceController extends Controller
{
     //Get data
    public function index()
    {
         $dev_commerces = Dev_Commerce::all();
        // return response()->json($dev_commerces, 200);

        // return Inertia::render('Admin/SEO/Service', [
        //     'seo_services' => Seo_Service::all(),
        // ]);
        return Inertia::render('Admin/Dev/DevCommerce', [
            'devCommerces' => $dev_commerces,
        ]);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tag'           => 'required|string',
            'image'         => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'heading'       => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
            'skills'        => 'required|array',
            'label'         => 'required|string|max:255',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
            ], 422);
            }
     
        // if (!$request->hasFile('image')) {
        //     return response()->json(['message' => 'Image file is required'], 400);
        // }

        if($request->hasFile('image'))
        {
            // Process the uploaded file
            $image = $request->file('image');
            $originalExtension = strtolower($image->getClientOriginalExtension());

            $manager = new ImageManager(new GdDriver());

            // Assign filename properly
            $imageName = time() . '.webp'; 
            $destinationPath = 'assets/images/dev_commerce';

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
            $imageName = 'assets/images/dev_commerce/' . $imageName;

        }
        //Create a new dev commerce
        $dev_commerce = Dev_Commerce::create([
            'tag'           => $request->tag,
           'image'          => $imageName,
           'heading'        => $request->heading,
           'description'    => $request->description,
           'skills'         => $request->skills,
           'label'          => $request->label,
         ]);

         return redirect()->route('dev-commerce.index')->with('success', 'Development commerce created successfully.');
        // return redirect()->route('seo-services.index')->with('message', 'SEO service created successfully.');
    }

    //Update a seo servie
    public function update(Request $request, $id)
    {
         $dev_commerce = Dev_Commerce::find($id);

        if (!$dev_commerce) {
            return response()->json(['message' => 'DEv Commerce not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tag'           => 'sometimes|required|string|max:255',
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'heading'       => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
            'skills'        => 'sometimes|required|array',
            'label'         => 'sometimes|required|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

            // Default to old image
                $imageName = $dev_commerce->image;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                 if ($dev_commerce->image && file_exists(public_path($dev_commerce->image))) {
                    unlink(public_path($dev_commerce->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = 'assets/images/dev_commerce'; // Define storage path

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
                $imageName = 'assets/images/dev_commerce/' . $timestampName;
            }
            // Update tag record
        $dev_commerce->update([
              'tag'             => $request->tag ?? $dev_commerce->tag,
              'image'           => $imageName ?? $dev_commerce->image,
              'heading'         => $request->heading ??  $dev_commerce->heading,
              'description'     => $request->description ?? $dev_commerce->description,
              'skills'          => $request->skills ?? $dev_commerce->skills,
              'label'          => $request->label ?? $dev_commerce->label,
        ]);
        return redirect()->route('dev-commerce.index')->with('success', 'Dev commerce updated successfully.');
        // return redirect()->route('seo-services.index')->with('message', 'SEO service updated successfully.');
    }

     // Delete a project
    public function destroy($id)
    {
        $dev_commerce = Dev_Commerce::find($id);

        if (!$dev_commerce) 
            {
                return redirect()->route('dev-commerce.index')->with('error', 'Dev Commerce  not found');
            }

        // Delete associated files
          // Delete image file if exists
        if ($dev_commerce->image && file_exists(public_path($dev_commerce->image))) {
            unlink(public_path($dev_commerce->image));
        }

        $dev_commerce->delete();

        return redirect()->route('dev-commerce.index')->with('success', 'Dev Commerce deleted successfully!');
        // return redirect()->route('seo-services.index')->with('message', 'SEO service deleted successfully.');
    }
}
