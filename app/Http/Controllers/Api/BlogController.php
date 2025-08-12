<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\GD\Driver as GdDriver;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
class BlogController extends Controller
{
    // Get all blogs
    public function index()
    {
         $blogs = Blog::orderBy('created_at', 'desc')->get();
        // return response()->json($blogs, 200);
         return Inertia::render('Admin/Other/Blog', [
            'blogs' => $blogs,
        ]);
    }

    // Store new blog
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

       if ($validator->fails()) {
                return response()->json([
             'errors' => $validator->errors()->all()
            ], 422);
        }


        // $manager = new ImageManager(new GdDriver());

        // // Process card image
        // $cardImgFile = $request->file('card_img');
        // $cardImg     = $manager->read($cardImgFile)->cover(400, 400)->toWebp(85);
        // $cardImgName = uniqid() . '.webp';
        // $cardImg->save(public_path('assets/images/blog/' . $cardImgName));

        // // Process banner image
        // $bannerImgFile = $request->file('banner_img');
        // $bannerImg     = $manager->read($bannerImgFile)->cover(400, 400)->toWebp(85);
        // $bannerImgName = uniqid() . '.webp';
        // $bannerImg->save(public_path('assets/images/blog/' . $bannerImgName));

        // $blog = Blog::create([
        //     'meta_key'    => $request->meta_key,
        //     'meta_desc'   => $request->meta_desc,
        //     'title'       => $request->title,
        //     'url'         => $request->url,
        //     'keyword'     => $request->keyword,
        //     'description' => $request->description,
        //     'author'      => $request->author,
        //     'published'   => $request->published,
        //     'card_img'    => $cardImgName,
        //     'banner_img'  => $bannerImgName,
        // ]);

        // return response()->json([
        //     'message' => 'Blog created successfully.',
        //     'data'    => $blog,
        // ], 201);

        try {
            $manager = new ImageManager(new GdDriver());

            // Process card image
            $cardImgFile = $request->file('card_img');
            $cardImg     = $manager->read($cardImgFile)->cover(400, 400)->toWebp(85);
            $cardImgName = 'card_' . uniqid() . '.webp';
            $cardImg->save(public_path('assets/images/blog/' . $cardImgName));

            // Process banner image
            $bannerImgFile = $request->file('banner_img');
            $bannerImg     = $manager->read($bannerImgFile)->cover(1200, 600)->toWebp(85);
            $bannerImgName = 'banner_' . uniqid() . '.webp';
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

            return redirect()->route('blogs.index')->with('message', 'Blog created successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create blog. Please try again.'])->withInput();
        }
    }

    // Update blog
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
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

       if ($validator->fails()) {
                return response()->json([
             'errors' => $validator->errors()->all()
            ], 422);
        }

        $blog = Blog::findOrFail($id);

       try {
            $manager = new ImageManager(new GdDriver());

            // Handle card image update
            if ($request->hasFile('card_img')) {
                // Delete old card image
                $oldCardImagePath = public_path('assets/images/blog/' . $blog->card_img);
                if (file_exists($oldCardImagePath)) {
                    unlink($oldCardImagePath);
                }

                $cardImgFile = $request->file('card_img');
                $cardImg     = $manager->read($cardImgFile)->cover(400, 400)->toWebp(85);
                $cardImgName = 'card_' . uniqid() . '.webp';
                $cardImg->save(public_path('assets/images/blog/' . $cardImgName));
                $blog->card_img = $cardImgName;
            }

            // Handle banner image update
            if ($request->hasFile('banner_img')) {
                // Delete old banner image
                $oldBannerImagePath = public_path('assets/images/blog/' . $blog->banner_img);
                if (file_exists($oldBannerImagePath)) {
                    unlink($oldBannerImagePath);
                }

                $bannerImgFile = $request->file('banner_img');
                $bannerImg     = $manager->read($bannerImgFile)->cover(1200, 600)->toWebp(85);
                $bannerImgName = 'banner_' . uniqid() . '.webp';
                $bannerImg->save(public_path('assets/images/blog/' . $bannerImgName));
                $blog->banner_img = $bannerImgName;
            }

            $blog->update([
                'meta_key'    => $request->meta_key ?? $blog->meta_key,
                'meta_desc'   => $request->meta_descv ?? $blog->meta_desc,
                'title'       => $request->title ?? $blog->title,
                'url'         => $request->url ?? $blog->url,
                'keyword'     => $request->keyword ?? $blog->keyword,
                'description' => $request->description ?? $blog->description,
                'author'      => $request->author ?? $blog->author,
                'published'   => $request->published ?? $blog->published,
                'card_img'    => $blog->card_img ?? $cardImgName,
                'banner_img'  => $blog->banner_img ?? $bannerImgName,
            ]);

            return redirect()->route('blogs.index')->with('message', 'Blog updated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update blog. Please try again.'])->withInput();
        }
    }

   //Delete method
public function destroy($id)
{
    try {
            $blog = Blog::findOrFail($id);

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

            return redirect()->route('blogs.index')->with('message', 'Blog deleted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete blog. Please try again.']);
        }
}

}
