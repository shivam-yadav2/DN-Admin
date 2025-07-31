<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Creative; 
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver; // Import GD driver for image processing
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CreativesController extends Controller
{
    // Show all creatives (for web interface)
    public function index()
    {
        $creatives = Creative::latest()->get();
        
        return Inertia::render('Admin/Other/CreativesManager', [
            'creatives' => $creatives,
            'success' => session('success'),
            'error' => session('error')
        ]);
    }



    //Store a new creative
    public function store(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if (!$request->hasFile('images')) {
            return response()->json(['message' => 'Image file is required.'], 400);
        }

         // Ensure directory exists before saving
        $destinationPath = public_path('assets/images/creatives');
        if (!file_exists($destinationPath)) 
            {
                mkdir($destinationPath, 0755, true);
            }

        $manager = new ImageManager(new GdDriver());
        $uploaded = [];                                                                                                                                                                                                                                                                           

        foreach ($request->file('images') as $imageFile) 
            {

              $extension = strtolower($imageFile->getClientOriginalExtension());
            
             //  If WebP, just check dimensions and move
                if ($extension === 'webp')
                {
                    $image = $manager->read($imageFile);
                    $width = $image->width();
                    $height = $image->height();

                    if ($width <= $height)
                    {
                        continue; // Skip portrait
                    }

                    $filename = time() . '_' . uniqid() . '.webp';
                    $image->save($destinationPath . '/' . $filename);

                    $creative = Creative::create
                    ([
                        'image' => $filename,
                    ]);

                    $uploaded[] = $creative;
                    continue;
                }

                //Process jpg/png/jpeg
                $image = $manager->read($imageFile);
                $width = $image->width();
                $height = $image->height();

                 if ($width <= $height) 
                {
                    continue; // Skip portrait
                }

                $webpName = time() . '_' . uniqid() . '.webp';
                $webpPath = $destinationPath . '/' . $webpName;

                 $image->toWebp(80)->save($webpPath);

                $creative = Creative::create([
                 'image' => $webpName,
                ]);

                $uploaded[] = $creative;
            }

        // Return error if no valid images uploaded
        if (count($uploaded) === 0) {
            return response()->json(['message' => 'No valid landscape images uploaded.'], 422);
        }

        // return response()->json([
        //     'message' => 'Creatives uploaded successfully.',
        //     'data' => $uploaded,
        // ], 201);
        return redirect()->route('creatives.index')->with('success', $message);
    }

   
     //Delete a creative
    public function destroy($id)
    {
        $creative = Creative::findOrFail($id);

        // Delete each image from storage
        // Delete image file
        $filePath = public_path('assets/images/creatives' . $creative->image);
         if (file_exists($filePath))
         {
            unlink($filePath);
        }

        // Delete the DB record
        $creative->delete();

        // return response()->json(['message' => 'Creative deleted successfully.']);
        return redirect()->back()->with('success', 'Creative deleted successfully.');
    }
}


