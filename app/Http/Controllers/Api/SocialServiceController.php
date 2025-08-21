<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SocialService;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Inertia\Inertia;

class SocialServiceController extends Controller
{
    public function index()
    {
        $socialService = SocialService::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/SMM/SocialService', [
            'socialServices' => $socialService,
        ]);

        // return Inertia::render('Admin/Other/GoogleMedia', [
        //     'googleMedia' => $googleMedia,
        //     'flash' => session('flash')
        // ]);
    }

    // POST a new Google Media
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'heading'        => 'required|string|max:255',
            'description'    => 'required|string|max:1000',
           
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

      

        // Create new Google Media record
        $SocialService = SocialService::create([ 
            'heading'       => $request->heading,
            'description'   => $request->description,
        ]);

        return redirect()->route('social-service.index')->with('success', 'Social Media Service created successfully.');

    }
    public function update(Request $request, $id)
    {
        $SocialService = SocialService::find($id);

        if (!$SocialService) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [ 
            'heading'        => 'required|string|max:255',
            'description'    => 'required|string|max:1000',
           
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

    
        $SocialService->update([
           
            'heading'       => $request->heading ,
            'description'   => $request->description,
          
        ]);

        return redirect()->route('social-service.index')->with('success', 'Social Media Service updated successfully.');
    }

    // Delete a Social Service record
    public function destroy($id)
    {
        $socialService = SocialService::find($id);

        if (!$socialService) {
            return redirect()->route('social-service.index')->with('error', 'Social Media Service not found');
        }

        $socialService->delete();

        return redirect()->route('social-service.index')->with('success', 'Social Media Service deleted successfully!');
    }
}