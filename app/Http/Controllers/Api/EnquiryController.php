<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enquiry; // Enquiry model
use Inertia\Inertia;
use App\Models\SubService; // SubService model
use App\Models\Service; //  Service model
class EnquiryController extends Controller
{
    // GET all enquiries
    // public function index()
    // {
    //     $enquiries = Enquiry::where('isDeleted', false)->get();
    //     return Inertia::render('Admin/Enquiry/Leads', [
    //         'dashboardData' => $enquiries
    //     ]);
    // }

    public function index()
{
    $enquiries = Enquiry::where('isDeleted', false)->get()->map(function ($enquiry) {
        // dd($enquiry);
        return [
            '_id' => (string) $enquiry->id,
            'name' => $enquiry->name,
            'phone' => $enquiry->number,
            'email' => $enquiry->email,
            'city' => $enquiry->city,
            'addedFor' => $enquiry->service_id ? "Course: {$enquiry->service->name}" : 'N/A',
            'enquiryFor' => [
                'title' => $enquiry->subservice_id ? $enquiry->subservice->name : 'N/A',
            ],
            'createdAt' => $enquiry->created_at->toISOString(),
            'leadStatus' => $enquiry->status ?? 'new',
        ];
    });

    // $services = Service::all()->map(function ($service) {
    //     return ['id' => $service->id, 'name' => $service->name];
    // });

    // $subservices = Subservice::all()->map(function ($subservice) {
    //     return ['id' => $subservice->id, 'name' => $subservice->name];
    // });

    return Inertia::render('Admin/Enquiry/Leads', [
        'dashboardData' => [
            'enquiries' => $enquiries,
            'totalStudents' => 120,
            'activeCourses' => 8,
            'revenue' => 15400,
            'upcomingAppointments' => 15,
            // 'services' => $services,
            // 'subservices' => $subservices,
        ],
    ]);
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

    //Destroy an enquiry
  public function destroy($id)
    {
        $enquiry = Enquiry::find($id);

        if (!$enquiry) {
        return response()->json(['message' => 'Enquiry not found.'], 404);
        }

        // Soft delete the enquiry
        $enquiry->isDeleted = true;
        $enquiry->save();

        return response()->json(['message' => 'Enquiry deleted successfully.'], 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $enquiry = Enquiry::find($id);

        // Validate request
        $request->validate([
            'status' => 'required|string|in:new_lead,contacted,converted,lost',
        ]);

        if (!$enquiry) {
            return redirect()->route('enquiries.index')->withErrors(['message' => 'Enquiry not found.']);
        }

        // Update enquiry status
        $enquiry->status = $request->status;
        $enquiry->save();

        // Format the updated enquiry
        $formattedEnquiry = [
            '_id' => (string) $enquiry->id,
            'name' => $enquiry->name,
            'phone' => $enquiry->number,
            'email' => $enquiry->email,
            'city' => $enquiry->city,
            'addedFor' => $enquiry->service_id ? "Course: {$enquiry->service->name}" : 'N/A',
            'enquiryFor' => [
                'title' => $enquiry->subservice_id ? $enquiry->subservice->name : 'N/A',
            ],
            'createdAt' => $enquiry->created_at->toISOString(),
            'leadStatus' => $enquiry->status,
        ];

        return redirect()->route('enquiries.index')->with([
            'message' => 'Enquiry status updated successfully.',
            'data' => $formattedEnquiry,
        ]);
    }
    

}
