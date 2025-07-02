<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

 use App\Models\Service;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SubServiceController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
 

// Route::get('/services', function () {
//     return Inertia::render('Admin/Services/Services');
// })->name('services');

Route::get('/services', [ServiceController::class, 'index'])->name('services');

Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
Route::post('/subservices', [SubServiceController::class, 'store'])->name('subservices.store');

Route::post('/services/{id}', [ServiceController::class, 'update'])->name('services.update');
Route::post('/services/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');


// Route::get('/services/create', [ServiceController::class, 'create'])->name('services.create');

Route::get('/', function () {
    return Inertia::render('Admin/Dashboard');
})->name('dashboard');
Route::get('/leads', function () {
    return Inertia::render('Admin/Enquiry/Leads');
})->name('leads');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::get('/test-image', function () {
//     $service = Service::find(1); // change 1 to any existing ID in your DB
//     return view('test-image', compact('service'));
// });


require __DIR__.'/auth.php';