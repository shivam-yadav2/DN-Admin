<?php

//Not working
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SEO_Form;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver; // Import GD driver


class SeoFormController extends Controller
{
    //Get all data
    public function index()
    {
        $forms = SEO_Form::all();
        return response()->json($forms, 200);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'image'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:512',
            'name'              => 'required|string|max:255',
            'website_url'       => 'required|url|max:255|unique:seo_forms,website_url',
            'email'             => 'required|email|max:255',
            'current_traffic'   => 'required|string|in:Low,Medium,High|max:100',
            'message'           => 'required|string|max:1000',
            'button'            => 'required|string|max:255',
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

                // $timestampName = time() . '.webp'; // Generate a unique file name
                //  $imageName = $timestampName;

                  // ✅ Assign filename properly
                $imageName = time() . '.webp';  
                $destinationPath = 'assets/images/seo_form';

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
                $imageName = 'assets/images/seo_form/' . $imageName;
            }
         else 
            {
                // No image in request: reuse the latest image from existing entry
                $latest = SEO_Form::latest()->first();
                $imageName = $latest?->image ?? null;

                if (!$imageName) 
                    {
                        return response()->json(['message' => 'Image is required on first upload.'], 400);
                    }
            }
    
        // Create new project record
        $form = SEO_Form::create([
            'image'             => $imageName,
            'name'              => $request->name,
            'website_url'       => $request->website_url,
            'email'             => $request->email,
            'current_traffic'   => $request->current_traffic,
            'message'           => $request->message,
            'button'            => $request->button,
        ]);

        return response()->json([
            'message' => 'SEO Form submitted successfully',
            'data' => $form
        ], 201);
    }

    //Update data
    public function update(Request $request, $id)
    {
        $form = SEO_Form::find($id);

        if (!$form) {
            return response()->json(['message' => 'SEO not found'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            
            'image'             => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:512',
            'name'              => 'sometimes|required|string|max:255',
            'website_url'       => 'sometimes|required|url|max:255|unique:seo_forms,website_url,' . $id,
            'email'             => 'sometimes|required|email|max:255',
            'current_traffic'   => 'sometimes|required|string|in:Low,Medium,High|max:100',
            'message'           => 'sometimes|required|string|max:1000',
            'button'            => 'sometimes|required|string|max:255',
            
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

           // Default to old image
                $imageName = $form->image;

            // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                // $oldImagePath =('assets/images/seo_form/' . $form->image);
                // if (file_exists($oldImagePath)) 
                //     {
                //         unlink($oldImagePath);
                //     }
                 // delete old image if exists
                if ($form->image && file_exists(public_path($form->image))) {
                    unlink(public_path($form->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = 'assets/images/seo_form'; // Define storage path

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
                $imageName = 'assets/images/seo_form/' . $timestampName;
            }

        // Update tag record
        $form->update([
            'image'           => $imageName,
            'name'            => $request->name ?? $form->name, 
            'website_url'     => $request->website_url ?? $form->website_url,
            'email'           => $request->email ?? $form->email,
            'current_traffic' => $request->current_traffic ?? $form->current_traffic,
            'message'         => $request->message ?? $form->message ,
            'button'          => $request->button ?? $form->button ,
            
        ]);

        return response()->json([
            'message' => 'Record updated successfully.',
            'data'    => $form,
        ], 200);
    }

}
