<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Career;
use App\Models\ContactDetail;
use App\Models\Creative;
USE App\Models\Enquiry;
use App\Models\FAQ;
USE App\Models\Hero;
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
    //
    public function index()
    {
        $blogs               = Blog           ::  all();
        $careers             = Career         :: all();
        $ContactDetails      = ContactDetail  :: all();
        $creatives           = Creative       :: all();
        $enquiries           = Enquiry        :: all();
        $faqs                = FAQ            :: all();
        $hero                = Hero           :: all();
        $homeAbout           = HomeAbout      :: all();
        $ourTeams            = our_team       :: all();
        $packages            = packages        :: all();
        $projects            = Project        :: all();
        $services            = Service        :: all();
        $subServices         = SubService     :: all();
        $tags                = Tag            :: all();
        $technologies        = Technology     :: all();
        $visionMissions      = vision_mission :: all();

        return response()->json([
            'message' => 'Data retrieved successfully',
            'status' => 'success',
            'data' => [
                'blogs'              => $blogs,
                'careers'            => $careers,
                'contact_details'    => $ContactDetails,
                'creatives'          => $creatives,
                'enquiries'          => $enquiries,
                'faqs'               => $faqs,
                'hero'               => $hero,
                'homeAbout'          => $homeAbout,
                'ourTeams'           => $ourTeams,
                'packages'           => $packages,
                'projects'           => $projects,
                'services'           => $services,
                'subservices'        => $subServices,
                'tags'               => $tags,
                'technologies'       => $technologies,
                'vision_missions'    => $visionMissions,
            ]
        ], 200);
    }
}
