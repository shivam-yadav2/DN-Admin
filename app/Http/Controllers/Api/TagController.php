<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tag;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\Gd\Driver as GdDriver; // Import GD driver for image processing
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
class TagController extends Controller
{
    ////Get all data
    public function index()
    {
        $tags = Tag::all();
        return Inertia::render('Admin/Other/TagManagement', [
            'tags' => $tags
        ]);
    }

    // POST a new tag
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'title'          => 'required|string|max:255',
            'description'    => 'required|string|max:255',
            'keyword'        => 'nullable|string|max:255',
            'page_url'       => 'required|url|max:255|unique:tags,page_url',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:512',
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

        // $timestampName = time(). '.webp';       //Generate a unique file name
        // $imageName = $timestampName;

         // Assign filename properly
        $imageName = time() . '.webp'; 
        $destinationPath = 'assets/images/tags';

        //Create directory
        if (!file_exists($destinationPath)) 
            {
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

         // Save relative path in DB
        $imageName = 'assets/images/tags/' . $imageName;

        // Create new tag record
        $tag = Tag::create([
             'title'          => $request->title,
            'description'     => $request->description,
            'keyword'         => $request->keyword,
            'page_url'        => $request->page_url,
            'image'           => $imageName,
            
        ]);

        return back()->with([
            'message' => 'Tag added successfully!',
            'type' => 'success'
        ]);
    }

    // Update an existing tag 
    public function update(Request $request, $id)
    {
        $tag = Tag::find($id);

        if (!$tag) 
            {
                 return response()->json(['message' => 'Record not found.'], 404);
            }

        // Validate request
        $validator = Validator::make($request->all(), [
            
            'title'         => 'sometimes|required|string|max:255',
            'description'    => 'sometimes|nullable|string|max:255',
            'keyword'        => 'sometimes|nullable|string|max:255',
            'page_url'       => 'sometimes|required|url|max:255|unique:tags,page_url,' . $id,
            'image'          => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:512',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

                // Default to old image
                $imageName = $tag->image;

                // Process the uploaded file
         if ($request->hasFile('image')) 
            {
                // $oldImagePath = public_path('assets/images/tags/' . $tag->image);
                // if (file_exists($oldImagePath)) 
                //     {
                //         unlink($oldImagePath);
                //     }

                  if ($tag->image && file_exists(public_path($tag->image))) {
                    unlink(public_path($tag->image));
                }

                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = 'assets/images/tags'; // Define storage path

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
                $imageName = 'assets/images/tag/' . $timestampName;
            }

        // Update tag record
        $tag->update([
              'title'          => $request->title ?? $tag->title,
              'description'    => $request->description ?? $tag->description,
              'keyword'        => $request->keyword ?? $tag->keyword,
              'page_url'       => $request->page_url ?? $tag->page_url,
              'image'          => $imageName ?? $tag->image,
        ]);

         return back()->with([
            'message' => 'Tag updated successfully!',
            'type' => 'success'
        ]);
    }

    // Delete a tag 
    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);

        if (!$tag) 
            {
                return response()->json([
                    'message' => 'Tag not found',
                
                ], 404);
            }

        // Delete each image from storage

        $filePath = public_path( $tag->image);
         if (file_exists($filePath))
         {
            unlink($filePath);
        }

        // Delete the DB record
        $tag->delete();

         return response()->json([
            'message' => 'Tag deleted successfully!',
        ]);
    }

}
