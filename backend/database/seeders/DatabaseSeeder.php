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

        // 2. Clientes Iniciales (CRM/SaaS)
        $client1 = \App\Models\Client::updateOrCreate(
            ['name' => 'TechCorp Solutions S.A.'],
            [
                'contact_person' => 'Ing. Carlos Mendoza',
                'email' => 'carlos.mendoza@techcorp.com',
                'phone' => '+52 55 1234 5678',
                'address' => 'Av. Insurgentes Sur 1602, Col. Crédito Constructor',
                'city' => 'Ciudad de México',
                'company_type' => 'Corporación',
                'tax_id' => 'TCS-901215-ABC',
                'status' => 'active',
                'notes' => 'Cliente corporativo clave. Contrato anual de desarrollo de software y soporte.',
            ]
        );

        $client2 = \App\Models\Client::updateOrCreate(
            ['name' => 'Fintech Innovators LLC'],
            [
                'contact_person' => 'Lic. Laura Gómez',
                'email' => 'laura.gomez@fintechinnovators.io',
                'phone' => '+1 305 888 9900',
                'address' => '701 Brickell Ave, Suite 1500',
                'city' => 'Miami, FL',
                'company_type' => 'Startup',
                'tax_id' => 'US-FIN-998234',
                'status' => 'active',
                'notes' => 'Startup de tecnología financiera. Requiere actualizaciones semanales de avance.',
            ]
        );

        $client3 = \App\Models\Client::updateOrCreate(
            ['name' => 'Grupo Logístico del Norte'],
            [
                'contact_person' => 'Ing. Roberto Silva',
                'email' => 'rsilva@grupologistico.com',
                'phone' => '+52 81 4433 2211',
                'address' => 'Av. Constitución 400, Centro',
                'city' => 'Monterrey, N.L.',
                'company_type' => 'Pyme',
                'tax_id' => 'GLN-080402-XYZ',
                'status' => 'active',
                'notes' => 'Sistema de rastreo de flota y despacho automatizado.',
            ]
        );

        // 3. Proyectos Iniciales administrados por el Admin
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
                'client_id' => $client1->id,
                'project_type' => 'SaaS Custom Enterprise',
                'budget' => 45000.00,
                'currency' => 'USD',
                'billing_status' => 'deposit_paid',
                'progress' => 85,
                'deadline' => '2026-10-15',
            ]
        );

        $proj2 = Project::updateOrCreate(
            ['name' => 'App Móvil de Pagos y Billetera Digital'],
            [
                'title_es' => 'App Móvil de Pagos y Billetera Digital',
                'title_en' => 'Digital Wallet Mobile App',
                'description' => 'Aplicación móvil multiplataforma para transferencias inmediatas y escaneo de códigos QR.',
                'description_es' => 'Aplicación móvil multiplataforma para transferencias inmediatas y escaneo de códigos QR.',
                'description_en' => 'Cross-platform mobile application for instant transfers and QR code scanning.',
                'category' => 'Mobile App / Fintech',
                'status' => 'Active',
                'tech_stack' => ['React Native', 'Laravel API', 'PostgreSQL'],
                'lead_id' => $adminUser->id,
                'client_id' => $client2->id,
                'project_type' => 'App Móvil',
                'budget' => 28000.00,
                'currency' => 'USD',
                'billing_status' => 'invoiced',
                'progress' => 40,
                'deadline' => '2026-12-01',
            ]
        );

        // 4. Tareas Iniciales de Administración
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

        // 5. Catálogo de Plantillas Iniciales
        \App\Models\Template::updateOrCreate(
            ['title' => 'Portal E-Commerce Omni-channel'],
            [
                'category' => 'E-Commerce',
                'description' => 'Plataforma completa de comercio electrónico con pasarela de pagos integrada, catálogo interactivo de productos, control de inventario y panel administrativo.',
                'features' => ['Pasarela de Pagos Stripe/PayPal', 'Catálogo con Filtros Avanzados', 'Panel de Inventario y Pedidos', 'Notificaciones por Email/WhatsApp', 'Diseño Responsive Mobile-First'],
                'tech_stack' => ['React', 'Laravel API', 'MySQL', 'Tailwind CSS'],
                'estimated_delivery' => '2 a 3 semanas',
                'image_url' => 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?w=800&auto=format&fit=crop&q=80',
                'demo_url' => 'https://demo.devstudio.com/ecommerce',
                'suggested_price' => 3500.00,
                'status' => 'active',
            ]
        );

        \App\Models\Template::updateOrCreate(
            ['title' => 'Dashboard ERP & CRM Financiero'],
            [
                'category' => 'ERP / CRM',
                'description' => 'Sistema de gestión de recursos empresariales y relaciones con clientes, métricas en tiempo real, cotizador dinámico y módulos contables.',
                'features' => ['Gestión de Clientes y Leads', 'Facturación y Cotizaciones', 'Métricas y Gráficos Financieros', 'Roles y Permisos Granulares', 'Exportación a PDF y Excel'],
                'tech_stack' => ['React', 'Laravel REST API', 'Chart.js', 'PostgreSQL'],
                'estimated_delivery' => '3 a 4 semanas',
                'image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
                'demo_url' => 'https://demo.devstudio.com/erp',
                'suggested_price' => 4800.00,
                'status' => 'active',
            ]
        );

        \App\Models\Template::updateOrCreate(
            ['title' => 'App Móvil de Citas y Reservas en Línea'],
            [
                'category' => 'Mobile App',
                'description' => 'Aplicación multiplataforma para reserva de citas, gestión de agenda en tiempo real, recordatorios push y pagos en línea.',
                'features' => ['Agenda Dinámica e Interactiva', 'Notificaciones Push Móviles', 'Recordatorios por SMS/Email', 'Perfiles de Especialistas', 'Integración con MercadoPago'],
                'tech_stack' => ['React Native / Flutter', 'Node.js', 'Firebase', 'MongoDB'],
                'estimated_delivery' => '3 semanas',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
                'demo_url' => 'https://demo.devstudio.com/booking',
                'suggested_price' => 2900.00,
                'status' => 'active',
            ]
        );
    }
}
