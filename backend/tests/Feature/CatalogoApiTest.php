<?php

namespace Tests\Feature;

use App\Models\Template;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CatalogoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_catalogos_returns_401(): void
    {
        // Prueba T2 de la guía: sin sesión no se puede acceder a la API privada
        $response = $this->getJson('/api/catalogos');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_list_catalogos(): void
    {
        // Prueba P1 de la guía: Listar registros
        $user = User::factory()->create(['role' => 'developer']);
        Sanctum::actingAs($user);

        Template::create([
            'title' => 'Solución E-Commerce Pro',
            'category' => 'ecommerce',
            'description' => 'Plataforma con pasarela de pagos Stripe.',
            'suggested_price' => 1500.00,
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/catalogos');
        $response->assertStatus(200)
                 ->assertJsonFragment(['title' => 'Solución E-Commerce Pro']);
    }

    public function test_validation_422_when_required_fields_are_missing(): void
    {
        // Prueba P3 de la guía: Enviar inválido -> 422 con errores por campo
        $user = User::factory()->create(['role' => 'lead']);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/catalogos', [
            'title' => '',
            'category' => '',
            'description' => '',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'category', 'description']);
    }

    public function test_create_catalogo_with_valid_data_returns_201(): void
    {
        // Prueba P2 de la guía: Enviar válido -> 201 + registro persistido
        $user = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($user);

        $payload = [
            'title' => 'App Móvil de Entregas',
            'category' => 'mobile',
            'description' => 'Aplicación Flutter con geolocalización en tiempo real.',
            'suggested_price' => 3200.50,
            'status' => 'active',
        ];

        $response = $this->postJson('/api/catalogos', $payload);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'App Móvil de Entregas']);

        $this->assertDatabaseHas('templates', [
            'title' => 'App Móvil de Entregas',
            'category' => 'mobile',
        ]);
    }

    public function test_update_catalogo_persists_changes_and_returns_200(): void
    {
        // Prueba P4 de la guía: Modificar un id existente -> Cambios persistidos
        $user = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($user);

        $item = Template::create([
            'title' => 'Versión Inicial',
            'category' => 'web',
            'description' => 'Descripción inicial',
            'suggested_price' => 1000.00,
            'status' => 'active',
        ]);

        $response = $this->putJson("/api/catalogos/{$item->id}", [
            'title' => 'Versión Actualizada 2.0',
            'category' => 'web',
            'description' => 'Descripción actualizada con microservicios.',
            'suggested_price' => 1800.00,
            'status' => 'active',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('templates', [
            'id' => $item->id,
            'title' => 'Versión Actualizada 2.0',
        ]);
    }

    public function test_unauthorized_user_cannot_delete_returns_403(): void
    {
        // Prueba P6 de la guía: Sin permiso para eliminar -> 403 y sin cambio en datos
        $unauthorizedUser = User::factory()->create(['role' => 'developer']); // Developer no puede eliminar
        Sanctum::actingAs($unauthorizedUser);

        $item = Template::create([
            'title' => 'Registro Protegido',
            'category' => 'enterprise',
            'description' => 'No debe ser eliminado por developer',
            'status' => 'active',
        ]);

        $response = $this->deleteJson("/api/catalogos/{$item->id}");
        $response->assertStatus(403);

        $this->assertDatabaseHas('templates', [
            'id' => $item->id,
        ]);
    }

    public function test_authorized_user_can_delete_returns_200(): void
    {
        // Prueba P5 de la guía: Confirmar eliminación con usuario con permiso (admin) -> Desaparece
        $adminUser = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($adminUser);

        $item = Template::create([
            'title' => 'Registro a Eliminar',
            'category' => 'web',
            'description' => 'Será borrado exitosamente',
            'status' => 'active',
        ]);

        $response = $this->deleteJson("/api/catalogos/{$item->id}");
        $response->assertStatus(200);

        $this->assertDatabaseMissing('templates', [
            'id' => $item->id,
        ]);
    }
}
