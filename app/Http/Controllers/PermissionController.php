<?php

namespace App\Http\Controllers;

use App\Http\Resources\permissionResource;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index()
    {
        return Inertia::render('Permissions/PermissionIndex', [
            'permissions' => permissionResource::collection(Permission::all())
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create()
    {
        return Inertia::render('Permissions/PermissionCreate');
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions,name',
            
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        Permission::create([
            'name' => $request->name,
            
        ]);

        return Redirect::route('permissions.index')->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified permission.
     */
    public function show($id)
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('Permissions/PermissionShow', [
            'permission' => new permissionResource($permission)
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit($id)
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('Permissions/PermissionEdit', [
            'permission' => new permissionResource($permission)
        ]);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions,name,' . $id,
            
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $permission->update([
            'name' => $request->name,
            
        ]);

        return Redirect::route('permissions.index')->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return Redirect::route('permissions.index')->with('success', 'Permission deleted successfully.');
    }
}