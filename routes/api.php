<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\SubServiceController;
use App\Http\Controllers\API\EnquiryController;
use App\Http\Controllers\API\HomeAboutController;
use App\Http\Controllers\API\CreativesController;
use App\Http\Controllers\API\FAQController;
use App\Http\Controllers\API\HeroController;
use App\Http\Controllers\API\CareerController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\ContactDetailController;
use App\Http\Controllers\api\our_teamcontroller;
use App\Http\Controllers\api\packagecontroller;
use App\Http\Controllers\api\vision_missioncontroller;
use App\Http\Controllers\API\TechnologyController;
use App\Http\Controllers\API\TagController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ApiController;
use App\Http\Controllers\API\SeoHighlightController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\API\SeoFormController;                                                                                                                                                                                                                                                                                                                                                                            


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Sample API route
Route::get('/test', function () {
    return response()->json(['message' => 'API working']);
});

// Service routes
Route::get('/get_service', [ServiceController::class, 'index']);
Route::post('/post_service', [ServiceController::class, 'store']);
Route::post('/update_service/{id}', [ServiceController::class, 'update']);
Route::delete('/delete_service/{id}', [ServiceController::class, 'destroy']);

// SubService routes
Route::get('/get_subservice', [SubServiceController::class, 'index']);
Route::post('/post_subservice', [SubServiceController::class, 'store']);
Route::get('/get_subserviceId/{serviceId}', [SubServiceController::class, 'getByServiceId']);
Route::delete('/delete_subservice/{id}', [SubServiceController::class, 'destroy']);

// Enquiry routes
Route::get('/get_enquiry', [EnquiryController::class, 'index']);
Route::post('/post_enquiry', [EnquiryController::class, 'store']);
Route::delete('/delete_enquiry/{id}', [EnquiryController::class, 'destroy']);
Route::put('/update_enquiryStatus/{id}', [EnquiryController::class, 'updateStaus']);

// Vision and Mission routes
Route::post('add-vision',[vision_missioncontroller::class,'store']);
Route::get('show-vision',[vision_missioncontroller::class,'show']);
Route::post('/updatevision/{id}',[vision_missioncontroller::class,'updatevision']);
Route::delete('/deletevision/{id}',[vision_missioncontroller::class,'deletevision']);

// Technology routes
Route::get('/get_technology', [TechnologyController::class, 'index']);
Route::post('/post_technology', [TechnologyController::class, 'store']);
Route::post('/update_technology/{id}', [TechnologyController::class, 'update']);
Route::delete('/delete_technology/{id}', [TechnologyController::class, 'delete']);

// HomeAbout routes
Route::get('/get_home_about', [HomeAboutController::class, 'index']);
Route::post('/post_home_about', [HomeAboutController::class, 'store']);
Route::post('/update_home_about/{id}', [HomeAboutController::class, 'update']);
Route::delete('/delete_home_about/{id}', [HomeAboutController::class, 'destroy']);

// Creatives routes
Route::get('/get_creatives', [CreativesController::class, 'index']);
Route::post('/post_creatives', [CreativesController::class, 'store']);
Route::delete('/delete_creatives/{id}', [CreativesController::class, 'destroy']);

// FAQ routes
Route::get('/get_faq', [FAQController::class, 'index']);
Route::post('/post_faq', [FAQController::class, 'store']);
Route::put('/update_faq/{id}', [FAQController::class, 'update']);
Route::delete('/delete_faq/{id}', [FAQController::class, 'destroy']);

//Hero Routes
Route::get('/get_hero', [HeroController::class, 'index']);
Route::post('/post_hero', [HeroController::class, 'store']);
Route::put('/update_hero/{id}', [HeroController::class, 'update']);
Route::delete('/delete_hero/{id}', [HeroController::class, 'destroy']);

//Career Routes
Route::get('/get_career', [CareerController::class, 'index']);
Route::post('/post_career', [CareerController::class, 'store']);
Route::put('/update_career/{id}', [CareerController::class, 'update']);
Route::delete('/delete_career/{id}', [CareerController::class, 'destroy']);

//Our Team routes
Route::post('insert',[our_teamcontroller::class,'store']);
Route::delete('delete_ourteam/{id}',[our_teamcontroller::class,'delete_ourteam']);
Route::post('update_ourteam/{id}',[our_teamcontroller::class,'update_ourteam']);
Route::get('show_ourteam',[our_teamcontroller::class,'show_ourteam']);

//Package Routes
Route::post('insert_package', [packagecontroller::class,'insert_package']);
Route::post('update_package/{id}', [packagecontroller::class,'update_package']);
Route::get('show_package', [packagecontroller::class,'show_package']);
Route::delete('delete_package/{id}', [packagecontroller::class,'delete_package']);

//Blog Routes
Route::get('/get_blog', [BlogController::class, 'index']);
Route::post('/post_blog', [BlogController::class, 'store']);
Route::post('/update_blog/{id}', [BlogController::class, 'update']);
Route::delete('/delete_blog/{id}', [BlogController::class, 'destroy']);

//Contact Detail Routes
Route::get('/get_contact', [ContactDetailController::class, 'index']);
Route::post('/post_contact', [ContactDetailController::class, 'store']);
Route::post('/update_contact/{id}', [ContactDetailController::class, 'update']);
Route::delete('/delete_contact/{id}', [ContactDetailController::class, 'destroy']);

//Tag Routes
Route::get('/get_tag', [TagController::class, 'index']);
Route::post('/post_tag', [TagController::class, 'store']);
Route::post('/update_tag/{id}', [TagController::class, 'update']);
Route::delete('/delete_tag/{id}', [TagController::class, 'destroy']);

// Project Routes
Route::get('/get_project', [ProjectController::class, 'index']);
Route::post('/post_project', [ProjectController::class, 'store']);
Route::post('/update_project/{id}', [ProjectController::class, 'update']);
Route::delete('/delete_project/{id}', [ProjectController::class, 'destroy']);



//Frontend API Route
Route::get('getblog',[ApiController::class,'getblog']);
Route::get('getcareer', [ApiController::class, 'getcareer']);
Route::get('getcontactdetail', [ApiController::class, 'getcontactdetail']);
Route::get('getcreatives', [ApiController::class, 'getcreatives']);
Route::get('getourteam', [ApiController::class, 'getourteam']);
Route::get('getpackage', [ApiController::class, 'getpackage']);
Route::get('getfaq', [ApiController::class, 'getfaq']);
Route::get('gethero', [ApiController::class, 'gethero']);
Route::get('getproject', [ApiController::class, 'getproject']);
Route::get('gettag', [ApiController::class, 'gettag']);
Route::get('gettechnlogies', [ApiController::class, 'gettechnlogies']);
Route::get('getvision_mission', [ApiController::class, 'getvision_mission']);
Route::get('gethomeabout', [ApiController::class, 'gethomeabout']);
// Route::get('getservice', [ApiController::class, 'getservice']);
Route::get('getsubservice', [ApiController::class, 'getsubservice']);
Route::get('careerdetail/{id}', [ApiController::class, 'careerdetail']);
Route::get('blogdetail/{id}', [ApiController::class, 'getblogdetail']);


