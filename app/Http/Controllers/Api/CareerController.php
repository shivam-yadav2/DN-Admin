<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Career;

class CareerController extends Controller
{
    //Get all data
    public function index()
    {
        $careers = Career::all();
        return response()->json($careers,200);
    }

    //Store
    public function store(Request $request)
    {
        $request->validate([
            'desig' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'about_role' => 'required|string|max:255',
            'responsibilities' => 'required|array',
            'requirements' => 'required|array',
            'benefits_perks' => 'required|array',
        ]);

         // Create a new Career record
        $career = Career::create([
            'desig' => $request->desig,
            'title' => $request->title,
            'city' => $request->city,
            'job_type' => $request->job_type ?? 'part-time',
            'work_mode' => $request->work_mode ?? 'onsite',
            'about_role' => $request->about_role,
            'responsibilities' => $request->responsibilities,
            'requirements' => $request->requirements,
            'benefits_perks' => $request->benefits_perks,
        ]);

        return response()->json([
            'message' => 'Career created successfully.',
            'data' => $career,
        ], 201);
    }


    //Update
   public function update(Request $request, $id)
{
    $request->validate([
        'desig' => 'required|string|max:255',
        'title' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'about_role' => 'required|string|max:255',
        'responsibilities' => 'required|array',
        'requirements' => 'required|array',
        'benefits_perks' => 'required|array',
    ]);

    $career = Career::findOrFail($id);

    $career->update([
        'desig' => $request->desig,
        'title' => $request->title,
        'city' => $request->city,
        'job_type' => $request->job_type ?? 'part-time',
        'work_mode' => $request->work_mode ?? 'onsite',
        'about_role' => $request->about_role,
        'responsibilities' => $request->responsibilities,
        'requirements' => $request->requirements,
        'benefits_perks' => $request->benefits_perks,
    ]);

    return response()->json([
        'message' => 'Career updated successfully.',
        'data' => $career,
    ], 200);
}

//Delete 
    public function destroy($id)
    {
         $career = Career::findOrFail($id);
        $career->delete();
        return response()->json(['message' => 'Record deleted successfully']);
    }

}
