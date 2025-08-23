<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dev_Cornerstone;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
class DevCornerstoneController extends Controller
{
        //Get data
    public function index()
    {
        $dev_cornerstones = Dev_Cornerstone::all();
        // return response()->json($dev_cornerstones, 200);
        return Inertia::render('Admin/Dev/DevCornerstone', [
            'devCornerstones' => $dev_cornerstones,
        ]);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'icon'         =>  'required|string',
            'heading'       => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }
        //Create a new seo service
        $dev_cornerstone = Dev_Cornerstone::create([
           'icon'           => $request->icon,
           'heading'        => $request->heading,
           'description'    => $request->description,
        ]);

         return redirect()->route('dev-cornerstone.index')->with('success', 'Development cornerstones created successfully.');
    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $dev_cornerstone = Dev_Cornerstone::find($id);

        if (!$dev_cornerstone) {
            return response()->json(['message' => 'Development cornerstone not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'icon'         =>  'required|string',
            'heading'       => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

         // Update fields
        $dev_cornerstone->update([
            'icon'        => $request->icon ?? $dev_cornerstone->icon,
            'heading'     => $request->heading ?? $dev_cornerstone->heading,
            'description' => $request->description ?? $dev_cornerstone->description,
        ]);

        return redirect()->route('dev-cornerstone.index')->with('success', 'Development cornerstone updated successfully.');
    }
    

     // Delete a project
    public function destroy($id)
    {
        $dev_cornerstone = Dev_Cornerstone::find($id);

        if (!$dev_cornerstone) 
            {
                return redirect()->route('dev-cornerstone.index')->with('error', 'Development cornerstones not found');
            }

        $dev_cornerstone->delete();

        return redirect()->route('dev-cornerstone.index')->with('success', 'Development cornerstone deleted successfully!');
    }
}
