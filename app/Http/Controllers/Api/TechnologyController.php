<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\technology;
use Intervention\Image\ImageManager;            //Ensure you have intervention image installed
use Intervention\Image\Drivers\GD\Driver as GdDriver;       //Import GD driver for image proceesing
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
class TechnologyController extends Controller
{
    //Get all technologies
    public function index()
    {
        $technologies = technology::all()->map(function ($tech) {
            return [
                'id' => $tech->id,
                'img' => $tech->img,
                'heading' => $tech->heading,
            ];
        });
        return Inertia::render('Admin/HomePage/ToolsPage', [
            'technologies' => $technologies,
        ]);
    }

    //Store
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'img' => 'required|image|mimes:jpg,jpeg,png|max:512',
            'heading' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        //Check if image file is present in the request
        if(!$request->hasFile('img'))
        {
            return response()->json(['message' => 'Image file is required'
            ], 400);
        }

        //Create an instance of ImageManager with GdDriver
        $manager = new ImageManager(new GdDriver());
        $image = $manager->read($request->file('img'));     //Read and Manipulate the image

        //Read the image to 200 x 200(square) and convert to webp
        $image->resize(200, 200);

        $webpName = time() . '.webp';
        $webpPath = public_path('assets/technology/' . $webpName);
        $image->toWebp(75)->save($webpPath);

        //Save technology to the database
        $technology = technology::create([
            'img' => $webpName,
            'heading' => $request->heading,
        ]);

        // return response()->json([
        //     'message' => 'Technology created successfully',
        //     'data' => $technology,
        // ], 201);
        return redirect()->back()->with('success', 'Technology created successfully');
        
    }


        //Delete method
        public function delete($id)
    {
        $technology = technology::find($id);

        if (!$technology) {
            return response()->json(
                [
                    'data' => "Technology not found"
                ], 404
            );
        }

        //delete image file
        if($technology->img && file_exists(public_path('assets/technology/' . $technology->img))){
            unlink(public_path('assets/technology/' . $technology->img));
        }

        $technology->delete();
        return response()->json([
            'message' => "Technology deleted successfully",
        ], 200);
    }

    //Update method
    public function update(Request $request, $id)
    {
        $technology = technology::find($id);
        
        if (!$technology) {
            return response()->json([
                'message' => 'Technology not found',
            ], 404);
        }
    
        //Validate inputs
        $validator = Validator::make($request->all(), [
             'img' => 'required|image|mimes:jpg,png,jpeg|max:512',
            'heading' => 'required',
         ]);

         if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }
    
        $updateData = [
            'heading' => $request->heading,
        ];
    
    
        if ($request->hasFile('img')) {
            // Delete old image if it exists
            if ($technology->img && file_exists(public_path('assets/technology/' . $technology->img))) {
                unlink(public_path('assets/technology/' . $technology->img));
            }

            //Process new image
        $manager = new ImageManager(new GdDriver());
        $image = $manager->read($request->file('img'));
        $image->resize(200, 200);

          $webpName = time() . '.webp';
          $webpPath = public_path('assets/technology/' . $webpName);
          $image->toWebp(75)->save($webpPath);

          $updateData['img'] = $webpName;
        }
    
        $technology->update($updateData);
    
        return response()->json([
            'message' => 'Technology updated successfully',
            'data' => $technology,
        ], 200);
    }
}

