<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactDetail;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ContactDetailController extends Controller
{
    //Get all data
   public function index()
    {
        $contactDetails = ContactDetail::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Other/ContactDetail', [
            'contactDetails' => $contactDetails,
        ]);
    }

    //Store the data
    public function store(Request $request)
    {
        $request->merge([
            'email'       => is_array($request->email) ? $request->email : [$request->email],
            'phone_no'    => is_array($request->phone_no) ? $request->phone_no : [$request->phone_no],
            'whatsapp_no' => is_array($request->whatsapp_no) ? $request->whatsapp_no : [$request->whatsapp_no],
        ]);


        $validator = Validator::make($request->all(), [
           'email'         => 'required | array | min:1',
           'email.*'       => 'required | email | distinct | max:255',

          'phone_no'       => 'required | array | min:1',
          'phone_no.*'     => 'required | string | digits_between:10,13 | regex:/^[0-9]+$/',
 
          'whatsapp_no'     => 'required | array | min:1',
          'whatsapp_no.*'   => 'required | string | digits_between:10,13 | regex:/^[0-9]+$/',

          'location'      => 'required | string | max:255',
        ]);

         if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

       try {
            $contactDetail = ContactDetail::create([
                'email'       => array_filter($request->email, fn($email) => !empty(trim($email))),
                'phone_no'    => array_filter($request->phone_no, fn($phone) => !empty(trim($phone))),
                'whatsapp_no' => array_filter($request->whatsapp_no, fn($whatsapp) => !empty(trim($whatsapp))),
                'location'    => $request->location,
            ]);

            return redirect()->route('contact-details.index')->with('message', 'Contact details created successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create contact details. Please try again.'])->withInput();
        }
    }

    //Update the data
    public function update(Request $request , $id)
    {
        $request->merge([
            'email'       => is_array($request->email) ? $request->email : [$request->email],
            'phone_no'    => is_array($request->phone_no) ? $request->phone_no : [$request->phone_no],
            'whatsapp_no' => is_array($request->whatsapp_no) ? $request->whatsapp_no : [$request->whatsapp_no],
        ]);

        $validator = Validator::make($request->all(), [
           'email'         => 'required | array | min:1',
           'email.*'       => 'required | email | distinct | max:255',

          'phone_no'       => 'required | array | min:1',
          'phone_no.*'     => 'required | string | digits_between:10,13 | regex:/^[0-9]+$/',

         'whatsapp_no'     => 'required | array | min:1',
         'whatsapp_no.*'   => 'required | string | digits_between:10,13 | regex:/^[0-9]+$/',

         'location'      => 'required | string | max:255',
        ]);

         if ($validator->fails()) {
                return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        try {
            $contactDetail = ContactDetail::findOrFail($id);

            $contactDetail->update([
                'email'       => array_filter($request->email, fn($email) => !empty(trim($email))),
                'phone_no'    => array_filter($request->phone_no, fn($phone) => !empty(trim($phone))),
                'whatsapp_no' => array_filter($request->whatsapp_no, fn($whatsapp) => !empty(trim($whatsapp))),
                'location'    => $request->location,
            ]);

            return redirect()->route('contact-details.index')->with('message', 'Contact details updated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update contact details. Please try again.'])->withInput();
        }
    }

    // Delete
    public function destroy($id)
    {
        try {
            $contactDetail = ContactDetail::findOrFail($id);
            $contactDetail->delete();
            
            return redirect()->route('contact-details.index')->with('message', 'Contact details deleted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete contact details. Please try again.']);
        }
    }
}
