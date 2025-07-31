<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Career;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CareerController extends Controller
{
    // Display the careers page with existing entries
    public function index()
    {
        $careers = Career::all();
        return Inertia::render('Admin/Other/Career', [
            'careers' => $careers->map(function ($career) {
                return [
                    'id' => $career->id,
                    'desig' => $career->desig,
                    'title' => $career->title,
                    'city' => $career->city,
                    'job_type' => $career->job_type,
                    'work_mode' => $career->work_mode,
                    'about_role' => $career->about_role,
                    'responsibilities' => $career->responsibilities,
                    'requirements' => $career->requirements,
                    'benefits_perks' => $career->benefits_perks,
                    'created_at' => $career->created_at,
                ];
            }),
        ]);
    }

    //Store
    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'desig' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'about_role' => 'required|string|max:255',
            'responsibilities' => 'required|array',
            'requirements' => 'required|array',
            'benefits_perks' => 'required|array',
        ]);

         if ($validate->fails()) {
                return response()->json([
                'errors' => $validate->errors()->all()
            ], 422);
        }

         // Create a new Career record
        $career = Career::create([
            'desig'             => $request->desig,
            'title'             => $request->title,
            'city'              => $request->city,
            'job_type'          => $request->job_type ?? 'part-time',
            'work_mode'         => $request->work_mode ?? 'onsite',
            'about_role'        => $request->about_role,
            'responsibilities'  => $request->responsibilities,
            'requirements'      => $request->requirements,
            'benefits_perks'    => $request->benefits_perks,
        ]);

        // return response()->json([
        //     'message' => 'Career created successfully.',
        //     'data' => $career,
        // ], 201);
        return redirect()->route('career.index')->with('message', 'Career added successfully');
    }


    //Update
   public function update(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'desig' => 'required|string|max:255',
        'title' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'about_role' => 'required|string|max:255',
        'responsibilities' => 'required|array',
        'requirements' => 'required|array',
        'benefits_perks' => 'required|array',
    ]);

     if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

    $career = Career::findOrFail($id);

    $career->update([
        'desig'             => $request->desig ?? $career->desig,
        'title'              => $request->title ?? $career->title,
        'city'                  => $request->city ?? $career->city,
        'job_type'              => $request->job_type ?? 'part-time' ?? $career->job_type,
        'work_mode' => $request->work_mode ?? 'onsite' ?? $career->work_mode,
        'about_role' => $request->about_role ?? $career->about_role,
        'responsibilities' => $request->responsibilities ?? $career->responsibilities,
        'requirements' => $request->requirements,
        'benefits_perks' => $request->benefits_perks,
    ]);

    // return response()->json([
    //     'message' => 'Career updated successfully.',
    //     'data' => $career,
    // ], 200);
    return redirect()->route('career.index')->with('message', 'Career updated successfully');
}

//Delete 
    public function destroy($id)
    {
         $career = Career::findOrFail($id);
        $career->delete();
        // return response()->json(['message' => 'Record deleted successfully']);
         return redirect()->route('career.index')->with('message', 'Career deleted successfully');
    }

}
