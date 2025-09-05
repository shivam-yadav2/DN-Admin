<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => "Admin User",
            'email' => "admin@digitalnawab.com",
            'email_verified_at' => now(),
            'password' => Hash::make('DN@Password_123'),
            'remember_token' => Str::random(10),
        ])->assignRole('admin');
    }
}
