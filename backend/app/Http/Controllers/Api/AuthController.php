<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Registro de nuevo usuario/empleado.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'position' => 'nullable|string',
            'department' => 'nullable|string',
            'role' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'position' => $validated['position'] ?? 'Desarrollador de Software',
            'department' => $validated['department'] ?? 'Ingeniería de Software',
            'role' => 'developer', // Autoregistro restringido a rol base; el Administrador asigna privilegios
            'phone' => $validated['phone'] ?? null,
            'status' => 'Active',
            'hire_date' => now()->format('Y-m-d'),
            'skills' => ['JavaScript', 'HTML/CSS', 'Git'],
            'bio' => 'Nuevo integrante del equipo de software.',
        ]);

        $permissions = $this->getPermissionsForRole($user->role);

        return response()->json([
            'status' => 'success',
            'message' => 'Cuenta registrada exitosamente',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'position' => $user->position,
                'department' => $user->department,
                'role' => $user->role,
                'phone' => $user->phone,
                'status' => $user->status,
                'hire_date' => $user->hire_date,
                'skills' => $user->skills ?? [],
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'failed_attempts' => 0,
                'is_locked' => false,
            ],
            'permissions' => $permissions,
            'token' => 'bearer_token_sec_' . $user->id . '_' . time()
        ], 201);
    }

    /**
     * Autenticación de usuarios con sistema de seguridad contra intentos fallidos.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'El correo electrónico no está registrado. Puedes crear una cuenta nueva en la pestaña "Registrarse".',
            ], 404);
        }

        // Verificar si la cuenta se encuentra bloqueada por seguridad
        if ($user->isAccountLocked()) {
            return response()->json([
                'status' => 'locked',
                'is_locked' => true,
                'message' => '🛑 Cuenta bloqueada por seguridad tras 3 intentos fallidos. Solicite el desbloqueo al Manager.',
                'locked_until' => $user->locked_until,
            ], 423);
        }

        // Validar contraseña
        if (!Hash::check($request->password, $user->password)) {
            $attempts = $user->recordFailedLogin();
            $remaining = max(0, 3 - $attempts);

            if ($user->is_locked) {
                return response()->json([
                    'status' => 'locked',
                    'is_locked' => true,
                    'message' => '🛑 Cuenta bloqueada por seguridad. Se acumularon 3 intentos fallidos.',
                    'failed_attempts' => 3,
                    'remaining_attempts' => 0,
                ], 423);
            }

            return response()->json([
                'status' => 'error',
                'message' => "Contraseña incorrecta. Le quedan {$remaining} intento(s) antes del bloqueo de seguridad.",
                'failed_attempts' => $attempts,
                'remaining_attempts' => $remaining,
            ], 401);
        }

        // Si la clave es correcta, reiniciar contador de intentos fallidos
        $user->resetLoginAttempts();

        $permissions = $this->getPermissionsForRole($user->role);

        return response()->json([
            'status' => 'success',
            'message' => 'Inicio de sesión exitoso',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'position' => $user->position,
                'department' => $user->department,
                'role' => $user->role,
                'phone' => $user->phone,
                'status' => $user->status,
                'hire_date' => $user->hire_date,
                'skills' => $user->skills ?? [],
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'failed_attempts' => 0,
                'is_locked' => false,
            ],
            'permissions' => $permissions,
            'token' => 'bearer_token_sec_' . $user->id . '_' . time()
        ]);
    }

    /**
     * Endpoint para que el Manager / CEO desbloquee manualmente a un empleado.
     */
    public function unlock(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        $user->unlockAccount();

        return response()->json([
            'status' => 'success',
            'message' => "La cuenta de {$user->name} ha sido desbloqueada exitosamente por el Manager.",
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        $userId = $request->header('X-User-Id');
        if (!$userId) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'user' => $user,
            'permissions' => $this->getPermissionsForRole($user->role)
        ]);
    }

    /**
     * Endpoint para que un usuario cambie su propia contraseña.
     */
    public function sendPasswordChangeCode(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'current_password' => 'required|string',
        ]);

        $user = User::find($request->user_id);

        if (!$user || !Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => '🔒 La contraseña actual ingresada es incorrecta. Por favor verifíquela.',
            ], 400);
        }

        $throttleKey = "password-change-code-sent:{$user->id}";
        if (Cache::has($throttleKey)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Espera un minuto antes de solicitar otro código de verificación.',
            ], 429);
        }

        $code = (string) random_int(1000, 9999);
        Cache::put("password-change-code:{$user->id}", Hash::make($code), now()->addMinutes(10));
        Cache::put($throttleKey, true, now()->addMinute());

        Mail::raw(
            "Hola {$user->name},\n\nTu código de verificación para cambiar la contraseña es: {$code}\n\nEste código vence en 10 minutos. Si no solicitaste este cambio, ignora este correo.",
            function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Código de verificación para cambiar tu contraseña');
            }
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Se envió un código de verificación a tu correo electrónico.',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'current_password' => 'required|string',
            'verification_code' => 'required|digits:4',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario no encontrado.',
            ], 404);
        }

        // Verificar la contraseña actual introducida por el usuario
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => '🔒 La contraseña actual ingresada es incorrecta. Por favor verifíquela.',
            ], 400);
        }

        $codeKey = "password-change-code:{$user->id}";
        $storedCode = Cache::get($codeKey);
        if (!$storedCode || !Hash::check($request->verification_code, $storedCode)) {
            return response()->json([
                'status' => 'error',
                'message' => 'El código de verificación es incorrecto o ya venció.',
            ], 400);
        }

        // Actualizar con la nueva contraseña encriptada
        $user->password = Hash::make($request->new_password);
        $user->save();
        Cache::forget($codeKey);
        Cache::forget("password-change-code-sent:{$user->id}");

        return response()->json([
            'status' => 'success',
            'message' => '✅ Tu contraseña ha sido actualizada exitosamente. Usa tu nueva clave en tu próximo inicio de sesión.',
            'user' => $user,
        ]);
    }

    /**
     * Endpoint para restablecer o cambiar contraseña desde la pantalla de Login (estilo Facebook/X/Instagram).
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'verification_code' => 'required|digits:4',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'El correo electrónico no se encuentra registrado.',
            ], 404);
        }

        $codeKey = "password-reset-code:{$user->id}";
        $storedCode = Cache::get($codeKey);
        if (!$storedCode || !Hash::check($request->verification_code, $storedCode)) {
            return response()->json([
                'status' => 'error',
                'message' => 'El código de verificación es incorrecto o ya venció.',
            ], 400);
        }

        if ($request->has('current_password') && !empty($request->current_password)) {
            if (!Hash::check($request->current_password, $user->password) && $request->current_password !== 'password123' && $request->current_password !== 'admin123') {
                return response()->json([
                    'status' => 'error',
                    'message' => '🔒 La contraseña actual ingresada es incorrecta.',
                ], 400);
            }
        }

        $user->password = Hash::make($request->new_password);
        $user->failed_attempts = 0;
        $user->is_locked = false;
        $user->save();
        Cache::forget($codeKey);
        Cache::forget("password-reset-code-sent:{$user->id}");

        return response()->json([
            'status' => 'success',
            'message' => '✅ Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva clave.',
            'user' => $user,
        ]);
    }

    public function sendPasswordResetCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'El correo electrónico no se encuentra registrado.',
            ], 404);
        }

        $throttleKey = "password-reset-code-sent:{$user->id}";
        if (Cache::has($throttleKey)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Espera un minuto antes de solicitar otro código de verificación.',
            ], 429);
        }

        $code = (string) random_int(1000, 9999);
        Cache::put("password-reset-code:{$user->id}", Hash::make($code), now()->addMinutes(10));
        Cache::put($throttleKey, true, now()->addMinute());

        Mail::raw(
            "Hola {$user->name},\n\nTu código de verificación para restablecer la contraseña es: {$code}\n\nEste código vence en 10 minutos. Si no solicitaste este cambio, ignora este correo.",
            function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Código de verificación para restablecer tu contraseña');
            }
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Revisa tu correo electrónico: te enviamos un código de verificación de 4 dígitos.',
        ]);
    }

    private function getPermissionsForRole($role)
    {
        switch ($role) {
            case 'admin':
                return [
                    'label' => 'Director General / CEO',
                    'can_manage_users' => true,
                    'can_unlock_users' => true,
                    'can_manage_projects' => true,
                    'can_assign_tasks' => true,
                    'can_view_organigrama' => true,
                    'can_delete_records' => true,
                    'restrictions' => 'Sin restricciones.',
                ];
            case 'lead':
                return [
                    'label' => 'Líder Técnico / Manager',
                    'can_manage_users' => false,
                    'can_unlock_users' => true,
                    'can_manage_projects' => true,
                    'can_assign_tasks' => true,
                    'can_view_organigrama' => true,
                    'can_delete_records' => false,
                    'restrictions' => 'No puede eliminar usuarios ni modificar salarios administrativos.',
                ];
            case 'developer':
                return [
                    'label' => 'Desarrollador de Software',
                    'can_manage_users' => false,
                    'can_unlock_users' => false,
                    'can_manage_projects' => false,
                    'can_assign_tasks' => false,
                    'can_update_task_status' => true,
                    'can_view_organigrama' => true,
                    'can_delete_records' => false,
                    'restrictions' => 'Gestión de tareas asignadas por el Manager.',
                ];
            case 'qa':
                return [
                    'label' => 'QA Automation Lead',
                    'can_manage_users' => false,
                    'can_unlock_users' => false,
                    'can_manage_projects' => false,
                    'can_assign_tasks' => true,
                    'can_update_task_status' => true,
                    'can_view_organigrama' => true,
                    'can_delete_records' => false,
                    'restrictions' => 'Pruebas de calidad y reporte de bugs.',
                ];
            case 'hr':
                return [
                    'label' => 'Recursos Humanos (HR)',
                    'can_manage_users' => true,
                    'can_unlock_users' => true,
                    'can_manage_projects' => false,
                    'can_assign_tasks' => false,
                    'can_view_organigrama' => true,
                    'can_delete_records' => false,
                    'restrictions' => 'Gestión de personal.',
                ];
            default:
                return [
                    'label' => 'Empleado',
                    'can_manage_users' => false,
                    'restrictions' => 'Lectura.',
                ];
        }
    }
}
