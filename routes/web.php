<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
 use App\Models\Service;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\SubServiceController;
use App\Http\Controllers\Api\TechnologyController;
use App\Http\Controllers\API\FAQController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\vision_missioncontroller;
use App\Http\Controllers\API\CareerController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\ContactDetailController;
use App\Http\Controllers\Api\our_teamcontroller;
use App\Http\Controllers\API\HomeAboutController;
use App\Http\Controllers\API\CreativesController;

Route::get('/test', function () {
    return Inertia::render('Test');
});

Route::get('/services', [ServiceController::class, 'index'])->name('services');

Route::post('/services', [ServiceController::class, 'store'])->name('services.store');

Route::post('/subservices', [SubServiceController::class, 'store'])->name('subservices.store');

Route::post('/services/{id}', [ServiceController::class, 'update'])->name('services.update');

Route::post('/services/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');

Route::get('/', function () {
    return Inertia::render('Admin/Dashboard');
})->name('dashboard');
Route::get('/enquiries', [EnquiryController::class, 'index'])->name('enquiries.index');
Route::post('/enquiries', [EnquiryController::class, 'store'])->name('enquiries.store');
Route::delete('/enquiries/{id}', [EnquiryController::class, 'destroy'])->name('enquiries.destroy');
Route::post('/enquiries/{id}', [EnquiryController::class, 'updateStatus'])->name('enquiries.updateStatus');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Home Page Routes 

Route::resource('hero-videos', HeroController::class)->names('hero');

// Route::get('/home_hero', function () {
//     return Inertia::render('Admin/HomePage/Hero');
// });

// Route::get('/home_toolsandtechnologies', function () {
//     return Inertia::render('Admin/HomePage/ToolsPage');
// });

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

require __DIR__.'/auth.php';