<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;
use App\Http\Resources\permissionResource;
use Spatie\Permission\Models\Permission;


class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index()
    {
        return Inertia::render('Roles/RoleIndex', [
        'roles' => RoleResource::collection(
            Role::with('permissions')->get()
        )
    ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        return Inertia::render('Roles/RoleCreate',[
            'permissions' => permissionResource::collection(Permission::all())
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name',
             'permissions' => 'array',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $role = Role::create([
            'name' => $request->name,
          
        ]);

        if($request->has('permissions')){
            
        $role->syncPermissions($request->permissions ?? []);
          
        }


        return Redirect::route('roles.index')->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     */
    public function show($id)
    {
        $role = Role::findOrFail($id);
        return Inertia::render('Roles/RoleShow', [
            'role' => new RoleResource($role)
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit($id)
    {
        $role = Role::findOrFail($id);
        $role->load('permissions');
        return Inertia::render('Roles/RoleEdit', [
            'role' => new RoleResource($role),
            'permissions' => permissionResource::collection(Permission::all())
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        // dd( $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'permissions' => ['required','array'],
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $role->update([
            'name' => $request->name,
        ]);
         if($request->has('permissions')){
        $role->syncPermissions($request->permissions);
         }

        return Redirect::route('roles.index')->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return Redirect::route('roles.index')->with('success', 'Role deleted successfully.');
    }
}