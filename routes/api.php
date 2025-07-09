<?php

use App\Http\Controllers\api\vision_missioncontroller;
use App\Http\Controllers\API\TechnologyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\SubServiceController;
use App\Http\Controllers\API\EnquiryController;

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
Route::post('add-vision',[vision_missioncontroller::class,'store']);
Route::get('show-vision',[vision_missioncontroller::class,'show']);
Route::put('/updatevision/{id}',[vision_missioncontroller::class,'updatevision']);
Route::delete('/deletevision/{id}',[vision_missioncontroller::class,'deletevision']);
Route::post('addtech',[TechnologyController::class,'addtech']);
Route::delete('deletetech/{id}',[TechnologyController::class,'deletetech']);
Route::put('updatetech/{id}',[TechnologyController::class,'updatetech']);



