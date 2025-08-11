<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service; //  Service model
use Inertia\Inertia;
use App\Models\SubService; // SubService model
// use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\GD\Driver as GdDriver;
use Illuminate\Support\Facades\Validator;

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
                'image' => asset('assets/images/services/' . $service->image), // Assuming image is stored in public/assets/images

                'subservices' => $service->subservices->map(function ($subService) {
                    return [
                        'id' => $subService->id,
                        'name' => $subService->name,
                        'description' => $subService->description,
                        'image' => asset('assets/images/subservices/' . $subService->image), 
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
        $validator = Validator($request->all(),[
            'name'          => 'required|string|max:255|unique:services,name',
            'description'   => 'required|string|max:255',
            'image'         => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
                return response()->json([
             'errors' => $validator->errors()->all()
            ], 422);
        }

        // Check if image file is present
        if (!$request->hasFile('image')) 
            {
                return response()->json(['message' => 'Image file is required'], 400);
            }

        // Initialize variable to hold the final image name
        $imageName = null; 

        // Process the uploaded file

        if($request->hasFile('image'))
            {
                $image = $request->file('image'); // Get the uploaded file
                $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

                $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

                $timestampName = time() . '.webp'; // Generate a unique filename

                $destinationPath = public_path('assets/images/services'); // Define storage path

                // Create directory if it doesn't exist
                if (!file_exists($destinationPath)) 
                    {
                        mkdir($destinationPath, 0755, true);
                    }

                if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) 
                    {
                        // Convert JPG/PNG/JPEG to WebP
                        $img = $manager->read($image->getRealPath())->toWebp(80); 
                        $img->save($destinationPath . '/' . $timestampName);
                        $imageName = $timestampName;
                    } 
                elseif ($originalExtension === 'webp') 
                    {
                        // Save WebP as-is
                        $image->move($destinationPath, $timestampName);
                        $imageName = $timestampName;
                    } 
                else 
                    {
                        // Return if unsupported format
                        return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
                    }
            }
       
         // Create new service record
        $service = Service::create([
            'name'          => $request->name,
            'description'   => $request->description,
            'image'         => $imageName,
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
       $validator = Validator($request->all(),[
            'name'          => 'nullable|string|max:255|unique:services,name,' . $id,
            'description'   => 'nullable|string|max:255',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        // Find the service
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service not found.'], 404);
        }

        // Process the uploaded file
        $imageName = $service->image; // Default to existing image

        if($request->hasFile('image'))
        {
            $image = $request->file('image'); // Get the uploaded file
            $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

            $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

            $timestampName = time() . '.webp'; // Generate a unique filename

            $destinationPath = public_path('assets/images/services'); // Define storage path

            // Create directory if it doesn't exist
            if (!file_exists($destinationPath)) 
            {
                mkdir($destinationPath, 0755, true);
            }

            if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) 
            {
                // Convert JPG/PNG to WebP
                $img = $manager->read($image->getRealPath())->toWebp(80); 
                $img->save($destinationPath . '/' . $timestampName);
                $imageName = $timestampName;
            } 
            elseif ($originalExtension === 'webp')
            {
                // Save WebP as-is
                $image->move($destinationPath, $timestampName);
                $imageName = $timestampName;
            }   
            else 
            {
                // Return if unsupported format
                return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
            }
        }
        

        // Update service details
        $service->name = $request->name ?? $service->name;
        $service->description = $request->description ?? $service->description;
        $service->image = $imageName ?? $service->image;
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
