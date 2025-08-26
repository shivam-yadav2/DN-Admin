<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Package_Feature;
use Illuminate\Support\Facades\Validator;

class PackageFeatureController extends Controller
{
    // List all features
    public function index()
    {
       $features = Package_Feature::with('package')->get();
        return response()->json([
            'success' => true,
            'data' => $features
        ], 200);
    }

    // Create a new feature
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_id'    => 'required|exists:packages,id',
              'features' => 'required|array',
           'features.*.key'   => 'required|string|max:255',
             'features.*.value' => 'required|string|max:255',
        ]);

         if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }

        // $feature = Package_Feature::create([
        //     'package_id'     => $request->package_id,
        //     'feature_key'   => $request->feature_key,
        //     'feature_value' => $request->feature_value,
        // ]);
         $inserted = [];
        foreach ($request->features as $feature)
             {
                $inserted[] = Package_Feature::create([
                'package_id' => $request->package_id,
                'feature_key' => $feature['key'],
                'feature_value' => $feature['value'],
                ]);
            }

        // return response()->json([
        //     'message' => 'Features created successfully',
        //     'data' => $inserted
        // ], 201);
                return redirect()->route('packages.index')->with('message', 'Package Features added successfully');

    }

     // Show single feature
    public function show($id)
    {
        $feature = Package_Feature::with('package')->findOrFail($id);
        return response()->json($feature, 200);
    }

    // Update a feature
    public function update(Request $request, $id)
    {
          $package = Package_Feature::findOrFail($id);

        $validator = Validator::make($request->all(),[
            'package_id'    => 'sometimes|exists:packages,id',
            'feature_key'   => 'sometimes|string',
            'feature_value' => 'sometimes|string',
        ]);

         if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $package->update([
            'package_id'    => $request->package_id ?? $package->package_id,
            'feature_key'   => $request->feature_key ?? $package->feature_key,
            'feature_value' => $request->feature_value ?? $package->feature_value,
        ]);

        // return response()->json([
        //     'message' => 'Feature updated successfully',
        //     'data' => $package
        // ], 200);
                return redirect()->route('packages.index')->with('message', 'Package Features updated successfully');

    }

    // Delete a feature
    public function destroy($id)
    {
        $feature = Package_Feature::findOrFail($id);
        $feature->delete();

        // return response()->json([
        //     'message' => 'Feature deleted successfully'
        // ], 200);
                return redirect()->route('packages.index')->with('message', 'Package Feature deleted successfully');
    }
}
