<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Career;
use App\Models\ContactDetail;
use App\Models\Creative;
use App\Models\Enquiry;
use App\Models\FAQ;
use App\Models\Hero;
use App\Models\HomeAbout;
use App\Models\our_team;
use App\Models\packages;
use App\Models\Project;
use App\Models\Service;
use App\Models\SubService;
use App\Models\Tag;
use App\Models\Technology;
use App\Models\vision_mission;

class ApiController extends Controller
{
    public function getblog()
    {
         $blogs = Blog::all();
         return response()->json($blogs, 200);

//  return Inertia::render('Admin/Other/Blog', [
//             'blogs' => $blogs,
//         ]);
    }

    // get blog by id
    public function getblogbyid(Request $request)
    {
        $url = $request->url;
         $blogs = Blog::where('url', $url)->first();
         return response()->json([
            'data'=>$blogs,
            'msg'=>"Getting data successfully",
         ]);

    }

    public function getcareer()
    {
        $careers = Career::all();
        return response()->json([
            'data'=>$careers,
            'msg'=>"Data get successfully",
        ]);
        
    }


    public function getcontactdetail()
    {
        $contactDetails = ContactDetail::all();
         return response()->json([
            'data'=>$contactDetails,
            'msg'=>"Getting data successfully",
         ]);
       
    }

    public function getcreatives()
    {
        $creatives = Creative::all();
        
        return response()->json([
            'data'=>$creatives,
            'msg'=>'getting data successfully',
        ]);
    }

    public function getourteam()
    {
        $data = our_team::all();
        return response()->json([
            'data'=>$data,
            'msg'=>'getting data successfully',
        ]);
    }

    public function getpackage()
    {
        $show = packages::all();
          return response()->json([
            'data'=>$show,
            'msg'=>"getting  data successfully",
          ]);
    }


    public function getfaq()
    {
        $faqs = FAQ::all();
        return response()->json([
            'data'=>$faqs,
            'msg'=>"getting data successfully",
        ]);
    }

    public function gethero()
    {
        $heroes = Hero::all();
        // return response()->json($heros, 200);
    return response()->json([
        'data'=>$heroes,
        'msg'=>"getting data successfully",
    ]);
       
    }

    public function getproject()
    {
        $projects = Project::all();
        
       return response()->json([
        'data'=>$projects,
        'msg'=>'getting  data successfully',
       ]);
    }

    public function gettag()
    {
        $tags = Tag::all();
      return response()->json([
        'data'=>$tags,
        'msg'=>"getting data successfully",
      ]);
    }
  
    public function gettechnlogies()
    {
        $technologies = technology::all();
        return response()->json([
            'data'=>$technologies,
            'msg'=>"Getting data successfully",
        ]);
     
    }


    public function getvision_mission()
    {
        $visions = vision_mission::all();
       return response()->json([
        'data'=>$visions,
        'msg'=>"Getting data successfully",
       ]);
    }

    public function gethomeabout()
    {
        $homeAbouts = HomeAbout::all();
        return response()->json([
            'data'=>$homeAbouts,
            'msg'=>'Getting data successfully',
        ]);
        
    }

    public function getsubservice()
    {
        $subServices = SubService::with('service')->get()->map(function ($subService) {
            return [
                'id' => $subService->id,
                'service_id' => $subService->service_id,
                'name' => $subService->name,
                'description' => $subService->description,
                'image' => asset('assets/images/subservices/' . $subService->image), // Assuming image is stored in public/assets/images/subservices
            ];
        });

    return response()->json([
        'data'=>$subServices,
        'msg'=>"Getting data successfully",
    ]);
}

public function careerdetail($id){
        $careerdetail=Career::find($id);
         return response()->json([
            'data'=>$careerdetail,
            'msg'=>"Getting data successfully",
         ]);


}

public function getblogdetail(Request $request){
    $url = $request->query('url');
    $blogdetail=Blog::where('url',$url)->first();
    return response()->json([
        'data'=> $blogdetail,
        'msg'=>"Getting data successfully",
    ]);
}

} 
