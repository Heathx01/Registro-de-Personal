<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignee', 'creator']);

        if ($request->has('assigned_to') && !empty($request->assigned_to)) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('project_id') && !empty($request->project_id)) {
            $query->where('project_id', $request->project_id);
        }

        $query->latest();

        if ($request->has('per_page') || $request->has('page')) {
            return response()->json($query->paginate($request->get('per_page', 15)));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'created_by' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High,Critical',
            'status' => 'required|in:Pending,In Progress,In Review,Completed',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($validated);
        $task->load(['project', 'assignee']);

        return response()->json([
            'message' => 'Tarea asignada correctamente',
            'task' => $task
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        $validated = $request->validate([
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:Low,Medium,High,Critical',
            'status' => 'sometimes|in:Pending,In Progress,In Review,Completed',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);
        $task->load(['project', 'assignee']);

        return response()->json([
            'message' => 'Tarea actualizada correctamente',
            'task' => $task
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:Pending,In Progress,In Review,Completed',
        ]);

        $task->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Estado de la tarea actualizado',
            'task' => $task
        ]);
    }

    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Tarea eliminada']);
    }
}
