<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogService
{
    /**
     * Log activity dengan automatic user detection
     * 
     * @param string $action - 'create', 'update', 'delete', 'publish', 'approve'
     * @param string $modelType - 'news', 'category', 'admin', etc
     * @param int $modelId - ID of the model
     * @param array $changes - Optional: old & new values
     * @param string $description - Optional: human readable description
     * @param Request $request - Optional: untuk capture IP & user agent
     */
    public static function log(
        string $action,
        string $modelType,
        int $modelId = null,
        array $changes = null,
        string $description = null,
        Request $request = null
    ) {
        try {
            $user = auth()->user();
            if (!$user) {
                return;
            }

            ActivityLog::create([
                'action' => $action,
                'model_type' => $modelType,
                'model_id' => $modelId,
                'user_id' => $user->id,
                'user_type' => $user instanceof \App\Models\Admin ? 'admin' : 'writer',
                'changes' => $changes,
                'description' => $description,
                'ip_address' => $request ? $request->ip() : null,
                'user_agent' => $request ? $request->userAgent() : null,
            ]);
        } catch (\Exception $e) {
            // Log error tapi jangan interrupt main process
            \Log::error('ActivityLog Error: ' . $e->getMessage());
        }
    }

    /**
     * Helper untuk capture changes sebelum/sesudah update
     */
    public static function captureChanges($oldData, $newData)
    {
        $changes = [];
        
        foreach ($newData as $key => $newValue) {
            $oldValue = $oldData[$key] ?? null;
            if ($oldValue !== $newValue) {
                $changes[$key] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }

        return !empty($changes) ? $changes : null;
    }
}
