<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service; //  Service model
use App\Models\SubService; // SubService model
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;



class ServiceController extends Controller
{
    // GET all
    public function index()
    {
    // Get all services with their subservices
        $services = Service::with('subservices')->get()->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'image' => asset('assets/images/' . $service->image), // Assuming image is stored in public/assets/images

                'subservices' => $service->subservices->map(function ($subService) {
                    return [
                        'id' => $subService->id,
                        'name' => $subService->name,
                        'description' => $subService->description,
                        'image' => asset('assets/images/subservices/' . $subService->image), // Assuming subservice images are stored in public/assets/images/subservices
                    ];
                }),
            ];
        });
        // return response()->json($services, 200);
        // Render the React component with services data
        return Inertia::render('Admin/Services/Services', [
            'services' => $services
        ]);
    }

    // POST
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'name' => 'required|string|max:255|unique:services,name',
            'description' => 'required|string|max:255|',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Handle image upload
        $imageName = null;
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('assets/images'), $imageName);
        }

        // Create new service record
        $service = Service::create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $imageName,
        ]);

        // return response()->json([
        //     'message' => 'Service added successfully.',
        //     'data' => $service,
        // ], 201);

        // Redirect back with success message
    return redirect()->route('services')->with('message', 'Service added successfully.');
    }

    //Update a service
    public function update(Request $request, $id)
    {
        // Validate request
        $request->validate([
            'name' => 'required|string|max:255|unique:services,name,' . $id,
            'description' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Find the service
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service not found.'], 404);
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('assets/images'), $imageName);
            $service->image = $imageName;
        }

        // Update service details
        $service->name = $request->name;
        $service->description = $request->description;
        $service->save();

        return response()->json([
            'message' => 'Service updated successfully.',
            'data' => $service,
        ], 200);
    }

    //Delete a service
    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found.'], 404);
        }

        // Soft delete the service
        $service->is_deleted = true; // Assuming you have an 'is_deleted' column for soft deletion
        $service->save();

        return response()->json(['message' => 'Service deleted successfully.'], 200);
    }

}
