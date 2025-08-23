<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Google_Media;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Inertia\Inertia;

class GoogleMediaController extends Controller
{
    public function index()
    {
        $googleMedia = Google_Media::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Google/GoogleMedia', [
            'googleMedia' => $googleMedia,
        ]);
    }

    // POST a new Google Media
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'icon'           => 'required|string',
            'heading'        => 'required|string|max:255',
            'description'    => 'required|string|max:1000',
            'platform'       => 'required|string|max:255',
            'benefit'        => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

      

        // Create new Google Media record
        $googleMedia = Google_Media::create([
            'icon'          => $request->icon,
            'heading'       => $request->heading,
            'description'   => $request->description,
            'platform'      => $request->platform,
            'benefit'       => $request->benefit,
        ]);

        return redirect()->route('google-media.index')->with('success', 'Google Media created successfully!');
    }

    // Update an existing Google Media
    public function update(Request $request, $id)
    {
        $googleMedia = Google_Media::find($id);

        if (!$googleMedia) {
            return response()->json(['message' => 'Google Media not found'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'icon'           => 'required|string',
            'heading'        => 'required|string|max:255',
            'description'    => 'required|string|max:1000',
            'platform'       => 'required|string|max:255',
            'benefit'        => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

      

        // Update Google Media record
        $googleMedia->update([
            'icon'          => $request->icon,
            'heading'       => $request->heading ,
            'description'   => $request->description,
            'platform'      => $request->platform,
            'benefit'       => $request->benefit  ,
        ]);

       
        return redirect()->route('google-media.index')->with('success', 'Google Media updated successfully!');
    }

    // Delete a Google Media
    public function destroy($id)
    {
        $googleMedia = Google_Media::find($id);

        if (!$googleMedia) {
            return redirect()->back()->withErrors(['general' => 'Google Media not found']);
        }


        $googleMedia->delete();

        return redirect()->route('google-media.index')->with('success', 'Google Media deleted successfully!');
    }
}