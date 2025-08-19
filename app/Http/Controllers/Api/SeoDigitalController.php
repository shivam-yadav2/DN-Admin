<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seo_Digital;
use Illuminate\Support\Facades\Validator;

class SeoDigitalController extends Controller
{
     //Get data
    public function index()
    {
        $seo_digitals = Seo_Digital::all();
        return response()->json($seo_digitals, 200);
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
        $seo_digital = Seo_Digital::create([
           'icon'           => $request->icon,
           'heading'        => $request->heading,
           'description'    => $request->description,
        ]);

         return response()->json([
            'message' => 'Seo process created successfully.',
            'data' => $seo_digital,
         ], 201);
    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $seo_digital = Seo_Digital::find($id);

        if (!$seo_digital) {
            return response()->json(['message' => 'Seo digital not found'], 404);
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
        $seo_digital->update([
            'icon'        => $request->icon ?? $seo_digital->icon,
            'heading'     => $request->heading ?? $seo_digital->heading,
            'description' => $request->description ?? $seo_digital->description,
        ]);

        return response()->json([
            'message' => 'Seo process updated successfully.',
            'data' => $seo_digital,
        ], 200);
    }
    

     // Delete a project
    public function destroy($id)
    {
        $seo_digital = Seo_Digital::find($id);

        if (!$seo_digital) 
            {
                return response()->json([
                    'message' => 'Seo process not found',
                
                ], 404);
            }

        $seo_digital->delete();

        return response()->json ([
            'message' => 'Seo process deleted successfully!',
        ]);
    }
}
