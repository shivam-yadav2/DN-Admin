<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HomeAbout; // HomeAbout model
use Inertia\Inertia; // Import Inertia for rendering views

class HomeAboutController extends Controller
{
   //Get all data
    public function index()
    {
        $homeAbouts = HomeAbout::where('is_deleted', false)->get();
        return response()->json($homeAbouts, 200);
    }

    // POST a new home about
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'metric' => 'required|string|max:100',
        ]);

        // Create new home about record
        $homeAbout = HomeAbout::create($request->all());

        return response()->json([
            'message' => 'Home About created successfully.',
            'data' => $homeAbout,
        ], 201);
    }

    // Update an existing home about
    public function update(Request $request, $id)
    {
        $homeAbout = HomeAbout::find($id);

        if (!$homeAbout) {
            return response()->json(['message' => 'Home About not found.'], 404);
        }

        // Validate request
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'metric' => 'required|string|max:100',
        ]);

        // Update home about record
        $homeAbout->update($request->all());

        return response()->json([
            'message' => 'Home About updated successfully.',
            'data' => $homeAbout,
        ], 200);
    }

    // Delete a home about (soft delete)
    public function destroy($id)
    {
        $homeAbout = HomeAbout::find($id);

        if (!$homeAbout) {
            return response()->json(['message' => 'Home About not found.'], 404);
        }

        // Soft delete the home about
        $homeAbout->is_deleted = true;
        $homeAbout->save();

        return response()->json(['message' => 'Home About deleted successfully.'], 200);
    }

}
