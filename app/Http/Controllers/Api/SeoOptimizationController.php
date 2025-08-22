<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seo_Optimization;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SeoOptimizationController extends Controller
{
     //Get data
    public function index()
    {
        $seo_optimizations = Seo_Optimization::all();
        // return response()->json($seo_optimizations, 200);
        return Inertia::render('Admin/SEO/SeoOptimization', [
            'seoOptimizations' => $seo_optimizations,
        ]);
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

         return redirect()->route('seo-optimization.index')->with('success', 'Seo optimization created successfully.');
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

        return redirect()->route('seo-optimization.index')->with('success', 'Seo optimization updated successfully.');
    }
    

     // Delete a project
    public function destroy($id)
    {
        $seo_optimization = Seo_Optimization::find($id);

        if (!$seo_optimization) 
            {
                return redirect()->route('seo-optimization.index')->with('error', 'Seo optimization not found');
            }

        $seo_optimization->delete();

        return redirect()->route('seo-optimization.index')->with('success', 'Seo optimization deleted successfully!');
    }
}
