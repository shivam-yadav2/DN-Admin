<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\our_team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver; // ✅ Use GD driver for v3
use Inertia\Inertia;

class our_teamcontroller extends Controller
{
    protected $imageManager;

    public function __construct()
    {
        // ✅ Initialize ImageManager with GD driver
        $this->imageManager = new ImageManager(new Driver());
    }

    public function index()
    {
        $data = our_team::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Other/OurTeam', [
            'teamMembers' => $data,
            'flash' => session('flash')
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'              => 'required|string|max:255',
            'designation'       => 'required|string|max:255',
            'image'             => 'required|image|mimes:jpeg,jpg,png,webp|max:2048',
            'joining_date'      => 'required|date',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $imagename = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagename = time() . '_' . uniqid() . '.webp';
            $path = public_path('assets/images/our_team/' . $imagename);

            // Create directory if it doesn't exist
            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            // ✅ v3 syntax: Resize & convert to WebP
            $this->imageManager->read($image)
                ->cover(500, 500)   // Replaces fit() in v3
                ->toWebp(90)
                ->save($path);
        }

        $our_team = our_team::create([
            'name' => $request->name,
            'designation' => $request->designation,
            'img' => $imagename,
            'joining_date' => $request->joining_date,
        ]);

        return back()->with('flash', [
            'message' => 'Team member added successfully!',
            'type' => 'success'
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'joining_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $user = our_team::find($id);

        if (!$user) {
            return back()->with('flash', [
                'message' => 'Team member not found.',
                'type' => 'error'
            ]);
        }

        $imagename = $user->img; // Keep existing image if not replaced

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->img) {
                $oldImagePath = public_path('assets/images/our_team/' . $user->img);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $image = $request->file('image');
            $imagename = time() . '_' . uniqid() . '.webp';
            $path = public_path('assets/images/our_team/' . $imagename);

            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            // ✅ v3 syntax: Resize & convert to WebP
            $this->imageManager->read($image)
                ->cover(500, 500)
                ->toWebp(90)
                ->save($path);
        }

        $user->update([
            'name' => $request->name ?? $user->name,
            'designation' => $request->designation ?? $user->designation,
            'img' => $imagename ?? $user->img,
            'joining_date' => $request->joining_date ?? $user->joining_date,
        ]);


        // return back()->with('flash', [
        //     'message' => 'Team member updated successfully!',
        //     'type' => 'success'
        // ]);
       

        return back()->with('flash', [
            'message' => 'Team member updated successfully!',
            'type' => 'success'

        ]);
    }

    public function destroy($id)
    {
        $info = our_team::find($id);
        
        if (!$info) {
            return back()->with('flash', [
                'message' => 'Team member not found.',
                'type' => 'error'
            ]);
        }

        if ($info->img) {
            $imagePath = public_path('assets/images/our_team/' . $info->img);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $info->delete();
        
        return back()->with('flash', [
            'message' => 'Team member deleted successfully!',
            'type' => 'success'
        ]);
    }
}
