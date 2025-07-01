<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service; //  Service model


class ServiceController extends Controller
{
    
    // GET all
    public function index()
    {
       $services = Service::all()->map(function ($service){
            return [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'image' => asset('assets/images/' . $service->image), // Assuming image is stored in public/assets/images
            ];
        });

        return response()->json($services, 200);
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

        return response()->json([
            'message' => 'Service added successfully.',
            'data' => $service,
        ], 201);
    }

}
