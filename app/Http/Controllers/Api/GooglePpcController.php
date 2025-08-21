<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Google_Ppc;
use Illuminate\Http\Request;
use App\Models\Google_Compaigns;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Inertia\Inertia;

class GooglePpcController extends Controller
{
    public function index()
    {
        $googlePpc = Google_Ppc::orderBy('created_at', 'desc')->get();
        
        // return response()->json([
        //     'data'=> $googlePpc,
        //     'msg'=>"Get data successfully",
        // ]);
        return Inertia::render('Admin/Google/GooglePpc', [
            'googlePpc' => $googlePpc,
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
        $googlePpc = Google_Ppc::create([
            'icon'          => $request->icon,
            'heading'       => $request->heading,
            'description'   => $request->description,
        ]);

     
        // return response()->json([
        //     'data'=> $googlePpc,
        //     'message' => 'Google PPC services created successfully!',
        //     'type' => 'success' ,
        // ]);
        return redirect()->route('google-ppc.index')->with('success', 'Google PPC services created successfully!');

    }

    // Update an existing Google Campaign
    public function update(Request $request, $id)
    {
        $googlePpc = Google_Ppc::find($id);

        if (!$googlePpc) {
            return response()->json(['message' => 'googlePpc not found'], 404);
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
       $data= $googlePpc->update([
            'icon'          => $request->icon,
            'heading'       => $request->heading,
            'description'   => $request->description,
        ]);
        return redirect()->route('google-ppc.index')->with('success', 'Google PPC service Updated Successfully');
        
    }

    // Delete a Google Campaign
    public function destroy($id)
    {
        $googlePpc = Google_Ppc::find($id);

        if (!$googlePpc) {
            return response()->json(['general' => 'Google PPC not found']);
        }
    $googlePpc->delete();
        return redirect()->route('google-ppc.index')->with('success', 'Data deleted successfully');
        
    }
}