<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResources as UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\RoleResource as RoleResource;
use App\Http\Resources\permissionResource as PermissionResource;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        return Inertia::render('Users/UserIndex', [
            'users' => UserResource::collection(User::all())
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Users/UserCreate',[
            
            'roles'=>RoleResource::collection(Role::all()),
            'permissions'=>PermissionResource::collection(Permission::all()),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'roles'=> ['required','array'],
            'permissions'=> ['sometimes','array'],
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
         $user->syncRoles($request->roles);
        
        
            $user->syncPermissions($request->permissions);

        return Redirect::route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('Users/UserShow', [
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);
        $user->load('roles','permissions');

        return Inertia::render('Users/UserEdit', [
            'user' => new UserResource($user),
            'roles'=>RoleResource::collection(Role::all()),
            'permissions'=>PermissionResource::collection(Permission::all()),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            // 'password' => 'nullable|string|min:8|confirmed',
            'roles'=> ['required','array'],
            'permissions'=> ['array'],
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // if ($request->filled('password')) {
        //     $data['password'] = Hash::make($request->password);
        // }

        $user->update($data);
        
            $user->syncRoles($request->roles);
        
        
            $user->syncPermissions($request->permissions);
        

        return Redirect::route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return Redirect::route('users.index')->with('success', 'User deleted successfully.');
    }
}