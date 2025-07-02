<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\SubServiceController;
use APP\Http\Controllers\API\EnquiryController;

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

// SubService routes
Route::get('/get_subservice', [SubServiceController::class, 'index']);
Route::post('/post_subservice', [SubServiceController::class, 'store']);
Route::get('/get_subserviceId/{serviceId}', [SubServiceController::class, 'getByServiceId']);

// Enquiry routes
Route::get('/get_enquiry', [App\Http\Controllers\API\EnquiryController::class, 'index']);
Route::post('/post_enquiry', [App\Http\Controllers\API\EnquiryController::class, 'store']);


