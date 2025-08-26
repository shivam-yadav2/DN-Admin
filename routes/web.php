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
Route::get('/test', function () {
    return Inertia::render('Test');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');
Route::get('/enquiries', [EnquiryController::class, 'index'])->name('enquiries.index');
Route::post('/enquiries', [EnquiryController::class, 'store'])->name('enquiries.store');
Route::delete('/enquiries/{id}', [EnquiryController::class, 'destroy'])->name('enquiries.destroy');
Route::post('/enquiries/{id}', [EnquiryController::class, 'updateStatus'])->name('enquiries.updateStatus');


// Home Page Routes 

Route::resource('hero-videos', HeroController::class)->names('hero');
Route::resource('services', ServiceController::class)->names('service');
Route::resource('subservices', SubServiceController::class)->names('subservice');



Route::get('/technologies', [TechnologyController::class, 'index'])->name('technologies.index');
Route::post('/technologies', [TechnologyController::class, 'store'])->name('technologies.store');
Route::delete('/technologies/{id}', [TechnologyController::class, 'delete'])->name('technologies.delete');
Route::put('/technologies/{id}', [TechnologyController::class, 'update'])->name('technologies.update');

Route::get('/faqs', [FAQController::class, 'index'])->name('faqs.index');
Route::post('/faqs', [FAQController::class, 'store'])->name('faqs.store');
Route::put('/faqs/{id}', [FAQController::class, 'update'])->name('faqs.update');
Route::delete('/faqs/{id}', [FAQController::class, 'destroy'])->name('faqs.destroy');

Route::resource('vision-mission', vision_missioncontroller::class)->names('vision-mission');

Route::resource('career', CareerController::class)->names('career');
Route::resource('blogs', BlogController::class)->names('blogs');
// In web.php
Route::resource('contact-details', ContactDetailController::class);
Route::resource('our-team', our_teamcontroller::class);
Route::resource('home-about', HomeAboutController::class);
Route::resource('creatives', CreativesController::class);
Route::resource('tags', TagController::class);
Route::resource('projects', ProjectController::class);
Route::resource('seo-services', SeoServiceController::class)->names('seo-services');
Route::resource('seo-highlights', SeoHighlightController::class)->names('seo-highlights');
Route::resource('seo-forms', SeoFormController::class)->names('seo-forms');
Route::resource('seo-processes', SeoProcessController::class)->names('seo-processes');
Route::resource('seo-digital', SeoDigitalController::class)->names('seo-digital');
Route::resource('seo-optimization', SeoOptimizationController::class)->names('seo-optimization');
Route::resource('seo-strategy', SeoStrategyController::class)->names('seo-strategy');
Route::resource('dev-commerce', DevCommerceController::class)->names('dev-commerce');
Route::resource('dev-cornerstone', DevCornerstoneController::class);
Route::resource('dev-innovation', DevInnovationController::class);
Route::resource('dev-maintain', DevMaintainController::class);
Route::resource('dev-step', DevStepController::class);
Route::resource('google-campaigns', GoogleCompaignsController::class);
Route::resource('google-ppc', GooglePpcController::class);
Route::resource('google-media', GoogleMediaController::class);
Route::resource('graphics-logo', GraphicsLogoController::class);
Route::resource('smm-facebook', SmmFacebookController::class);
Route::resource('smm-benefit', SmmBenefitController::class);
// Package Routes
    Route::resource('packages', packageController::class);
    
    // Package Feature Routes
    Route::resource('package-features', PackageFeatureController::class);
Route::resource('smm-youtube', SmmYoutubeController::class);

Route::resource('social-service', SocialServiceController::class);

});



require __DIR__ . "/auth.php";