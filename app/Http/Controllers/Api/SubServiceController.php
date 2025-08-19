<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubService; // SubService model
use Inertia\Intertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(),[
            'service_id'        => 'required|exists:services,id',
            'name'              => 'required|string|max:255',
            'description'       => 'required|string|max:255',
            'image'             => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
                return response()->json([
             'errors' => $validator->errors()->all()
            ], 422);
        }

        // Handle image upload
        //  $imageName = time() . '.' . $request->image->extension();
        //     $request->image->move(public_path('assets/images/subservices'), $imageName);
    
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
                $destinationPath = 'assets/images/subservices'; // Define storage path

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
                // elseif ($originalExtension === 'webp') 
                //     {
                //         // Save WebP as-is
                //         $image->move($destinationPath, $imageName);
                //         // $imageName = $timestampName;
                //     } 
                else 
                    {
                        // Return if unsupported format
                        return response()->json(['message' => 'Only JPG, JPEG, PNG, or WEBP formats allowed.'], 400);
                    }
                
                     // Save relative path in DB
                $imageName = 'assets/images/subservices/' . $imageName;
            }
        // Create new subservice record
        $subService = SubService::create([
            'service_id'        => $request->service_id,
            'name'              => $request->name,
            'description'       => $request->description,
            'image'             => $imageName,
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
                'id'            => $subService->id,
                'service_id'    => $subService->service_id,
                'name'          => $subService->name,
                'description'   => $subService->description,
                'image'          => asset('assets/images/subservices/' . $subService->image), // Assuming image is stored in public/assets/images/subservices
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
