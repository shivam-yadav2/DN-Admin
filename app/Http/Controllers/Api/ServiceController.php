<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service; //  Service model
use Inertia\Inertia;
use App\Models\SubService; // SubService model
// use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
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
                'image' => $service->image, // Assuming image is stored in public/assets/images

                'subservices' => $service->subservices->map(function ($subService) {
                    return [
                        'id' => $subService->id,
                        'name' => $subService->name,
                        'description' => $subService->description,
                        'image' => $subService->image, 
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
        $validator = Validator::make($request->all(),[
            'name'          => 'required|string|max:255|unique:services,name',
            'description'   => 'required|string',
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

                // Assign filename properly
                $imageName = time() . '.webp'; // Generate a unique filename
                $destinationPath = 'assets/images/services'; // Define storage path

                // Create directory if it doesn't exist
                if (!file_exists($destinationPath)) 
                    {
                        mkdir($destinationPath, 0755, true);
                    }

                if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) 
                    {
                        // Convert JPG/PNG/JPEG to WebP
                        $img = $manager->read($image->getRealPath())->toWebp(80); 
                        $img->save($destinationPath . '/' . $imageName);
                        // $imageName = $timestampName;
                    } 
                elseif ($originalExtension === 'webp') 
                    {
                        // Save WebP as-is
                        $image->move($destinationPath, $imageName);
                        // $imageName = $timestampName;
                    } 
                else 
                    {
                        // Return if unsupported format
                        return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
                    }
                
                     // Save relative path in DB
                $imageName = 'assets/images/services/' . $imageName;
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
        return redirect()->route('service.index')->with('message', 'Service added successfully.');
    }

    //Update a service
    public function update(Request $request, $id)
    {
         // Find the service
        $service = Service::find($id);
         if (!$service) {
            return response()->json(['message' => 'Service not found.'], 404);
        }

        // Validate request
       $validator = Validator($request->all(),[
            'name'          => 'sometimes|required|string|max:255|unique:services,name,' . $id,
            'description'   => 'sometimes|required|string|max:255',
            'image'         => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        // Process the uploaded file
        $imageName = $service->image; // Default to existing image

        if($request->hasFile('image'))
        {
             if ($service->image && file_exists(public_path($service->image))) 
                {
                    unlink(public_path($service->image));
                }

            $image = $request->file('image'); // Get the uploaded file
            $originalExtension = strtolower($image->getClientOriginalExtension()); // Get and lowercase the original extension

            $manager = new ImageManager(new GdDriver()); // Create Intervention Image manager instance

            $timestampName = time() . '.webp'; // Generate a unique filename

            $destinationPath = 'assets/images/services'; // Define storage path

            // Create directory if it doesn't exist
            if (!file_exists(public_path($destinationPath))) 
            {
                mkdir($destinationPath, 0755, true);
            }

            if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) 
            {
                // Convert JPG/PNG to WebP
                $img = $manager->read($image->getRealPath())->toWebp(80); 
                $img->save(public_path($destinationPath . '/' . $timestampName));
                // $imageName = $timestampName;
            } 
            elseif ($originalExtension === 'webp')
            {
                // Save WebP as-is
                $image->move(public_path($destinationPath, $timestampName));
                // $imageName = $timestampName;
            }   
            else 
            {
                // Return if unsupported format
                return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
            }

              // Save relative path in DB
                $imageName = 'assets/images/services/' . $timestampName;
        }
        

        // Update service details
        $service->name = $request->name ?? $service->name;
        $service->description = $request->description ?? $service->description;
        $service->image = $imageName ?? $service->image;
        $service->save();

        return redirect()->route('service.index')->with('message', 'Service updated successfully.');
    }

    //Delete a service
    public function destroy($id)
    {
        $service = Service::findOrFail($id);

        // Delete image from storage
        $imagePath = public_path('assets/images/services/' . $service->image);
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        // Delete service
        $service->delete();

        return redirect()->route('service.index')->with('message', 'Service deleted successfully.');
    }

}
