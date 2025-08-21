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
        $SocialService = SocialService::orderBy('created_at', 'desc')->get();
         return response()->json([
            'data'=>$SocialService,
            'msg'=>"Get data successfully",
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

     
        return response()->json([
            'data'=>$SocialService,
            'message' =>'Social Media Service created successfully!',
           'type' =>'success',
        ]);

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

       
        return response()->json([
            'data'=>$SocialService,
            'message' => 'Social Media Service updated successfully!',
            'type' => 'success'
        ],200);
    }

    // Delete a Google Media
    public function destroy($id)
    {
        $SocialService = SocialService::find($id);

        if (!$SocialService) {
            return redirect()->back()->withErrors(['general' => 'Services not found']);
        }


        $SocialService->delete();

        // return redirect()->back()->with('flash', [
        //     'message' => 'Services deleted successfully!',
        //     'type' => 'success'
        // ]);

        return response()->json([
            'msg'=>"Record deleted successfully",
            'type'=>'success',
        ]);
    }
}