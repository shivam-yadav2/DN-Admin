<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seo_Optimization;
use Illuminate\Support\Facades\Validator;

class SeoOptimizationController extends Controller
{
     //Get data
    public function index()
    {
        $seo_optimizations = Seo_Optimization::all();
        return response()->json($seo_optimizations, 200);
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
        $seo_optimization = Seo_Optimization::create([
           'icon'           => $request->icon,
           'heading'        => $request->heading,
           'description'    => $request->description,
        ]);

         return response()->json([
            'message' => 'Seo optimization created successfully.',
            'data' => $seo_optimization,
         ], 201);
    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $seo_optimization = Seo_Optimization::find($id);

        if (!$seo_optimization) {
            return response()->json(['message' => 'Seo optimization not found'], 404);
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
        $seo_optimization->update([
            'icon'        => $request->icon ?? $seo_optimization->icon,
            'heading'     => $request->heading ?? $seo_optimization->heading,
            'description' => $request->description ?? $seo_optimization->description,
        ]);

        return response()->json([
            'message' => 'Seo optimization updated successfully.',
            'data' => $seo_optimization,
        ], 200);
    }
    

     // Delete a project
    public function destroy($id)
    {
        $seo_optimization = Seo_Optimization::find($id);

        if (!$seo_optimization) 
            {
                return response()->json([
                    'message' => 'Seo optimization not found',
                
                ], 404);
            }

        $seo_optimization->delete();

        return response()->json ([
            'message' => 'Seo optimization deleted successfully!',
        ]);
    }
}
