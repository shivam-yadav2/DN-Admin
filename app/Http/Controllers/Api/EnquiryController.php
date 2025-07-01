<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enquiry; // Enquiry model

class EnquiryController extends Controller
{
    // GET all enquiries
    public function index()
    {
        $enquiries = Enquiry::where('isDeleted', false)->get();
        return response()->json($enquiries, 200);
    }

    // POST a new enquiry
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'number' => 'required|string|max:13',
            'city' => 'required|string|max:100',
            'service_id' => 'required|exists:services,id', // Assuming 'services' table has a 'name' column
            'subservice_id' => 'required|exists:subservices,id',
            'message' => 'nullable|string|max:500',
        ]);

        // Create new enquiry record
        $enquiry = Enquiry::create($request->all());

        return response()->json([
            'message' => 'Enquiry created successfully.',
            'data' => $enquiry,
        ], 201);
    }
}
