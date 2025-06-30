<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service; // Assuming you have a Service model


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
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Save image to public/assets/images
        $imageName = null;
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('assets/images'), $imageName);
        }

        // Save data
        Service::create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $imageName,
        ]);

        return response()->json('Service added', 200);
    }
}
