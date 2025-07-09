<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OurCreative; 

class CreativesController extends Controller
{
    //Get all creatives
    public function index()
    {
        $creatives = OurCreative::all();
        return response()->json($creatives, 200);
    }

    //Store a new creative
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'image' => 'required|image|mimes:webp,jpg,png|max:2048', // Validate image file
        ]);

        // Handle file upload
        if ($request->hasFile('image'))
         {
            $imageName = time() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('assets/creatives'), $imageName);
            $imagePath = 'assets/creatives/' . $imageName; 
        } 
        else
         {
            return response()->json(['message' => 'Image is required'], 400);
        }

         \Log::info('Uploaded image path: ' . $imagePath);

        // Create new creative record
        $creative = OurCreative::create(['image' => $imagePath]);

        return response()->json([
            'message' => 'Creative created successfully.',
            'data' => $creative,
        ], 201);
    }

    //Delete a creative
    public function destroy($id)
    {
        $creative = OurCreative::find($id);

        if (!$creative) {
            return response()->json(['message' => 'Creative not found.'], 404);
        }

        // Delete the creative
        $creative->delete();

        return response()->json(['message' => 'Creative deleted successfully.'], 200);
    }

    //Update a creative
    public function update(Request $request, $id)
    {
        $creative = OurCreative::find($id);

        if (!$creative) {
            return response()->json(['message' => 'Creative not found.'], 404);
        }

        // Validate request
        $request->validate([
            'image' => 'nullable|image|mimes:webp|max:2048', // Validate image file
        ]);

        // Handle file upload if provided
        if ($request->hasFile('image'))
         {
            $imageName = time() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('assets/creatives'), $imageName);
            $creative->image = 'assets/creatives/' . $imageName; // Update the image path
        } 
        else 
        {
            // If no new image is provided, keep the existing one
            $creative->image = $creative->image;
        }

        // Save the updated creative
        $creative->save();

        return response()->json([
            'message' => 'Creative updated successfully.',
            'data' => $creative,
        ], 200);
    }

}
