<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enquiry;
use Inertia\Inertia;
use App\Models\SubService;
use App\Models\Service;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class EnquiryController extends Controller
{
    /**
     * Display a listing of enquiries with dashboard data
     */
    public function index()
    {
        try {
            // Get all non-deleted enquiries with relationships
            $enquiries = Enquiry::where('isDeleted', false)
                ->with(['service', 'subservice'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($enquiry) {
                    return [
                        '_id' => (string) $enquiry->id,
                        'name' => $enquiry->name ?? 'N/A',
                        'phone' => $enquiry->number ?? 'N/A',
                        'email' => $enquiry->email ?? 'N/A',
                        'city' => $enquiry->city ?? 'N/A',
                        'addedFor' => $enquiry->service 
                            ? "Course: {$enquiry->service->name}" 
                            : 'N/A',
                        'enquiryFor' => [
                            'title' => $enquiry->subservice 
                                ? $enquiry->subservice->name 
                                : 'N/A',
                        ],
                        'createdAt' => $enquiry->created_at->toISOString(),
                        'leadStatus' => $enquiry->status ?? 'new_lead',
                        'addedBy' => $enquiry->addedBy ?? 'User',
                        'source' => $enquiry->source ?? 'Website',
                        'message' => $enquiry->message ?? '',
                    ];
                });

            // Get services with their subservices
            $services = Service::with('subservices')->get()->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'image' => $service->image, // Assuming image is stored in public/assets/images

                'subservices' => $service->subservices->map(function ($subService) {
                    return [
                        'id' => $subService->id,
                        'name' => $subService->name,
                        'description' => $subService->description,
                        'image' => $subService->image, 
                    ];
                }),
            ];
        });

            // Calculate dashboard statistics
            $totalEnquiries = $enquiries->count();
            $convertedCount = $enquiries->where('leadStatus', 'converted')->count();
            $contactedCount = $enquiries->where('leadStatus', 'contacted')->count();
            $newLeadsCount = $enquiries->whereIn('leadStatus', ['new_lead', 'new'])->count();

            return Inertia::render('Admin/Enquiry/Leads', [
                'dashboardData' => [
                    'enquiries' => $enquiries,
                    'services' => $services,
                    'stats' => [
                        'totalEnquiries' => $totalEnquiries,
                        'converted' => $convertedCount,
                        'contacted' => $contactedCount,
                        'newLeads' => $newLeadsCount,
                        'conversionRate' => $totalEnquiries > 0 
                            ? round(($convertedCount / $totalEnquiries) * 100, 2) 
                            : 0,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching enquiries: ' . $e->getMessage());
            
            return Inertia::render('Admin/Enquiry/Leads', [
                'dashboardData' => [
                    'enquiries' => collect([]),
                    'services' => collect([]),
                    'stats' => [
                        'totalEnquiries' => 0,
                        'converted' => 0,
                        'contacted' => 0,
                        'newLeads' => 0,
                        'conversionRate' => 0,
                    ],
                ],
            ])->with('error', 'Failed to load enquiries. Please try again.');
        }
    }

    /**
     * Store a newly created enquiry
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:enquiries,email',
                'number' => 'required|string|max:15|regex:/^[0-9+\-\s()]+$/',
                'city' => 'required|string|max:100',
                'service_id' => 'required|exists:services,id',
                'subservice_id' => 'required|exists:subservices,id',
                'message' => 'nullable|string|max:1000',
                'addedBy' => 'required|string|in:User,Ujjwal Porwal,Sharad Verma,Punit Shukla',
                'source' => 'required|string|in:Website,Call,WhatsApp',
            ], [
                'email.unique' => 'This email address is already registered.',
                'number.regex' => 'Please enter a valid phone number.',
                'service_id.required' => 'Please select a service category.',
                'service_id.exists' => 'The selected service category is invalid.',
                'subservice_id.required' => 'Please select a specific service.',
                'subservice_id.exists' => 'The selected specific service is invalid.',
                'addedBy.in' => 'Please select a valid user from the list.',
                'source.in' => 'Please select a valid source.',
            ]);

            if ($validator->fails()) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput()
                    ->with('error', 'Please correct the errors below.');
            }

            // Verify that the subservice belongs to the selected service
            $subservice = SubService::where('id', $request->subservice_id)
                ->where('service_id', $request->service_id)
                ->first();

            if (!$subservice) {
                return redirect()->back()
                    ->with('error', 'The selected service combination is invalid.')
                    ->withInput();
            }

            // Create new enquiry record
            $enquiry = Enquiry::create([
                'name' => trim($request->name),
                'email' => strtolower(trim($request->email)),
                'number' => $request->number,
                'city' => trim($request->city),
                'service_id' => $request->service_id,
                'subservice_id' => $request->subservice_id,
                'message' => $request->message ? trim($request->message) : null,
                'addedBy' => $request->addedBy,
                'source' => $request->source,
                'status' => 'new_lead',
                'isDeleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Log::info('New enquiry created', [
                'enquiry_id' => $enquiry->id,
                'email' => $enquiry->email,
                'addedBy' => $enquiry->addedBy,
            ]);

            return redirect()->route('enquiries.index')
                ->with('success', 'Enquiry created successfully! We will contact the customer soon.');

        } catch (\Exception $e) {
            Log::error('Error creating enquiry: ' . $e->getMessage(), [
                'request_data' => $request->except(['_token']),
                'error' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create enquiry. Please try again.');
        }
    }

    /**
     * Update enquiry status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $enquiry = Enquiry::where('id', $id)
                ->where('isDeleted', false)
                ->first();

            if (!$enquiry) {
                return redirect()->route('enquiries.index')
                    ->with('error', 'Enquiry not found or has been deleted.');
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:new_lead,contacted,converted,lost',
            ], [
                'status.required' => 'Status is required.',
                'status.in' => 'Please select a valid status.',
            ]);

            if ($validator->fails()) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->with('error', 'Invalid status selected.');
            }

            $oldStatus = $enquiry->status;
            $newStatus = $request->status;

            // Update enquiry status
            $enquiry->update([
                'status' => $newStatus,
                'updated_at' => now(),
            ]);

            Log::info('Enquiry status updated', [
                'enquiry_id' => $enquiry->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'updated_by' => auth()->user()->name ?? 'System',
            ]);

            $statusNames = [
                'new_lead' => 'New Lead',
                'contacted' => 'Contacted',
                'converted' => 'Converted',
                'lost' => 'Lost',
            ];

            return redirect()->route('enquiries.index')
                ->with('success', "Enquiry status updated to {$statusNames[$newStatus]} successfully.");

        } catch (\Exception $e) {
            Log::error('Error updating enquiry status: ' . $e->getMessage(), [
                'enquiry_id' => $id,
                'status' => $request->status,
                'error' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to update enquiry status. Please try again.');
        }
    }

    /**
     * Soft delete an enquiry
     */
    public function destroy($id)
    {
        try {
            $enquiry = Enquiry::where('id', $id)
                ->where('isDeleted', false)
                ->first();

            if (!$enquiry) {
                return redirect()->route('enquiries.index')
                    ->with('error', 'Enquiry not found or already deleted.');
            }

            // Soft delete the enquiry
            $enquiry->update([
                'isDeleted' => true,
                'updated_at' => now(),
            ]);

            Log::info('Enquiry soft deleted', [
                'enquiry_id' => $enquiry->id,
                'email' => $enquiry->email,
                'deleted_by' => auth()->user()->name ?? 'System',
            ]);

            return redirect()->route('enquiries.index')
                ->with('success', 'Enquiry deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Error deleting enquiry: ' . $e->getMessage(), [
                'enquiry_id' => $id,
                'error' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to delete enquiry. Please try again.');
        }
    }

    /**
     * Get enquiry statistics for dashboard
     */
    public function getStats()
    {
        try {
            $enquiries = Enquiry::where('isDeleted', false)->get();
            
            $stats = [
                'total' => $enquiries->count(),
                'new_leads' => $enquiries->where('status', 'new_lead')->count(),
                'contacted' => $enquiries->where('status', 'contacted')->count(),
                'converted' => $enquiries->where('status', 'converted')->count(),
                'lost' => $enquiries->where('status', 'lost')->count(),
                'today' => $enquiries->where('created_at', '>=', today())->count(),
                'this_week' => $enquiries->where('created_at', '>=', now()->startOfWeek())->count(),
                'this_month' => $enquiries->where('created_at', '>=', now()->startOfMonth())->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching enquiry stats: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics.',
            ], 500);
        }
    }

    /**
     * Export enquiries to CSV
     */
    public function export(Request $request)
    {
        try {
            $enquiries = Enquiry::where('isDeleted', false)
                ->with(['service', 'subservice'])
                ->get();

            $filename = 'enquiries_' . date('Y-m-d_H-i-s') . '.csv';
            
            $headers = [
                'Content-type' => 'text/csv',
                'Content-Disposition' => "attachment; filename={$filename}",
                'Pragma' => 'no-cache',
                'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
                'Expires' => '0'
            ];

            $callback = function() use ($enquiries) {
                $file = fopen('php://output', 'w');
                
                // Add CSV headers
                fputcsv($file, [
                    'ID', 'Name', 'Email', 'Phone', 'City', 
                    'Service', 'Subservice', 'Status', 'Added By', 
                    'Source', 'Message', 'Created Date'
                ]);

                // Add data rows
                foreach ($enquiries as $enquiry) {
                    fputcsv($file, [
                        $enquiry->id,
                        $enquiry->name,
                        $enquiry->email,
                        $enquiry->number,
                        $enquiry->city,
                        $enquiry->service ? $enquiry->service->name : 'N/A',
                        $enquiry->subservice ? $enquiry->subservice->name : 'N/A',
                        $enquiry->status ?? 'new_lead',
                        $enquiry->addedBy ?? 'User',
                        $enquiry->source ?? 'Website',
                        $enquiry->message ?? '',
                        $enquiry->created_at->format('Y-m-d H:i:s'),
                    ]);
                }

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);

        } catch (\Exception $e) {
            Log::error('Error exporting enquiries: ' . $e->getMessage());
            
            return redirect()->back()
                ->with('error', 'Failed to export enquiries. Please try again.');
        }
    }
}