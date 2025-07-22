<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FAQ;

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
        $request->validate([
            'question' => 'required|string|max:255|unique:faqs,question',
            'answer' => 'required|string|unique:faqs,answer',
        ],
    [
    'question.required' => 'The question field is required.',
    'question.string' => 'The question must be a valid string.',
    'question.max' => 'The question cannot exceed 255 characters.',
    'question.unique' => 'This question already exists.',

    'answer.required' => 'The answer field is required.',
    'answer.string' => 'The answer must be a valid string.',
    'answer.unique' => 'This answer already exists.',
]);

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

        $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
        ],
    [
    'question.required' => 'The question field is required.',
    'question.string' => 'The question must be a valid string.',
    'question.max' => 'The question cannot exceed 255 characters.',
    'question.unique' => 'This question already exists.',

    'answer.required' => 'The answer field is required.',
    'answer.string' => 'The answer must be a valid string.',
    'answer.unique' => 'This answer already exists.',
]);

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
