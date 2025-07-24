<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\packages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image;

class packagecontroller extends Controller
{
    public function insert_package(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'heading' => 'required',
            'img' => 'required|image|mimes:jpeg,jpg,png|max:2048|dimensions:max_width:200,max_height:200',
            'price' => 'required',
            'description' => 'required',
            'target_audience' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'mesg' => "Validation failed",
                'error' => $validator->errors()->all(),
            ], 422);
        }

        $imagename = null;

        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imagename = time() . '.webp'; // force convert to webp
            $path = public_path('assets/images/package/' . $imagename);

            // Resize and convert to webp
            $resizedImage = Image::make($image)
                ->fit(200, 200)
                ->encode('webp', 90);

            $resizedImage->save($path);
            
            $data = packages::create([
                'img' => $imagename,
                'heading' => $request->heading,
                'price' => $request->price,
                'description' => $request->description,
                'target_audience' => $request->target_audience,

            ]);
            return response()->json([
                'mesg' => 'Data added successfully',
                'data' => $data,
            ]);
        }
    }

     public function update_package(Request $request,$id)
     {
        $validator = Validator::make($request->all(), [
            'heading' => 'required',
            'img' => 'required|image|mimes:jpeg,jpg,png|max:2048|dimensions:max_width:200,max_height:200',
            'price' => 'required',
            'description' => 'required',
            'target_audience' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'mesg' => "Validation failed",
                'error' => $validator->errors()->all(),
            ], 422);
        }

        $info=packages::find($id);

        $imagename = null;

        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imagename = time() . '.webp'; // force convert to webp
            $path = public_path('assets/images/package/' . $imagename);

            // Resize and convert to webp
            $resizedImage = Image::make($image)
                ->fit(200, 200)
                ->encode('webp', 90);

            $resizedImage->save($path);
           $data= $info->update([
                'img' => $imagename,
                'heading' => $request->heading,
                'price' => $request->price,
                'description' => $request->description,
                'target_audience' => $request->target_audience,
            ]);
            return response()->json([
                'mesg' => 'Data updated successfully',
                'data' => $data,
            ]);
        }
}
 
 public function show_package(){
    $show=packages::all();
    if($show){
        return response()->json([
            'mesg'=>$show,
        ],200);
    }
    else{
        return response()->json([
            'mesg'=>'Data not found',
        ],404);
    }
 }

  public function delete($id){
    $del=packages::find($id);
    if(!$del){
        return response()->json([
            'mesg'=>'Data not found',
        ],404);
    }
  $del->delete();
  return response()->json([
    'mesg'=>'Data deleted successfully',

  ]);
}

}
