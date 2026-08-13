<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['lead', 'tasks.assignee'])->latest()->get();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'status' => 'nullable|string',
            'tech_stack' => 'nullable|array',
            'lead_id' => 'nullable|exists:users,id',
            'progress' => 'nullable|integer|min:0|max:100',
            'deadline' => 'nullable|date',
        ]);

        if (!isset($validated['title_es'])) {
            $validated['title_es'] = $validated['name'];
        }
        if (!isset($validated['title_en'])) {
            $validated['title_en'] = $validated['name'];
        }

        $project = Project::create($validated);

        return response()->json([
            'message' => 'Proyecto creado exitosamente',
            'project' => $project
        ], 201);
    }

    public function show($id)
    {
        $project = Project::with(['lead', 'tasks.assignee'])->find($id);

        if (!$project) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'status' => 'nullable|string',
            'tech_stack' => 'nullable|array',
            'lead_id' => 'nullable|exists:users,id',
            'progress' => 'nullable|integer|min:0|max:100',
            'deadline' => 'nullable|date',
        ]);

        if (isset($validated['name'])) {
            $validated['title_es'] = $validated['name'];
            $validated['title_en'] = $validated['name'];
        }

        $project->update($validated);

        return response()->json([
            'message' => 'Proyecto actualizado correctamente',
            'project' => $project
        ]);
    }

    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Proyecto eliminado']);
    }
}
