<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Graphics_logo;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager; // Ensure you have Intervention Image installed
use Intervention\Image\Drivers\Gd\Driver as GdDriver; // Import GD driver
use Inertia\Inertia;

class GraphicsLogoController extends Controller
{
    public function index()
    {
        $graphic_logo = Graphics_logo::orderBy('created_at', 'desc')->get();

        // return response()->json([
        //     'msg' => "Get data successfully",
        //     'data' => $graphic_logo,
        // ]);
        return Inertia::render('Admin/Other/GraphicsLogo', [
            'graphicLogos' => $graphic_logo,
        ]);
        // return Inertia::render('Admin/Other/Projects', [
        //     'projects' => $projects,
        //     'flash' => session('flash')
        // ]);
    }

    // POST a new project
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'img' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'url' => 'required|url|max:255|unique:graphic_logo,url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }



        $imageName = null;
        if ($request->hasFile('img')) {
            // Process the uploaded file
            $image = $request->file('img');
            $originalExtension = $image->getClientOriginalExtension();

            $manager = new ImageManager(new GdDriver());



            // Assign filename properly
            $imageName = time() . '.webp';
            $destinationPath = 'assets/images/graphic_logo';

            // Create directory if it doesn't exist
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            // Convert and save the image

            // Convert image to webp format
            $img = $manager->read($image->getRealPath())->toWebp(80);
            $img->save($destinationPath . '/' . $imageName);


            // else 
            // {
            //     return response()->json(['message' => 'Only JPG, JPEG, PNG or WEBP formats allowe'], 400);
            // }

            // Save relative path in DB
            $imageName = 'assets/images/graphic_logo/' . $imageName; // ✅ relative path in DB

        }


        // Create new project record
        $graphic = Graphics_logo::create([
            'name' => $request->name,
            'img' => $imageName,
            'url' => $request->url,
        ]);


        return redirect()->route('graphics-logo.index')->with('success', 'Data Added Successfully');
    }

    // Update an existing project
    public function update(Request $request, $id)
    {
        $Graphics_logo = Graphics_logo::find($id);

        if (!$Graphics_logo) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'img' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'url' => 'required|url|max:255|unique:graphic_logo,url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        // Default to old image
        $imageName = $Graphics_logo->img;


        // Process the uploaded file
        if ($request->hasFile('img')) {
            // Delete old image if exists
            if ($Graphics_logo->img && file_exists(public_path($Graphics_logo->img))) {
                unlink(public_path($Graphics_logo->img));
            }

            $image = $request->file('img'); // Get the uploaded file
            $originalExtension = $image->getClientOriginalExtension(); // Get and lowercase the original extension

            $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

            $timestampName = time() . '.webp'; // Generate a unique filename

            $destinationPath = 'assets/images/graphic_logo'; // Define storage path

            // Create directory if it doesn't exist
            if (!file_exists(public_path($destinationPath))) {
                mkdir(public_path($destinationPath), 0755, true);
            }

            if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) {
                // Convert JPG/PNG to WebP
                $img = $manager->read($image->getRealPath())->toWebp(80);
                $img->save(public_path($destinationPath . '/' . $timestampName));
            } else {
                // Return if unsupported format
                return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
            }

            // Save relative path in DB
            $imageName = 'assets/images/graphic_logo/' . $timestampName; // ✅ relative path in DB
        }

        // Update tag record
        $Graphics_logo->update([
            'name' => $request->name,
            'image' => $imageName,
            'url' => $request->url,

        ]);

        return redirect()->route('graphics-logo.index')->with('success', 'Data Updated Successfully');
    }

    // Delete a project
    public function destroy($id)
    {
        $graphic_logo = Graphics_logo::find($id);

        if (!$graphic_logo) {
            return redirect()->back()->withErrors(['general' => 'Graphic data not found']);
        }

        // Delete associated image
        // if (!empty($graphic_logo->img) && file_exists(public_path($graphic_logo->img))) {
        //     unlink(public_path($graphic_logo->img));
        // }
        $graphic_logo->delete();
        return redirect()->route('graphics-logo.index')->with('success', 'record deleted successfully');
    }
}
