<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FAQ;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FAQController extends Controller
{
    //Get all FAQs
   public function index()
    {
        $faqs = FAQ::all()->map(function ($faq) {
            return [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
            ];
        });
        return Inertia::render('Admin/HomePage/FAQPage', [
            'faqs' => $faqs,
        ]);
    }

    //Store a new FAQ
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:255|unique:faqs,question',
            'answer' => 'required|string|unique:faqs,answer',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        // Create a new FAQ
        $faq = FAQ::create($request->all());
        // return response()->json([
        //     'message' => 'FAQ created successfully.',
        //     'data' => $faq,
        // ], 201);

        return redirect()->back()->with('success', 'FAQ created successfully.');
    }

    //Update an existing FAQ
    public function update(Request $request, $id)
    {
        $faq = FAQ::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
        ]);

        if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $faq->update($request->all());
        // return response()->json($faq);
        return redirect()->back()->with('success', 'FAQ updated successfully.');
    }

    //Delete an FAQ
    public function destroy($id)
    {
        $faq = FAQ::findOrFail($id);
        $faq->delete();
        // return response()->json(['message' => 'FAQ deleted successfully']);
        return redirect()->back()->with('success', 'FAQ deleted successfully');
    }

}
