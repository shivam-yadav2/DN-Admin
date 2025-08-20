<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seo_Process;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SeoProcessController extends Controller
{
     //Get data
    public function index()
    {
        $seo_processes = Seo_Process::all();
        return Inertia::render('Admin/SEO/SeoProcesses', [
            'seo_processes' => $seo_processes,
            'flash' => session('flash')
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
        $seo_process = Seo_Process::create([
           'icon'           => $request->icon,
           'heading'        => $request->heading,
           'description'    => $request->description,
        ]);

        //  return response()->json([
        //     'message' => 'Seo process created successfully.',
        //     'data' => $seo_process,
        //  ], 201);

         return redirect()->route('seo-processes.index')->with('message', 'Seo process created successfully');

    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $seo_process = Seo_Process::find($id);

        if (!$seo_process) {
            return response()->json(['message' => 'Seo Process not found'], 404);
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
        $seo_process->update([
            'icon'        => $request->icon ?? $seo_process->icon,
            'heading'     => $request->heading ?? $seo_process->heading,
            'description' => $request->description ?? $seo_process->description,
        ]);

        return redirect()->route('seo-processes.index')->with('message', 'Seo process updated successfully');

    }
    

     // Delete a project
    public function destroy($id)
    {
        $seo_process = Seo_Process::find($id);

        if (!$seo_process) 
            {
                return redirect()->route('seo-processes.index')->with('message', 'Seo process not found');
            }

        $seo_process->delete();

        return redirect()->route('seo-processes.index')->with('message', 'Seo process deleted successfully');
    }

}
