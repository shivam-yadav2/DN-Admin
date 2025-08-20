<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Google_Compaigns;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Inertia\Inertia;

class GoogleCompaignsController extends Controller
{
    public function index()
    {
        $googleCompaigns = Google_Compaigns::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'data'=> $googleCompaigns,
            'msg'=>"Get data successfully",
        ]);
        // return Inertia::render('Admin/Other/GoogleCompaigns', [
        //     'googleCompaigns' => $googleCompaigns,
        //     'flash' => session('flash')
        // ]);
    }

    // POST a new Google Campaign
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'icon'           => 'required|string',
            'heading'        => 'required|string|max:255',
            'description'    => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }


        // Create new Google Campaign record
        $googleCompaign = Google_Compaigns::create([
            'icon'          => $request->icon,
            'heading'       => $request->heading,
            'description'   => $request->description,
        ]);

     
        return response()->json([
            'data'=> $googleCompaign,
            'message' => 'Google Campaign created successfully!',
            'type' => 'success' ,
        ]);
    }

    // Update an existing Google Campaign
    public function update(Request $request, $id)
    {
        $googleCompaign = Google_Compaigns::find($id);

        if (!$googleCompaign) {
            return response()->json(['message' => 'Google Campaign not found'], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'icon'           => 'required|string',
            'heading'        => 'required|string|max:255',
            'description'    => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        // Update Google Campaign record
       $data= $googleCompaign->update([
            'icon'          => $request->icon,
            'heading'       => $request->heading,
            'description'   => $request->description,
        ]);

        return response()->json([
            'data'=>$googleCompaign,
            'msg'=>"Google compaign Updated Successfully",
            'type'=>'success',
        ]);
    }

    // Delete a Google Campaign
    public function destroy($id)
    {
        $googleCompaign = Google_Compaigns::find($id);

        if (!$googleCompaign) {
            return response()->json(['general' => 'Google Campaign not found']);
        }
    $googleCompaign->delete();

        return response()->json([
            'msg'=>"Data deleted successfully",
            'type'=>"True",
        ]);
    }
}