<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\vision_mission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class vision_missioncontroller extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'heading' => 'required|max:255',
            'para' => 'required|unique:vision_mission,para|max:255',
            'vision_heading' => 'required |unique:vision_mission,vision_heading|max:255',
            'vision_description' => 'required |unique:vision_mission,vision_description|max:255',
            'mission_heading' => 'required |unique:vision_mission,mission_heading|max:255',
            'mission_description' => 'required |unique:vision_mission,mission_description|max:255',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $data = vision_mission::create([
            'heading' => $request->heading,
            'para' => $request->para,
            'vision_heading' => $request->vision_heading,
            'vision_description' => $request->vision_description,
            'mission_heading' => $request->mission_heading,
            'mission_description' => $request->mission_description,

        ]);

        // return response()->json([
        //     'message' => 'Product added successfully.',
        //     'data' => $data
        // ]);
        return redirect()->route('vision-mission.index')->with('message', 'Vision/Mission added successfully');
    }


    public function index()
    {
        $visions = vision_mission::all();
        return Inertia::render('Admin/HomePage/VisionMissionPage', [
            'visions' => $visions->map(function ($vision) {
                return [
                    'id' => $vision->id,
                    'heading' => $vision->heading,
                    'para' => $vision->para,
                    'vision_heading' => $vision->vision_heading,
                    'vision_description' => $vision->vision_description,
                    'mission_heading' => $vision->mission_heading,
                    'mission_description' => $vision->mission_description,
                    'created_at' => $vision->created_at,
                ];
            }),
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = vision_mission::find($id);

        if (!$data) {
            return response()->json(['msg' => 'Data not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'heading' => 'required',
            'para' => 'required',
            'vision_heading' => 'required',
            'vision_description' => 'required',
            'mission_heading' => 'required',
            'mission_description' => 'required',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $data->update([
            'heading' => $request->heading,
            'para' => $request->para,
            'vision_heading' => $request->vision_heading,
            'vision_description' => $request->vision_description,
            'mission_heading' => $request->mission_heading,
            'mission_description' => $request->mission_description,
        ]);

  
        // return response()->json([
        //     'msg' => "Data updated successfully",
        //     'data' => $data
        // ]);
        return redirect()->route('vision-mission.index')->with('message', 'Vision/Mission Updated successfully');

    }

       public function destroy($id){
           $info= vision_mission::find($id);
             if(!$info){
                return response()->json([
                    'msg'=>'Data not found',
                ],404);
             }

             $info->delete();
            //  return response()->json([
            //     'msg'=>'Data deleted Successfully',
            //  ]);
        return redirect()->route('vision-mission.index')->with('message', 'Vision/Mission Deleted successfully');

       }


      


}
