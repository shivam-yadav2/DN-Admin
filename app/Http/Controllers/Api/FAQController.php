<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FAQ;
use Illuminate\Support\Facades\Validator;

class FAQController extends Controller
{
    //Get all FAQs
    public function index()
    {
        $faqs = FAQ::all();
        return response()->json($faqs,200);
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
        return response()->json([
            'message' => 'FAQ created successfully.',
            'data' => $faq,
        ], 201);
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
        return response()->json($faq);
    }

    //Delete an FAQ
    public function destroy($id)
    {
        $faq = FAQ::findOrFail($id);
        $faq->delete();
        return response()->json(['message' => 'FAQ deleted successfully']);
    }

}
