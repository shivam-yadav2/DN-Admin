<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\vision_mission;
use Illuminate\Http\Request;

class vision_missioncontroller extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'heading' => 'required|max:255',
            'para' => 'required|unique:vision_mission,para|max:255',
            'vision_heading' => 'required |unique:vision_mission,vision_heading|max:255',
            'vision_description' => 'required |unique:vision_mission,vision_description|max:255',
            'mission_heading' => 'required |unique:vision_mission,mission_heading|max:255',
            'mission_description' => 'required |unique:vision_mission,mission_description|max:255',
        ]);
        $data = vision_mission::create([
            'heading' => $request->heading,
            'para' => $request->para,
            'vision_heading' => $request->vision_heading,
            'vision_description' => $request->vision_description,
            'mission_heading' => $request->mission_heading,
            'mission_description' => $request->mission_description,

        ]);
        return response()->json([
            'message' => 'Product added successfully.',
            'data' => $data
        ]);
    }


    public function show()
    {
        $info = vision_mission::all();
        if ($info) {
            return response()->json(['info' => $info], 200);
        }
        return response()->json(['msg' => 'data not found'], 404);
    }

    public function updatevision(Request $request, $id)
    {
        $data = vision_mission::find($id);

        if (!$data) {
            return response()->json(['msg' => 'Data not found'], 404);
        }


        $request->validate([
            'heading' => 'required',
            'para' => 'required',
            'vision_heading' => 'required',
            'vision_description' => 'required',
            'mission_heading' => 'required',
            'mission_description' => 'required',
        ]);


        $data->update([
            'heading' => $request->heading,
            'para' => $request->para,
            'vision_heading' => $request->vision_heading,
            'vision_description' => $request->vision_description,
            'mission_heading' => $request->mission_heading,
            'mission_description' => $request->mission_description,
        ]);

  
        return response()->json([
            'msg' => "Data updated successfully",
            'data' => $data
        ]);
    }

       public function deletevision($id){
           $info= vision_mission::find($id);
             if(!$info){
                return response()->json([
                    'msg'=>'Data not found',
                ],404);
             }

             $info->delete();
             return response()->json([
                'msg'=>'Data deleted Successfully',
             ]);
       }


      


}
