<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCatalogoRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado a realizar esta solicitud.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
            return false;
        }

        return in_array($user->role, ['admin', 'lead', 'developer', 'sales']);
    }

    /**
     * Reglas de validación para actualizar el catálogo.
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
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
     * Mensajes descriptivos por campo.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título del catálogo no puede quedar vacío.',
            'category.required' => 'La categoría no puede quedar vacía.',
            'description.required' => 'La descripción no puede quedar vacía.',
            'suggested_price.numeric' => 'El precio debe ser un número válido.',
            'suggested_price.min' => 'El precio no puede ser negativo.',
        ];
    }
}
