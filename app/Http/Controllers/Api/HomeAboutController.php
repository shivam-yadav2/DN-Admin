<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HomeAbout; // HomeAbout model
use Inertia\Inertia; // Import Inertia for rendering views
use Illuminate\Support\Facades\Validator;


class HomeAboutController extends Controller
{
   //Get all data
   public function index()
    {
        $homeAbouts = HomeAbout::where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/HomePage/About', [
            'homeAbouts' => $homeAbouts,
        ]);
    }

    // POST a new home about
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'metric' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

       


        try {
            // Create new home about record
                   $homeAbout = HomeAbout::create($request->all());

            return redirect()->route('home-about.index')
                ->with('success', 'Home About created successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create Home About. Please try again.')
                ->withInput();
        }
    }

    // Update an existing home about
    public function update(Request $request, $id)
    {
        $homeAbout = HomeAbout::find($id);

        if (!$homeAbout) {
            return response()->json(['message' => 'Home About not found.'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'metric' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        // Update home about record

      try {
                    $homeAbout->update($request->all());


            return redirect()->route('home-about.index')
                ->with('success', 'Home About updated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update Home About. Please try again.')
                ->withInput();
        }
    }

    // Delete a home about (soft delete)
    public function destroy($id)
    {
        $homeAbout = HomeAbout::find($id);

        if (!$homeAbout) {
            return response()->json(['message' => 'Home About not found.'], 404);
        }

        try {
            // Soft delete the home about
            $homeAbout->update(['is_deleted' => true]);

            return redirect()->route('home-about.index')
                ->with('success', 'Home About deleted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete Home About. Please try again.');
        }
    }

}
