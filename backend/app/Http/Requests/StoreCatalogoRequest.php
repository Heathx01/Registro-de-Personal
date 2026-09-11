<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCatalogoRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado a realizar esta solicitud (Paso 4 y 15).
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
            return false;
        }

        // Roles con autorización para registrar catálogo
        return in_array($user->role, ['admin', 'lead', 'developer', 'sales']);
    }

    /**
     * Reglas de validación que deben cumplir los datos.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'suggested_price' => ['nullable', 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'tech_stack' => ['nullable', 'array'],
            'estimated_delivery' => ['nullable', 'string', 'max:100'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'demo_url' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * Mensajes claros para cada campo.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título del catálogo es obligatorio.',
            'category.required' => 'La categoría es obligatoria.',
            'description.required' => 'La descripción es obligatoria.',
            'suggested_price.numeric' => 'El precio sugerido debe ser un número válido.',
            'suggested_price.min' => 'El precio no puede ser negativo.',
        ];
    }
}
