<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HomeAbout;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\GD\Driver as GdDriver;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class HomeAboutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $homeAbouts = HomeAbout::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/HomePage/About', [
            'homeAbouts' => $homeAbouts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'tag'           => 'required|string|max:255',
            'heading'       => 'required|string|max:255',
            'sub_heading'   => 'required|string|max:255',
            'image'         => 'required|image|mimes:jpg,jpeg,png,webp|max:512',
            'content'       => 'required|string|max:1000',
            'button_text'   => 'required|string|max:100',
            'button_url'    => 'required|url|max:100',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        try {
            // Process the uploaded file
            $image = $request->file('image');
            $originalExtension = strtolower($image->getClientOriginalExtension());

            $manager = new ImageManager(new GdDriver());

            $timestampName = time() . '.webp';
            $imageName = $timestampName;
            $destinationPath = public_path('assets/images/homeAbout');

            // Create directory
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            if (in_array($originalExtension, ['jpg', 'jpeg', 'png', 'webp'])) {
                // Convert to WebP
                $img = $manager->read($image->getRealPath())->toWebp(80);
                $img->save($destinationPath . '/' . $imageName);
            } elseif ($originalExtension === 'webp') {
                // Save WebP as-is
                $image->move($destinationPath, $imageName);
            } else {
                return redirect()->back()
                    ->with('error', 'Only JPG, JPEG, PNG, or WEBP formats allowed.')
                    ->withInput();
            }

            // Create new home about record
            $homeAbout = HomeAbout::create([
                'tag'          => $request->tag,
                'heading'       => $request->heading,
                'sub_heading'   => $request->sub_heading,
                'image'         => $imageName,
                'content'       => $request->content,
                'button_text'   => $request->button_text,
                'button_url'    => $request->button_url
            ]);

            return redirect()->route('home-about.index')
                ->with('success', 'Home About created successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create Home About. Please try again.')
                ->withInput();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $homeAbout = HomeAbout::find($id);

        if (!$homeAbout) {
            return redirect()->route('home-about.index')
                ->with('error', 'Home About not found.');
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'tag'           => 'required|string|max:255',
            'heading'       => 'required|string|max:255',
            'sub_heading'   => 'required|string|max:255',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:512',
            'content'       => 'required|string|max:1000',
            'button_text'   => 'required|string|max:100',
            'button_url'    => 'required|url|max:100',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        try {
            // Default to old image
            $imageName = $homeAbout->image;

            // Process the uploaded file if provided
            if ($request->hasFile('image')) {
                $oldImagePath = public_path('assets/images/homeAbout/' . $homeAbout->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }

                $image = $request->file('image');
                $originalExtension = strtolower($image->getClientOriginalExtension());

                $manager = new ImageManager(new GdDriver());

                $timestampName = time() . '.webp';
                $imageName = $timestampName;
                $destinationPath = public_path('assets/images/homeAbout');

                // Create directory if it doesn't exist
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                if (in_array($originalExtension, ['jpg', 'jpeg', 'png'])) {
                    // Convert to WebP
                    $img = $manager->read($image->getRealPath())->toWebp(80);
                    $img->save($destinationPath . '/' . $imageName);
                } elseif ($originalExtension === 'webp') {
                    // Save WebP as-is
                    $image->move($destinationPath, $imageName);
                } else {
                    return redirect()->back()
                        ->with('error', 'Only JPG, JPEG, PNG, or WEBP formats allowed.')
                        ->withInput();
                }
            }

            // Update home about record
            $homeAbout->update([
                'tag'          => $request->tag,
                'heading'       => $request->heading,
                'sub_heading'   => $request->sub_heading,
                'image'         => $imageName,
                'content'       => $request->content,
                'button_text'   => $request->button_text,
                'button_url'    => $request->button_url
            ]);

            return redirect()->route('home-about.index')
                ->with('success', 'Home About updated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update Home About. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $homeAbout = HomeAbout::findOrFail($id);

        try {
            // Delete image file
            $filePath = public_path('assets/images/homeAbout/' . $homeAbout->image);
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Delete the DB record
            $homeAbout->delete();

            return redirect()->route('home-about.index')
                ->with('success', 'Home About deleted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete Home About. Please try again.');
        }
    }
}