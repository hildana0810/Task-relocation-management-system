<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TaxCollector;
use Illuminate\Support\Facades\Hash;

class TaxCollectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaxCollector::create([
            'name' => 'Michael Johnson',
            'email' => 'michael.j@tax.gov.tz',
            'phone' => '+255 712 345 678',
            'region' => 'Dar es Salaam',
            'status' => 'active',
            'assigned_requests' => 12,
        ]);

        TaxCollector::create([
            'name' => 'Sarah Williams',
            'email' => 'sarah.w@tax.gov.tz',
            'phone' => '+255 713 456 789',
            'region' => 'Arusha',
            'status' => 'active',
            'assigned_requests' => 8,
        ]);

        TaxCollector::create([
            'name' => 'David Brown',
            'email' => 'david.b@tax.gov.tz',
            'phone' => '+255 714 567 890',
            'region' => 'Mwanza',
            'status' => 'inactive',
            'assigned_requests' => 15,
        ]);

        TaxCollector::create([
            'name' => 'Emily Davis',
            'email' => 'emily.d@tax.gov.tz',
            'phone' => '+255 715 678 901',
            'region' => 'Dodoma',
            'status' => 'active',
            'assigned_requests' => 6,
        ]);
    }
}
