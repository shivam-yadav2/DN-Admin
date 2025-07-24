<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\our_team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image;

class our_teamcontroller extends Controller
{
    public function insert(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'designation' => 'required|string',
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048',
            'joining_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $imagename = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagename = time() . '.webp'; // force .webp output
            $path = public_path('assets/images/our_team/' . $imagename);

            // ✅ Resize to 500x500 and convert to webp
            Image::make($image)
                ->fit(500, 500)              // Ensures image is 500x500
                ->encode('webp', 90)         // Converts to webp with 90% quality
                ->save($path);               // Save to path
        }

        $data = our_team::create([
            'name' => $request->name,
            'designation' => $request->designation,
            'img' => $imagename,
            'joining_date' => $request->joining_date,
        ]);

        return response()->json([
            'msg' => 'Data added successfully',
            'data' => $data,
        ]);
    }


    public function delete_ourteam($id)
    {
        $info = our_team::find($id);
        if (!$info) {
            return response()->json(
                [
                    'data' => 'Data not found',
                ],
                404
            );
        }
        // Path to the image file
//        $imagePath = public_path('assets/images/our_team/' . $info->img);

        //    if (file_exists($imagePath)) {
//       unlink($imagePath); //delete file
//   }

        $info->delete();
        return response()->json([
            'data' => "Data Deleted Successfully",
        ]);

    }

    public function update_ourteam(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'designation' => 'required|string',
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048|dimensions:max_width:500, max_height:500',
            'joining_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $imagename = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagename = time() . '.webp'; // force convert to webp
            $path = public_path('assets/images/our_team/' . $imagename);

            // Resize and convert to webp
            $resizedImage = Image::make($image)
                ->fit(500, 500)
                ->encode('webp', 90);

            $resizedImage->save($path);
        }

        $user = our_team::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Team member not found.',
            ], 404);
        }

        $user->update([
            'name' => $request->name,
            'designation' => $request->designation,
            'img' => $imagename ?? $user->img,
            'joining_date' => $request->joining_date,
        ]);

        return response()->json([
            'msg' => 'Data updated successfully',
            'data' => $user,
        ]);
    }


    public function show_ourteam()
    {
        $data = our_team::all();
        if ($data) {
            return response()->json([
                'msg' => $data,
            ], 200);
        } else {
            return response()->json([
                'msg' => 'Data not found',
            ], 404);
        }
    }
    

}
