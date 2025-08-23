<?php

use App\Http\Controllers\API\GoogleCompaignsController;
use App\Http\Controllers\API\GooglePpcController;
use App\Http\Controllers\API\GraphicsLogoController;
use App\Http\Controllers\API\SocialServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SubServiceController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\HomeAboutController;
use App\Http\Controllers\Api\CreativesController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactDetailController;
use App\Http\Controllers\Api\our_teamcontroller;
use App\Http\Controllers\Api\vision_missioncontroller;
use App\Http\Controllers\Api\TechnologyController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\SeoHighlightController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SeoFormController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SeoServiceController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SeoProcessController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SeoOptimizationController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SeoStrategyController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SeoDigitalController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\DevCornerstoneController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\DevStepController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\DevCommerceController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\DevInnovationController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\DevMaintainController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\GoogleMediaController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SmmFacebookController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SmmYoutubeController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\SmmBenefitController;                                                                                                                                                                                                                                                                                                                                                                            
use App\Http\Controllers\Api\PackageController;                                                                                                                                                                                                                                                                                                                                                                        
use App\Http\Controllers\Api\PackageFeatureController;                                                                                                                                                                                                                                                                                                                                                                            


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
// Route::post('add-vision',[vision_missioncontroller::class,'store']);
// Route::get('show-vision',[vision_missioncontroller::class,'show']);
// Route::post('/updatevision/{id}',[vision_missioncontroller::class,'updatevision']);
// Route::delete('/deletevision/{id}',[vision_missioncontroller::class,'deletevision']);

// Technology routes
// Route::get('/get_technology', [TechnologyController::class, 'index']);
// Route::post('/post_technology', [TechnologyController::class, 'store']);
// Route::post('/update_technology/{id}', [TechnologyController::class, 'update']);
// Route::delete('/delete_technology/{id}', [TechnologyController::class, 'delete']);

// HomeAbout routes
// Route::get('/get_home_about', [HomeAboutController::class, 'index']);
// Route::post('/post_home_about', [HomeAboutController::class, 'store']);
// Route::post('/update_home_about/{id}', [HomeAboutController::class, 'update']);
// Route::delete('/delete_home_about/{id}', [HomeAboutController::class, 'destroy']);

// Creatives routes
//  Route::get('/get_creatives', [CreativesController::class, 'index']);
// Route::post('/post_creatives', [CreativesController::class, 'store']);
// Route::delete('/delete_creatives/{id}', [CreativesController::class, 'destroy']);

// FAQ routes
// Route::get('/get_faq', [FAQController::class, 'index']);
// Route::post('/post_faq', [FAQController::class, 'store']);
// Route::put('/update_faq/{id}', [FAQController::class, 'update']);
// Route::delete('/delete_faq/{id}', [FAQController::class, 'destroy']);

//Hero Routes
// Route::get('/get_hero', [HeroController::class, 'index']);
// Route::post('/post_hero', [HeroController::class, 'store']);
// Route::put('/update_hero/{id}', [HeroController::class, 'update']);
// Route::delete('/delete_hero/{id}', [HeroController::class, 'destroy']);

//Career Routes
// Route::get('/get_career', [CareerController::class, 'index']);
// Route::post('/post_career', [CareerController::class, 'store']);
// Route::put('/update_career/{id}', [CareerController::class, 'update']);
// Route::delete('/delete_career/{id}', [CareerController::class, 'destroy']);

//Our Team routes
// Route::post('insert',[our_teamcontroller::class,'store']);
// Route::delete('delete_ourteam/{id}',[our_teamcontroller::class,'delete']);
// Route::post('update_ourteam/{id}',[our_teamcontroller::class,'update']);
// Route::get('show_ourteam',[our_teamcontroller::class,'index']);

//Blog Routes
     Route::get('/get_blog', [BlogController::class, 'index']);
Route::post('/post_blog', [BlogController::class, 'store']);
Route::post('/update_blog/{id}', [BlogController::class, 'update']);
Route::delete('/delete_blog/{id}', [BlogController::class, 'destroy']);

//Contact Detail Routes
// Route::get('/get_contact', [ContactDetailController::class, 'index']);
// Route::post('/post_contact', [ContactDetailController::class, 'store']);
// Route::post('/update_contact/{id}', [ContactDetailController::class, 'update']);
// Route::delete('/delete_contact/{id}', [ContactDetailController::class, 'destroy']);

//Tag Routes
// Route::get('/get_tag', [TagController::class, 'index']);
// Route::post('/post_tag', [TagController::class, 'store']);
// Route::post('/update_tag/{id}', [TagController::class, 'update']);
// Route::delete('/delete_tag/{id}', [TagController::class, 'destroy']);

// Project Routes
// Route::get('/get_project', [ProjectController::class, 'index']);
// Route::post('/post_project', [ProjectController::class, 'store']);
// Route::post('/update_project/{id}', [ProjectController::class, 'update']);
// Route::delete('/delete_project/{id}', [ProjectController::class, 'destroy']);

//Frontend API Route
Route::get('getblog',[ApiController::class,'getblog']);
Route::get('blogdetail',[ApiController::class,'getblogbyid']);
Route::get('getcareer', [ApiController::class, 'getcareer']);
Route::get('getcontactdetail', [ApiController::class, 'getcontactdetail']);
Route::get('getcreatives', [ApiController::class, 'getcreatives']);
Route::get('getourteam', [ApiController::class, 'getourteam']);
Route::get('getpackage', [ApiController::class, 'getpackage']);
Route::get('getfaq', [ApiController::class, 'getfaq']);
Route::get('gethero', [ApiController::class, 'gethero']);
Route::get('getproject', [ApiController::class, 'index_project']);
Route::get('gettag', [ApiController::class, 'gettag']);
Route::get('gettechnlogies', [ApiController::class, 'gettechnlogies']);
Route::get('getvision_mission', [ApiController::class, 'getvision_mission']);
Route::get('gethomeabout', [ApiController::class, 'gethomeabout']);
Route::get('get_service', [ApiController::class, 'get_service']);
Route::get('getsubservice', [ApiController::class, 'getsubservice']);
Route::get('careerdetail/{id}', [ApiController::class, 'careerdetail']);
Route::get('blogdetail', [ApiController::class, 'getblogdetail']);
Route::get('getseohighlight', [ApiController::class, 'seohighlight']);
Route::get('getseoform', [ApiController::class, 'seoform']);
Route::get('getseoservice', [ApiController::class, 'seoservice']);
Route::get('getseoprocess', [ApiController::class, 'seoprocess']);
Route::get('getseo_optimization', [ApiController::class, 'seo_optimization']);
Route::get('getseostrategy', [ApiController::class, 'seo_strategy']);
Route::get('getseodigital', [ApiController::class, 'seo_digital']);
Route::get('get_index', [ApiController::class, 'index_project']);
Route::get('getdev_cornerstone', [ApiController::class, 'dev_cornerstone']);
Route::get('getdevstep', [ApiController::class, 'dev_step']);
Route::get('getdev_commerce', [ApiController::class, 'dev_commere']);
Route::get('getdev_maintain', [ApiController::class, 'dev_maintain']);
Route::get('getdev_innovation', [ApiController::class, 'dev_innovation']);
Route::get('getsmmbenefit', [ApiController::class, 'smm_benefit']);
Route::get('getsmmyoutube', [ApiController::class, 'smm_youtube']);
Route::get('getsmmfacebook', [ApiController::class, 'smm_facebook']);
Route::get('getpackage', [ApiController::class, 'package']);

//Seo Highlight Routes
Route::get('/get_seo', [SeoHighlightController::class, 'index']);
Route::post('/post_seo', [SeoHighlightController::class, 'store']);
Route::post('/update_seo/{id}', [SeoHighlightController::class, 'update']);
Route::delete('delete_seo/{id}', [SeoHighlightController::class, 'destroy']);

//Seo Form Routes
Route::get('/get_seoform', [SeoFormController::class, 'index']);
Route::post('/post_seoform', [SeoFormController::class, 'store']);
Route::post('/update_seoform/{id}', [SeoFormController::class, 'update']);

//Seo Service Routes
Route::get('/get_seoservice', [SeoServiceController::class, 'index']);
Route::post('/post_seoservice', [SeoServiceController::class, 'store']);
Route::post('/update_seoservice/{id}', [SeoServiceController::class, 'update']);
Route::delete('delete_seoservice/{id}', [SeoServiceController::class, 'destroy']);

//Seo Process Routes
Route::get('/get_seoprocess', [SeoProcessController::class, 'index']);
Route::post('/post_seoprocess', [SeoProcessController::class, 'store']);
Route::post('/update_seoprocess/{id}', [SeoProcessController::class, 'update']);
Route::delete('delete_seoprocess/{id}', [SeoProcessController::class, 'destroy']);

//Seo Optimization Routes
Route::get('/get_seo_optimization', [SeoOptimizationController::class, 'index']);
Route::post('/post_seo_optimization', [SeoOptimizationController::class, 'store']);
Route::post('/update_seo_optimization/{id}', [SeoOptimizationController::class, 'update']);
Route::delete('delete_seo_optimization/{id}', [SeoOptimizationController::class, 'destroy']);

//Seo Strategy Routes
Route::get('/get_seostrategy', [SeoStrategyController::class, 'index']);
Route::post('/post_seostrategy', [SeoStrategyController::class, 'store']);
Route::post('/update_seostrategy/{id}', [SeoStrategyController::class, 'update']);
Route::delete('delete_seostrategy/{id}', [SeoStrategyController::class, 'destroy']);

//Seo Digital Routes
Route::get('/get_seodigital', [SeoDigitalController::class, 'index']);
Route::post('/post_seodigital', [SeoDigitalController::class, 'store']);
Route::post('/update_seodigital/{id}', [SeoDigitalController::class, 'update']);
Route::delete('delete_seodigital/{id}', [SeoDigitalController::class, 'destroy']);

//Development Cornerstones Routes
Route::get('/get_devcornerstone', [DevCornerstoneController::class, 'index']);
Route::post('/post_devcornerstone', [DevCornerstoneController::class, 'store']);
Route::post('/update_devcornerstone/{id}', [DevCornerstoneController::class, 'update']);
Route::delete('delete_devcornerstone/{id}', [DevCornerstoneController::class, 'destroy']);

//Development Steps Routes
Route::get('/get_devstep', [DevStepController::class, 'index']);
Route::post('/post_devstep', [DevStepController::class, 'store']);
Route::post('/update_devstep/{id}', [DevStepController::class, 'update']);
Route::delete('delete_devstep/{id}', [DevStepController::class, 'destroy']);

//Development Commerce Routes
Route::get('/get_devcommerce', [DevCommerceController::class, 'index']);
Route::post('/post_devcommerce', [DevCommerceController::class, 'store']);
Route::post('/update_devcommerce/{id}', [DevCommerceController::class, 'update']);
Route::delete('delete_devcommerce/{id}', [DevCommerceController::class, 'destroy']);

//Development Innovation Routes
Route::get('/get_devinnovation', [DevInnovationController::class, 'index']);
Route::post('/post_devinnovation', [DevInnovationController::class, 'store']);
Route::post('/update_devinnovation/{id}', [DevInnovationController::class, 'update']);
Route::delete('delete_devinnovation/{id}', [DevInnovationController::class, 'destroy']);

//Development Maintain Routes
Route::get('/get_devmaintain', [DevMaintainController::class, 'index']);
Route::post('/post_devmaintain', [DevMaintainController::class, 'store']);
Route::post('/update_devmaintain/{id}', [DevMaintainController::class, 'update']);
Route::delete('delete_devmaintain/{id}', [DevMaintainController::class, 'destroy']);

//SMM Facebook Routes
Route::get('/get_smmfacebook', [SmmFacebookController::class, 'index']);
Route::post('/post_smmfacebook', [SmmFacebookController::class, 'store']);
Route::post('/update_smmfacebook/{id}', [SmmFacebookController::class, 'update']);
Route::delete('delete_smmfacebook/{id}', [SmmFacebookController::class, 'destroy']);

//SMM Youtube Routes
Route::get('/get_smmyoutube', [SmmYoutubeController::class, 'index']);
Route::post('/post_smmyoutube', [SmmYoutubeController::class, 'store']);
Route::post('/update_smmyoutube/{id}', [SmmYoutubeController::class, 'update']);
Route::delete('delete_smmyoutube/{id}', [SmmYoutubeController::class, 'destroy']);

//SMM Benefits Routes
Route::get('/get_smmbenefit', [SmmBenefitController::class, 'index']);
Route::post('/post_smmbenefit', [SmmBenefitController::class, 'store']);
Route::post('/update_smmbenefit/{id}', [SmmBenefitController::class, 'update']);
Route::delete('delete_smmbenefit/{id}', [SmmBenefitController::class, 'destroy']);

// GoogleMediaController route
Route::post('store',[GoogleMediaController::class,'store']);
Route::get('index',[GoogleMediaController::class,'index']);
Route::delete('destroy/{id}',[GoogleMediaController::class,'destroy']);
Route::post('update/{id}',[GoogleMediaController::class,'update']);


// GoogleCompaignsCOntroller routes
Route::post('store',[GoogleCompaignsController::class,'store']);
Route::get('index',[GoogleCompaignsController::class,'index']);
Route::delete('destroy/{id}',[GoogleCompaignsController::class,'destroy']);
Route::post('update/{id}',[GoogleCompaignsController::class,'update']);


// GooglePPCController routes
Route::post('store',[GooglePpcController::class,'store']);
Route::get('index',[GooglePpcController::class,'index']);
Route::delete('destroy/{id}',[GooglePpcController::class,'destroy']);
Route::post('update/{id}',[GooglePpcController::class,'update']);

 
//  GraphicsLogoController routes
Route::post('store',[GraphicsLogoController::class,'store']);
Route::get('index',[GraphicsLogoController::class,'index']);
Route::delete('destroy/{id}',[GraphicsLogoController::class,'destroy']);
Route::post('update/{id}',[GraphicsLogoController::class,'update']);


//  SocialServiceController routes
Route::post('store',[SocialServiceController::class,'store']);
Route::get('index',[SocialServiceController::class,'index']);
Route::delete('destroy/{id}',[SocialServiceController::class,'destroy']);
Route::post('update/{id}',[SocialServiceController::class,'update']);

//Package Routes
Route::get('get_package', [PackageController::class, 'index']);      // List all packages
Route::post('post_package', [PackageController::class, 'store']);     // Create a package
Route::get('show_package/{id}', [PackageController::class, 'show']);    // Show single package
Route::post('update_package/{id}', [PackageController::class, 'update']);  // Update package
Route::delete('delete_package/{id}', [PackageController::class, 'destroy']); // Delete package


//Package Feature
Route::get('get_packagefeature', [PackageFeatureController::class, 'index']);       // List all features
Route::post('post_packagefeature', [PackageFeatureController::class, 'store']);      // Create a feature
Route::get('show_packagefeature/{id}', [PackageFeatureController::class, 'show']);     // Show single feature
Route::post('update_packagefeature/{id}', [PackageFeatureController::class, 'update']);   // Update feature
Route::delete('delete_packagefeature/{id}', [PackageFeatureController::class, 'destroy']); // Delete feature
