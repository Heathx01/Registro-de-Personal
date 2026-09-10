<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogoRequest;
use App\Http\Requests\UpdateCatalogoRequest;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = Template::latest();

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && !empty($request->search)) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                  ->orWhere('description', 'like', $term)
                  ->orWhere('category', 'like', $term);
            });
        }

        if ($request->has('per_page') || $request->has('page')) {
            return response()->json($query->paginate($request->get('per_page', 15)));
        }

        return response()->json($query->get());
    }

    public function store(StoreCatalogoRequest $request)
    {
        // Validación delegada a StoreCatalogoRequest (Paso 4 - Sección 6)
        $validated = $request->validated();

        $template = Template::create($validated);

        return response()->json([
            'message' => 'Elemento de catálogo creado exitosamente',
            'data' => $template,
            'template' => $template
        ], 201);
    }

    public function show($id)
    {
        $template = Template::find($id);

        if (!$template) {
            return response()->json(['message' => 'Elemento del catálogo no encontrado'], 404);
        }

        return response()->json($template);
    }

    public function update(UpdateCatalogoRequest $request, $id)
    {
        $template = Template::find($id);

        if (!$template) {
            return response()->json(['message' => 'Elemento del catálogo no encontrado'], 404);
        }

        // Validación delegada a UpdateCatalogoRequest
        $validated = $request->validated();
        $template->update($validated);

        return response()->json([
            'message' => 'Elemento de catálogo actualizado correctamente',
            'data' => $template,
            'template' => $template
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        // Control de autorización backend (Paso 15 - Sección 6: Frontend orienta, Backend autoriza)
        if (!$user || !in_array($user->role, ['admin', 'lead'])) {
            return response()->json([
                'message' => 'No tienes permisos para eliminar este elemento del catálogo.'
            ], 403);
        }

        $template = Template::find($id);

        if (!$template) {
            return response()->json(['message' => 'Elemento del catálogo no encontrado'], 404);
        }

        $template->delete();

        return response()->json([
            'message' => 'Elemento de catálogo eliminado correctamente'
        ], 200);
    }
}
