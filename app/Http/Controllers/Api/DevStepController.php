<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dev_Step;
use Illuminate\Support\Facades\Validator;

class DevStepController extends Controller
{
      //Get data
    public function index()
    {
        $dev_steps = Dev_Step::all();
        return response()->json($dev_steps, 200);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'icon'         =>  'required|string',
            'heading'       => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }
        //Create a new seo service
        $dev_step = Dev_Step::create([
           'icon'           => $request->icon,
           'heading'        => $request->heading,
           'description'    => $request->description,
        ]);

         return response()->json([
            'message' => 'Development steps created successfully.',
            'data' => $dev_step,
         ], 201);
    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $dev_step = Dev_Step::find($id);

        if (!$dev_step) {
            return response()->json(['message' => 'Development not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'icon'         =>  'required|string',
            'heading'       => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

         // Update fields
        $dev_step->update([
            'icon'        => $request->icon ?? $dev_step->icon,
            'heading'     => $request->heading ?? $dev_step->heading,
            'description' => $request->description ?? $dev_step->description,
        ]);

        return response()->json([
            'message' => 'Development steps updated successfully.',
            'data' => $dev_step,
        ], 200);
    }
    

     // Delete a project
    public function destroy($id)
    {
        $dev_step = Dev_Step::find($id);

        if (!$dev_step) 
            {
                return response()->json([
                    'message' => 'Development step not found',
                
                ], 404);
            }

        $dev_step->delete();

        return response()->json ([
            'message' => 'Development step deleted successfully!',
        ]);
    }
}
