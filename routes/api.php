<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\SubServiceController;
use App\Http\Controllers\API\EnquiryController;
use App\Http\Controllers\API\HomeAboutController;
use App\Http\Controllers\API\CreativesController;
use App\Http\Controllers\API\FAQController;

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

// HomeAbout routes
Route::get('/get_home_about', [HomeAboutController::class, 'index']);
Route::post('/post_home_about', [HomeAboutController::class, 'store']);
Route::put('/update_home_about/{id}', [HomeAboutController::class, 'update']);
Route::delete('/delete_home_about/{id}', [HomeAboutController::class, 'destroy']);

// Creatives routes
Route::get('/get_creatives', [CreativesController::class, 'index']);
Route::post('/post_creatives', [CreativesController::class, 'store']);
Route::delete('/delete_creatives/{id}', [CreativesController::class, 'destroy']);
Route::put('/update_creatives/{id}', [CreativesController::class, 'update']);

// FAQ routes
Route::get('/get_faq', [FAQController::class, 'index']);
Route::post('/post_faq', [FAQController::class, 'store']);
Route::put('/update_faq/{id}', [FAQController::class, 'update']);
Route::delete('/delete_faq/{id}', [FAQController::class, 'destroy']);




