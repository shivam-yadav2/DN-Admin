<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\GD\Driver as GdDriver;

class BlogController extends Controller
{
    // Get all blogs
    public function index()
    {
        $blogs = Blog::all();
        return response()->json($blogs, 200);
    }

    // Store new blog
    public function store(Request $request)
    {
        $request->validate([
            'meta_key'    => 'required|string|max:255',
            'meta_desc'   => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'url'         => 'required|string|max:255',
            'keyword'     => 'required|array',
            'description' => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'published'   => 'required|date',
            'card_img'    => 'required|image|mimes:jpg,jpeg,png,webp|max:512',
            'banner_img'  => 'required|image|mimes:jpg,jpeg,png,webp|max:512',
        ]);

        $manager = new ImageManager(new GdDriver());

        // Process card image
        $cardImgFile = $request->file('card_img');
        $cardImg     = $manager->read($cardImgFile)->cover(400, 400)->toWebp(85);
        $cardImgName = uniqid() . '.webp';
        $cardImg->save(public_path('assets/images/blog/' . $cardImgName));

        // Process banner image
        $bannerImgFile = $request->file('banner_img');
        $bannerImg     = $manager->read($bannerImgFile)->cover(400, 400)->toWebp(85);
        $bannerImgName = uniqid() . '.webp';
        $bannerImg->save(public_path('assets/images/blog/' . $bannerImgName));

        $blog = Blog::create([
            'meta_key'    => $request->meta_key,
            'meta_desc'   => $request->meta_desc,
            'title'       => $request->title,
            'url'         => $request->url,
            'keyword'     => $request->keyword,
            'description' => $request->description,
            'author'      => $request->author,
            'published'   => $request->published,
            'card_img'    => $cardImgName,
            'banner_img'  => $bannerImgName,
        ]);

        return response()->json([
            'message' => 'Blog created successfully.',
            'data'    => $blog,
        ], 201);
    }

    // Update blog
    public function update(Request $request, $id)
    {
        $request->validate([
            'meta_key'    => 'required|string|max:255',
            'meta_desc'   => 'required|string|max:255',
            'title'       => 'required|string|max:255',
            'url'         => 'required|string|max:255',
            'keyword'     => 'required|array',
            'description' => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'published'   => 'required|date',
            'card_img'    => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:512',
            'banner_img'  => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:512',
        ]);

        $blog = Blog::findOrFail($id);

        $manager = new ImageManager(new GdDriver());

        if ($request->hasFile('card_img')) {
            $cardImgFile = $request->file('card_img');
            $cardImg     = $manager->read($cardImgFile)->cover(400, 400)->toWebp(85);
            $cardImgName = uniqid() . '.webp';
            $cardImg->save(public_path('assets/images/blog/' . $cardImgName));

            $blog->card_img = $cardImgName;
        }

        if ($request->hasFile('banner_img')) {
            $bannerImgFile = $request->file('banner_img');
            $bannerImg     = $manager->read($bannerImgFile)->cover(400, 400)->toWebp(85);
            $bannerImgName = uniqid() . '.webp';
            $bannerImg->save(public_path('assets/images/blog/' . $bannerImgName));

            $blog->banner_img = $bannerImgName;
        }

        $blog->update([
            'meta_key'    => $request->meta_key,
            'meta_desc'   => $request->meta_desc,
            'title'       => $request->title,
            'url'         => $request->url,
            'keyword'     => $request->keyword,
            'description' => $request->description,
            'author'      => $request->author,
            'published'   => $request->published,
            'card_img'    => $blog->card_img,
            'banner_img'  => $blog->banner_img,
        ]);

        return response()->json([
            'message' => 'Blog updated successfully.',
            'data'    => $blog,
        ], 200);
    }

   //Delete method
public function destroy($id)
{
    $blog = Blog::find($id);

    if (!$blog) {
        return response()->json(['message' => 'Blog not found.'], 404);
    }

    // Delete card image file if exists
    $cardImagePath = public_path('assets/images/blog/' . $blog->card_img);
    if (file_exists($cardImagePath)) {
        unlink($cardImagePath);
    }

    // Delete banner image file if exists
    $bannerImagePath = public_path('assets/images/blog/' . $blog->banner_img);
    if (file_exists($bannerImagePath)) {
        unlink($bannerImagePath);
    }

    // Delete database record
    $blog->delete();

    return response()->json(['message' => 'Blog deleted successfully.'], 200);
}

}
