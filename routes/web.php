<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
 use App\Models\Service;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\SubServiceController;

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

require __DIR__.'/auth.php';