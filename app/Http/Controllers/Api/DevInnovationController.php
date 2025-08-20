<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dev_Innovation;
use Illuminate\Support\Facades\Validator;

class DevInnovationController extends Controller
{
      //Get data
    public function index()
    {
        $dev_innovations = Dev_Innovation::all();
        return response()->json($dev_innovations, 200);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'icon'          =>  'required|string',
            'heading'       =>  'required|string|max:255',
            'sub_heading'   =>  'required|string|max:255',
            'description'   =>  'required|string|max:1000',
            'features'      =>  'required|array',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }
        //Create a new seo service
        $dev_innovation = Dev_Innovation::create([
           'icon'           => $request->icon,
           'heading'        => $request->heading,
           'sub_heading'    => $request->sub_heading,
           'description'    => $request->description,
           'features'       => $request->features,
        ]);

         return response()->json([
            'message' => 'Development innovation created successfully.',
            'data' => $dev_innovation,
         ], 201);
    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $dev_innovation = Dev_Innovation::find($id);

        if (!$dev_innovation) {
            return response()->json(['message' => 'Development innovation not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'icon'              =>  'sometimes|required|string',
            'heading'           =>  'sometimes|required|string|max:255',
            'sub_heading'       =>  'sometimes|required|string|max:255',
            'description'       =>  'sometimes|required|string|max:1000',
            'features'          =>  'sometimes|required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

         // Update fields
        $dev_innovation->update([
            'icon'          => $request->icon ?? $dev_innovation->icon,
            'heading'       => $request->heading ?? $dev_innovation->heading,
            'sub_heading'   => $request->sub_heading ?? $dev_innovation->heading,
            'description'   => $request->description ?? $dev_innovation->description,
        ]);

        return response()->json([
            'message' => 'Development innovation updated successfully.',
            'data' => $dev_innovation,
        ], 200);
    }
    

     // Delete a project
    public function destroy($id)
    {
        $dev_innovation = Dev_Innovation::find($id);

        if (!$dev_innovation) 
            {
                return response()->json([
                    'message' => 'Development innovation not found',
                
                ], 404);
            }

        $dev_innovation->delete();

        return response()->json ([
            'message' => 'Development innovation deleted successfully!',
        ]);
    }
}
