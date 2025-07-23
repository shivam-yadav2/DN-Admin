<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactDetail;
use Illuminate\Support\Facades\Validator;

class ContactDetailController extends Controller
{
    //Get all data
    public function index()
    {
        $details = ContactDetail::all();
        return response()->json($details, 200);
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

        $contactdetail = ContactDetail::create([
            'email'          => $request->email,
            'phone_no'       => $request->phone_no,
            'whatsapp_no'    => $request->whatsapp_no,
            'location'       => $request->location,
        ]);

         return response()->json([
            'message' => 'Contact Detail created successfully.',
            'data'    => $contactdetail,
        ], 201);
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

          $contactdetail = ContactDetail::findOrFail($id);

        $contactdetail->update([
             'email'         => $request->email,
            'phone_no'       => $request->phone_no,
            'whatsapp_no'    => $request->whatsapp_no,
            'location'       => $request->location,
        ]);

         return response()->json([
        'message' => 'Contact Detail updated successfully.',
        'data' => $contactdetail,
        ], 200);
    }

    //Delete
    public function destroy($id)
    {
         $contactdetail = ContactDetail::findOrFail($id);
         $contactdetail->delete();
         return response()->json(['message' => 'Record deleted successfully']);
    }
}
