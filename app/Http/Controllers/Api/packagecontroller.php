<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\packages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;

class packagecontroller extends Controller
{
    protected $imageManager;

    public function __construct()
    {
        // ✅ Initialize ImageManager with GD driver
        $this->imageManager = new ImageManager(new Driver());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'heading' => 'required',
            'img' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048|dimensions:max_width:200,max_height:200',
            'price' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'target_audience' => 'required|string|max:255',
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

            // ✅ v3: Resize and convert to webp
            $this->imageManager->read($image)
                ->cover(200, 200)   // replaces fit() in v3
                ->toWebp(90)
                ->save($path);

            $data = packages::create([
                'img' => $imagename,
                'heading' => $request->heading,
                'price' => $request->price,
                'description' => $request->description,
                'target_audience' => $request->target_audience,
            ]);

            return back()->with([
            'message' => 'Package added successfully!',
            'type' => 'success'
        ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'heading' => 'required',
            'img' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048|dimensions:max_width:200,max_height:200',
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

        $info = packages::find($id);

        if (!$info) {
            return response()->json([
                'mesg' => 'Package not found',
            ], 404);
        }

        $imagename = null;

        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imagename = time() . '.webp'; // force convert to webp
            $path = public_path('assets/images/package/' . $imagename);

            // ✅ v3: Resize and convert to webp
            $this->imageManager->read($image)
                ->cover(200, 200)
                ->toWebp(90)
                ->save($path);

            $info->update([
                'img' => $imagename,
                'heading' => $request->heading,
                'price' => $request->price,
                'description' => $request->description,
                'target_audience' => $request->target_audience,
            ]);

            return back()->with([
            'message' => 'Package updated successfully!',
            'type' => 'success'
        ]);
        }
    }

    public function index()
    {
        $show = packages::all();
        if ($show->isNotEmpty()) {
            return response()->json([
                'mesg' => $show,
            ], 200);
        } else {
             return Inertia::render('Admin/Other/Package', [
            'packages' => $show
        ]);
        }
    }

    public function destroy($id)
    {
        $del = packages::find($id);
        if (!$del) {
            return response()->json([
                'mesg' => 'Data not found',
            ], 404);
        }

        // ✅ Optionally delete image file
        if ($del->img) {
            $imagePath = public_path('assets/images/package/' . $del->img);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $del->delete();

       return back()->with([
            'message' => 'Package deleted successfully!',
            'type' => 'success'
        ]);
    }
}
