<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RevokePermissionController extends Controller
{
    public function revoke(Role $role, Permission $permission)
    {
        try {
            if (!$role->hasPermissionTo($permission)) {
                return Redirect::back()->with('error', 'The role does not have this permission.');
            }

            $role->revokePermissionTo($permission);
            return Redirect::back()->with('success', 'Permission revoked successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to revoke permission: ' . $e->getMessage());
            return Redirect::back()->with('error', 'Failed to revoke permission.');
        }
    }
}
