<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dev_Maintain;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DevMaintainController extends Controller
{
     //Get data
    public function index()
    {
        $devmaintain = Dev_Maintain::all();
        // return response()->json($devmaintain, 200);
        return Inertia::render('Admin/Dev/DevMaintain', [
            'devMaintains' => $devmaintain,
        ]);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'icon'           =>  'required|string',
            'heading'        =>  'required|string|max:255',
            'description'    =>  'required|string|max:1000',
            'priority'       =>  'required|string|max:1000',
            'availability'   =>  'required|string|max:1000',
            'features'       =>  'required|array',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }
        //Create a new seo service
        $dev_maintain = Dev_Maintain::create([
           'icon'            => $request->icon,
           'heading'         => $request->heading,
           'description'     => $request->description,
           'priority'        => $request->priority,
           'availability'    => $request->availability,
           'features'        => $request->features,
        ]);

         return redirect()->route('dev-maintain.index')->with('success', 'Development maintain created successfully.');
    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $dev_maintain = Dev_Maintain::find($id);

        if (!$dev_maintain) {
            return response()->json(['message' => 'Development maintain not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'icon'              =>  'sometimes|required|string',
            'heading'           =>  'sometimes|required|string|max:255',
            'description'       =>  'sometimes|required|string|max:1000',
            'priority'          =>  'sometimes|required|string|max:1000',
            'availability'      =>  'sometimes|required|string|max:1000',
            'features'          =>  'sometimes|required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

         // Update fields
        $dev_maintain->update([
            'icon'          => $request->icon ?? $dev_maintain->icon,
            'heading'       => $request->heading ?? $dev_maintain->heading,
            'description'   => $request->description ?? $dev_maintain->description,
            'priority'   => $request->priority ?? $dev_maintain->priority,          
            'availability'   => $request->availability ?? $dev_maintain->availability,
            'features'   => $request->features ?? $dev_maintain->features,
        ]);

        return redirect()->route('dev-maintain.index')->with('success', 'Development maintain updated successfully.');
    }
    

     // Delete a project
    public function destroy($id)
    {
        $dev_maintain = Dev_Maintain::find($id);

        if (!$dev_maintain) 
            {
                return redirect()->route('dev-maintain.index')->with('error', 'Development maintain not found');
            }

        $dev_maintain->delete();

        return redirect()->route('dev-maintain.index')->with('success', 'Development maintain deleted successfully!');
    }
}
