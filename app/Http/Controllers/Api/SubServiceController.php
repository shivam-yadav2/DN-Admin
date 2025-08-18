<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubService; // SubService model
use Inertia\Intertia;

class SubServiceController extends Controller
{
    // GET all 
    public function index()
    {
        $subServices = SubService::with('service')->where('is_deleted', 0)->get()->map(function ($subService) {
            return [
                'id' => $subService->id,
                'service_id' => $subService->service_id,
                'name' => $subService->name,
                'description' => $subService->description,
                'image' => asset('assets/images/subservices/' . $subService->image), // Assuming image is stored in public/assets/images/subservices
            ];
        });

        // return response()->json($subServices, 200);
        return Inertia::render('Admin/Services/Services', [
            'sub_services' => $subServices
        ]);
    }
    // POST
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Handle image upload
       
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('assets/images/subservices'), $imageName);
    

        // Create new subservice record
        $subService = SubService::create([
            'service_id' => $request->service_id,
            'name' => $request->name,
            'description' => $request->description,
            'image' => $imageName,
        ]);

        // return response()->json([
        //     'message' => 'SubService added successfully.',
        //     'data' => $subService,
        // ], 201);
        return redirect()->route('service.index')->with('message', 'subService added successfully.');
    }

    // Get all subservices by service ID
    public function getByServiceId($serviceId)
    {
        $subServices = SubService::where('service_id', $serviceId)->get()->map(function ($subService) {
            return [
                'id' => $subService->id,
                'service_id' => $subService->service_id,
                'name' => $subService->name,
                'description' => $subService->description,
                'image' => asset('assets/images/subservices/' . $subService->image), // Assuming image is stored in public/assets/images/subservices
            ];
        });

        return response()->json($subServices, 200);
    }

    //Delete a subservice
    public function destroy($id)
    {
        $subService = SubService::findOrFail($id);

        // Delete image from storage
        $imagePath = public_path('assets/images/subservices/' . $subService->image);
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        // Soft delete the subservice
        $subService->delete(); // Assuming you have an 'is_deleted' column for soft deletion
        // $subService->save();

        return redirect()->route('service.index')->with('message', 'SubService deleted successfully.');
    }
}
