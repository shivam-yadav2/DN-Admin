<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
 use App\Http\Controllers\Service\ServiceController;
 use App\Models\Service;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/services', function () {
    return Inertia::render('Admin/Services/Services');
})->name('services');

Route::get('/dashboard', function () {
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

Route::get('/test-image', function () {
    $service = Service::find(1); // change 1 to any existing ID in your DB
    return view('test-image', compact('service'));
});


require __DIR__.'/auth.php';
