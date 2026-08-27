<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TemplateController;

// Rutas de autenticación y registro
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/users/{id}/unlock', [AuthController::class, 'unlock']);
Route::get('/me', [AuthController::class, 'me']);

// Rutas de personal y organigrama
Route::get('/organigrama', [UserController::class, 'organigrama']);
Route::apiResource('users', UserController::class);

// Rutas de clientes (CRM/SaaS)
Route::apiResource('clients', ClientController::class);

// Rutas de catálogo de plantillas y modelos
Route::apiResource('templates', TemplateController::class);

// Rutas de proyectos y tareas
Route::apiResource('projects', ProjectController::class);
Route::apiResource('tasks', TaskController::class);
Route::patch('/tasks/{id}/status', [TaskController::class, 'updateStatus']);

Route::get('/prueba', function () {
    return response()->json([
        'mensaje' => 'API de Registro de Personal de Software (MVC) funcionando',
        'estado' => true,
    ]);
});
