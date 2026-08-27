<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = Template::where('status', 'active')->latest()->get();
        return response()->json($templates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'tech_stack' => 'nullable|array',
            'estimated_delivery' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:500',
            'demo_url' => 'nullable|string|max:500',
            'suggested_price' => 'nullable|numeric',
            'status' => 'nullable|string|max:50',
        ]);

        $template = Template::create($validated);

        return response()->json([
            'message' => 'Plantilla creada exitosamente',
            'template' => $template
        ], 201);
    }

    public function show($id)
    {
        $template = Template::find($id);

        if (!$template) {
            return response()->json(['message' => 'Plantilla no encontrada'], 404);
        }

        return response()->json($template);
    }

    public function update(Request $request, $id)
    {
        $template = Template::find($id);

        if (!$template) {
            return response()->json(['message' => 'Plantilla no encontrada'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'description' => 'sometimes|string',
            'features' => 'nullable|array',
            'tech_stack' => 'nullable|array',
            'estimated_delivery' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:500',
            'demo_url' => 'nullable|string|max:500',
            'suggested_price' => 'nullable|numeric',
            'status' => 'nullable|string|max:50',
        ]);

        $template->update($validated);

        return response()->json([
            'message' => 'Plantilla actualizada correctamente',
            'template' => $template
        ]);
    }

    public function destroy($id)
    {
        $template = Template::find($id);

        if (!$template) {
            return response()->json(['message' => 'Plantilla no encontrada'], 404);
        }

        $template->delete();

        return response()->json(['message' => 'Plantilla eliminada correctamente']);
    }
}
