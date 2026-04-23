<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TaxCollectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Michael Johnson',
            'email' => 'michael.j@tax.gov.tz',
            'password' => Hash::make('password123'),
            'location' => 'Dar es Salaam',
            'role' => 'tax_collector',
        ]);

        User::create([
            'name' => 'Sarah Williams',
            'email' => 'sarah.w@tax.gov.tz',
            'password' => Hash::make('password123'),
            'location' => 'Arusha',
            'role' => 'tax_collector',
        ]);

        User::create([
            'name' => 'David Brown',
            'email' => 'david.b@tax.gov.tz',
            'password' => Hash::make('password123'),
            'location' => 'Mwanza',
            'role' => 'tax_collector',
        ]);

        User::create([
            'name' => 'Emily Davis',
            'email' => 'emily.d@tax.gov.tz',
            'password' => Hash::make('password123'),
            'location' => 'Dodoma',
            'role' => 'tax_collector',
        ]);
    }
}
