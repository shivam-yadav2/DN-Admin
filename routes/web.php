<?php

use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
 use App\Models\Service;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\SubServiceController;
use App\Http\Controllers\Api\TechnologyController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\vision_missioncontroller;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactDetailController;
use App\Http\Controllers\Api\our_teamcontroller;
use App\Http\Controllers\Api\HomeAboutController;
use App\Http\Controllers\Api\CreativesController;
use App\Http\Controllers\Api\packagecontroller;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SeoServiceController;
use App\Http\Controllers\Api\SeoHighlightController;
use App\Http\Controllers\Api\SeoFormController;
use App\Http\Controllers\Api\SeoProcessController;
use App\Http\Controllers\Api\SeoDigitalController;
use App\Http\Controllers\Api\SeoOptimizationController;
use App\Http\Controllers\Api\SeoStrategyController;
use App\Http\Controllers\Api\DevCommerceController;
use App\Http\Controllers\Api\DevCornerstoneController;
use App\Http\Controllers\Api\DevInnovationController;
use App\Http\Controllers\Api\DevMaintainController;
use App\Http\Controllers\Api\DevStepController;
use App\Http\Controllers\Api\GoogleCompaignsController;
use App\Http\Controllers\Api\GooglePpcController;
use App\Http\Controllers\Api\GoogleMediaController;
use App\Http\Controllers\Api\GraphicsLogoController;
use App\Http\Controllers\Api\SmmBenefitController;
use App\Http\Controllers\Api\SmmFacebookController;
use App\Http\Controllers\Api\SmmYoutubeController;
use App\Http\Controllers\Api\SocialServiceController;
use App\Http\Controllers\Api\PackageFeatureController;
use App\Http\Controllers\AdminController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RevokePermissionController;


Route::get('/test', function () {
    return Inertia::render('Test');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');
Route::get('/enquiries', [EnquiryController::class, 'index'])->name('enquiries.index')->middleware(['role:admin|writer']);
Route::post('/enquiries', [EnquiryController::class, 'store'])->name('enquiries.store');
Route::delete('/enquiries/{id}', [EnquiryController::class, 'destroy'])->name('enquiries.destroy');
Route::post('/enquiries/{id}', [EnquiryController::class, 'updateStatus'])->name('enquiries.updateStatus');


// Home Page Routes 

Route::resource('hero-videos', HeroController::class)->names('hero')->middleware(['role:admin|home_manager']);
Route::resource('services', ServiceController::class)->names('service')->middleware(['role:admin']);
Route::resource('subservices', SubServiceController::class)->names('subservice')->middleware(['role:admin']);



Route::get('/technologies', [TechnologyController::class, 'index'])->name('technologies.index')->middleware(['role:admin|home_manager']);
Route::post('/technologies', [TechnologyController::class, 'store'])->name('technologies.store');
Route::delete('/technologies/{id}', [TechnologyController::class, 'delete'])->name('technologies.delete');
Route::put('/technologies/{id}', [TechnologyController::class, 'update'])->name('technologies.update');

Route::get('/faqs', [FAQController::class, 'index'])->name('faqs.index')->middleware(['role:admin|home_manager']);;
Route::post('/faqs', [FAQController::class, 'store'])->name('faqs.store');
Route::put('/faqs/{id}', [FAQController::class, 'update'])->name('faqs.update');
Route::delete('/faqs/{id}', [FAQController::class, 'destroy'])->name('faqs.destroy');

Route::resource('vision-mission', vision_missioncontroller::class)->names('vision-mission')->middleware(['role:admin|home_manager']);;

Route::resource('career', CareerController::class)->names('career')->middleware(['role:admin']);;

// In web.php
Route::resource('contact-details', ContactDetailController::class)->middleware(['role:admin']);;
Route::resource('our-team', our_teamcontroller::class)->middleware(['role:admin']);;
Route::resource('home-about', HomeAboutController::class)->middleware(['role:admin|home_manager']);
Route::resource('creatives', CreativesController::class)->middleware(['role:admin|design_manager']);
Route::resource('tags', TagController::class)->middleware(['role:admin|seo_manager']);
Route::resource('projects', ProjectController::class)->middleware(['role:admin|dev_manager']);
Route::resource('seo-services', SeoServiceController::class)->names('seo-services')->middleware(['role:admin|seo_manager']);
Route::resource('seo-highlights', SeoHighlightController::class)->names('seo-highlights')->middleware(['role:admin|seo_manager']);
Route::resource('seo-forms', SeoFormController::class)->names('seo-forms')->middleware(['role:admin|seo_manager']);
Route::resource('seo-processes', SeoProcessController::class)->names('seo-processes')->middleware(['role:admin|seo_manager']);
Route::resource('seo-digital', SeoDigitalController::class)->names('seo-digital')->middleware(['role:admin|seo_manager']);
Route::resource('seo-optimization', SeoOptimizationController::class)->names('seo-optimization')->middleware(['role:admin|seo_manager']);
Route::resource('seo-strategy', SeoStrategyController::class)->names('seo-strategy')->middleware(['role:admin|seo_manager']);
Route::resource('dev-commerce', DevCommerceController::class)->names('dev-commerce')->middleware(['role:admin|dev_manager']);
Route::resource('dev-cornerstone', DevCornerstoneController::class)->middleware(['role:admin|dev_manager']);
Route::resource('dev-innovation', DevInnovationController::class)->middleware(['role:admin|dev_manager']);
Route::resource('dev-maintain', DevMaintainController::class)->middleware(['role:admin|dev_manager']);
Route::resource('dev-step', DevStepController::class)->middleware(['role:admin|dev_manager']);
Route::resource('google-campaigns', GoogleCompaignsController::class)->middleware(['role:admin|google_manager']);
Route::resource('google-ppc', GooglePpcController::class)->middleware(['role:admin|google_manager']);
Route::resource('google-media', GoogleMediaController::class)->middleware(['role:admin|google_manager']);
Route::resource('graphics-logo', GraphicsLogoController::class)->middleware(['role:admin|google_manager']);
Route::resource('smm-facebook', SmmFacebookController::class)->middleware(['role:admin|social_manager']);
Route::resource('smm-benefit', SmmBenefitController::class)->middleware(['role:admin|social_manager']);
// Package Routes
    Route::resource('packages', packageController::class)->middleware(['role:admin']);
    
    // Package Feature Routes
    Route::resource('package-features', PackageFeatureController::class)->middleware(['role:admin']);
Route::resource('smm-youtube', SmmYoutubeController::class)->middleware(['role:admin|social_manager']);

Route::resource('social-service', SocialServiceController::class)->middleware(['role:admin|social_manager']);

});

Route::middleware(['auth' , 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::resource('/users', UserController::class);
// Route::resource('/roles', RoleController::class);
Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
Route::get('/roles/{id}', [RoleController::class, 'show'])->name('roles.show');
Route::get('/roles/{id}/edit', [RoleController::class, 'edit'])->name('roles.edit');
Route::put('/roles/{id}', [RoleController::class, 'update'])->name('roles.update');
Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->name('roles.destroy');
Route::resource('/permissions', PermissionController::class);

Route::delete('/roles/{role}/permission/{permission}',[RevokePermissionController::class ,'revoke']);
});

Route::resource('blogs', BlogController::class)->names('blogs')->middleware(['role:admin|writer']);



require __DIR__ . "/auth.php";