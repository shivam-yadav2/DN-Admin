<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Package;
use App\Models\Package_Feature;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
class PackageController extends Controller
{
    // Get all packages with features
    public function index()
    {
        $packages = Package::with('features')->get();
        // return response()->json($packages, 200);
        return Inertia::render('Admin/Other/Package', [
            'packages' => $packages,
            'packageTypes' => ['SEO', 'SMM', 'SMP', 'Google_Ads', 'Development', 'Design']
        ]);
    }

    // Store a new package with features
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'icon'                 => 'required|string',
            'package_for'          =>  'required|in:SEO,SMM,SMP,Google_Ads,Development,Design',
            'package_name'         => 'required|string',
            'price'                => 'required|string',
            'description'          => 'required|string',
            'label'                => 'required|string',
            'audience'             => 'required|string',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }

        // Create package
        $package = Package::create([
            'icon'              => $request->icon,
            'package_for'       => $request->package_for,
            'package_name'      => $request->package_name,
            'price'             => $request->price,
            'description'       => $request->description,
            'label'             => $request->label,
            'audience'          => $request->audience,
        ]);


        // return response()->json([
        //     'message' => 'Package created successfully',
        //     'data' =>   $package,
        // ], 201);
        return redirect()->route('packages.index')->with('message', 'Package added successfully');
    }

    // Show packages by ID or package_for
    public function show($identifier)
    {
        // Treat as package_for name (like SEO, SMM, etc.)
        $packages = Package::with('features')->where('package_for', $identifier)->get();

        if ($packages->isEmpty()) {
            return response()->json([
                'message' => 'No package found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Packages fetched successfully',
            'data' => $packages
        ], 200);
    }


    // Update package and features
    public function update(Request $request, $id)
    {
         $package = Package::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'icon'              => 'sometimes|string',
            'package_for'      =>  'sometimes|in:SEO,SMM,SMO,Google_Ads,Development,Design',
            'package_name'      => 'sometimes|string',
            'price'             => 'sometimes|string',
            'description'       => 'sometimes|string',
            'label'             => 'sometimes|string',
            'audience'          => 'sometimes|string',
        ]);

        $package->update([
             'icon'              => $request->icon ?? $package->icon,
            'package_for'       => $request->package_for ?? $package->package_for,
            'package_name'      => $request->package_name ?? $package->package_name,
            'price'             => $request->price ?? $package->price,
            'description'       => $request->description ?? $package->description,
            'label'             => $request->label ?? $package->label,
            'audience'          => $request->audience ?? $package->audience,
        ]);

        // return response()->json([
        //     'message' => 'Package updated successfully',
        //     'data' => $package
        // ], 200);
        return redirect()->route('packages.index')->with('message', 'Package updated successfully');

    }

    // Delete package with features
    public function destroy($id)
    {
        $package = Package::findOrFail($id);
        $package->delete();

        // return response()->json([
        //     'message' => 'Package deleted successfully'
        // ], 200);
                return redirect()->route('packages.index')->with('message', 'Package deleted successfully');

    }

}
