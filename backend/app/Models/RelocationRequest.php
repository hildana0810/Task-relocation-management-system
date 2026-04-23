<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RelocationRequest extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'tin_number',
        'current_address',
        'new_address',
        'phone',
        'email',
        'status',
        'tax_collector_id',
        'approved_at',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function taxCollector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tax_collector_id');
    }
}
