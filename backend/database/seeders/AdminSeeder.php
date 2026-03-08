<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'System Administrator',
            'email' => 'admin@tra.go.tz',
            'password' => Hash::make('admin123'),
            'status' => 'active',
        ]);
    }
}
