<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%");
            });
        }

        if ($request->has('department') && !empty($request->department)) {
            $query->where('department', $request->department);
        }

        if ($request->has('role') && !empty($request->role)) {
            $query->where('role', $request->role);
        }

        $query->withCount(['assignedTasks', 'ledProjects'])->latest();

        if ($request->has('per_page') || $request->has('page')) {
            return response()->json($query->paginate($request->get('per_page', 15)));
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $user = User::with(['assignedTasks.project', 'ledProjects'])->find($id);

        if (!$user) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        return response()->json($user);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'position' => 'required|string',
            'department' => 'required|string',
            'role' => 'required|string',
            'phone' => 'nullable|string',
            'status' => 'nullable|string',
            'hire_date' => 'nullable|date',
            'skills' => 'nullable|array',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'Empleado registrado exitosamente en el sistema',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'position' => 'sometimes|string',
            'department' => 'sometimes|string',
            'role' => 'sometimes|string',
            'phone' => 'nullable|string',
            'status' => 'nullable|string',
            'hire_date' => 'nullable|date',
            'skills' => 'nullable|array',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        if ($request->has('password') && !empty($request->password)) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Datos del empleado actualizados correctamente',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Empleado eliminado del registro']);
    }

    public function organigrama()
    {
        // Genera la estructura jerárquica de la empresa de software
        $users = User::all();

        $organigrama = [
            'direccion' => $users->whereIn('role', ['admin']),
            'lideres' => $users->whereIn('role', ['lead']),
            'desarrollo' => $users->whereIn('role', ['developer']),
            'calidad' => $users->whereIn('role', ['qa']),
            'recursos_humanos' => $users->whereIn('role', ['hr']),
        ];

        return response()->json($organigrama);
    }
}
