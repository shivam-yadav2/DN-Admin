<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\vision_mission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class vision_missioncontroller extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'heading' => 'required|max:255',
            'para' => 'required|unique:vision_mission,para|max:255',
            'subheading' => 'required |unique:vision_mission,subheading|max:255',
            'subpara' => 'required |unique:vision_mission,subpara|max:255',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $data = vision_mission::create([
            'heading' => $request->heading,
            'para' => $request->para,
            'subheading' => $request->subheading,
            'subpara' => $request->subpara,

        ]);

        return response()->json([
            'message' => 'Product added successfully.',
            'data' => $data
        ]);
    }


    public function show()
    {
        $info = vision_mission::all();
        if ($info) 
            {
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


        $validator = Validator::make($request->all(), [
            'heading' => 'required',
            'para' => 'required',
            'subheading' => 'required',
            'subpara' => 'required',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $data->update([
            'heading' => $request->heading,
            'para' => $request->para,
            'subheading' => $request->subheading,
            'subpara' => $request->subpara,
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
