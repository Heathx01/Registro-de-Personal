<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Unico Administrador Principal del Sistema
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@devstudio.com'],
            [
                'name' => 'Administrador Principal',
                'password' => Hash::make('admin123'),
                'position' => 'Administrador de Sistemas / IT',
                'department' => 'Dirección de TI',
                'role' => 'admin',
                'phone' => '+52 55 0000 0000',
                'status' => 'Active',
                'hire_date' => '2026-01-01',
                'skills' => ['Gestión de Usuarios', 'Seguridad de Datos', 'Administración del Sistema', 'Asignación de Privilegios'],
                'bio' => 'Administrador principal del sistema con potestad exclusiva para crear usuarios, asignar puestos y modificar roles y privilegios.',
            ]
        );

        // 2. Proyectos Iniciales administrados por el Admin
        $proj1 = Project::updateOrCreate(
            ['name' => 'Portal Interno de Registro de Personal'],
            [
                'title_es' => 'Portal Interno de Registro de Personal',
                'title_en' => 'Internal Staff Registry Portal',
                'description' => 'Sistema corporativo para control de personal, roles, privilegios y asignación de tareas.',
                'description_es' => 'Sistema corporativo para control de personal, roles, privilegios y asignación de tareas.',
                'description_en' => 'Internal corporate system for staff control, roles, privileges and task assignment.',
                'category' => 'Web App / System Admin',
                'status' => 'Active',
                'tech_stack' => ['Laravel API', 'Vite React', 'Vanilla CSS', 'MySQL'],
                'lead_id' => $adminUser->id,
                'progress' => 85,
                'deadline' => '2026-10-15',
            ]
        );

        // 3. Tareas Iniciales de Administración
        Task::updateOrCreate(
            ['title' => 'Gestión y Creación del Personal Inicial'],
            [
                'project_id' => $proj1->id,
                'assigned_to' => $adminUser->id,
                'created_by' => $adminUser->id,
                'description' => 'Registrar a los integrantes del equipo y otorgarles sus puestos y niveles de privilegios correspondientes.',
                'priority' => 'High',
                'status' => 'In Progress',
                'due_date' => '2026-08-30',
            ]
        );
    }
}
