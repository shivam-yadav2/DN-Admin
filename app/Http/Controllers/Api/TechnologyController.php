<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\technology;

class TechnologyController extends Controller
{
    public function addtech(Request $request)
    {
        $request->validate([
            'img' => 'required |image|mimes:webp|max:500',
            'heading' => 'required',
        ]);

        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imgname = $image->getClientOriginalName();
            $image->move('assets/image/technology', $imgname);
            // $data->img=$imgname;
        }

        $data = technology::create([
            'img' => $imgname,
            'heading' => $request->heading,
        ]);

        return response()->json([
            'msg' => 'Data added successfully',
            'data' => $data,
        ]);
    }


    public function deletetech($id)
    {
        $info = technology::find($id);
        if (!$info) {
            return response()->json(
                [
                    'data' => "data not found"
                ],
                404
            );
        }
        $info->delete();
        return response()->json([
            'data' => "data deleted successfully",
        ], 200);
    }


    public function updatetech(Request $request, $id)
    {
        $data = technology::find($id);
        
        if (!$data) {
            return response()->json([
                'msg' => 'Data not found',
            ], 404);
        }
    
        $request->validate([
            'heading' => 'required',
            'img' => 'nullable|image|mimes:webp|max:500',
        ]);
    
        $updateData = [
            'heading' => $request->heading,
        ];
    
    
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imgname = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('assets/image/technology'), $imgname);
            $updateData['img'] = $imgname;
        }
    
        $data->update($updateData);
    
        return response()->json([
            'msg' => 'Data updated successfully',
            'data' => $data,
        ]);
    }
    
    }

