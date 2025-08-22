<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sm_Facebook;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SmmFacebookController extends Controller
{
        //Get data
    public function index()
    {
        $sm_facebook = Sm_Facebook::all();
        // return response()->json($sm_facebook, 200);
        return Inertia::render('Admin/SMM/SmmFacebook', [
            'smmFacebook' => $sm_facebook,
        ]);
    }

    //Store data
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'icon'         =>  'required|string',
            'heading'       => 'required|string|max:255',
            'description'   => 'required|string|max:1000',
        ]);

        if ($validator->fails()) 
            {
                return response()->json([$validator->errors()->all()
                ], 422);
            }
        //Create a new seo service
        $sm_facebook = Sm_Facebook::create([
           'icon'           => $request->icon,
           'heading'        => $request->heading,
           'description'    => $request->description,
        ]);

         return redirect()->route('smm-facebook.index')->with('success', 'Facebook marketing services created successfully.');
    }

    //Updata a process
    public function update(Request $request, $id)
    {
         $sm_facebook = Sm_Facebook::find($id);

        if (!$sm_facebook) {
            return response()->json(['message' => 'Facebook marketing service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'icon'         =>  'required|string',
            'heading'       => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

         // Update fields
        $sm_facebook->update([
            'icon'        => $request->icon ?? $sm_facebook->icon,
            'heading'     => $request->heading ?? $sm_facebook->heading,
            'description' => $request->description ?? $sm_facebook->description,
        ]);

        return redirect()->route('smm-facebook.index')->with('success', 'Faceboook marketing service updated successfully.');
    }
    

     // Delete a project
    public function destroy($id)
    {
        $sm_facebook = Sm_Facebook::find($id);

        if (!$sm_facebook) 
            {
                return response()->json([
                    'message' => 'Facebook marketing service not found',
                
                ], 404);
            }

        $sm_facebook->delete();

        return redirect()->route('smm-facebook.index')->with('success', 'Facebook marketing service deleted successfully!');
    }
}
