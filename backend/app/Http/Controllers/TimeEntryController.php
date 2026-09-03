<?php

namespace App\Http\Controllers;

use App\Models\TimeEntry;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    public function index(Request $request)
    {
        $query = TimeEntry::with(['task']);
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        return response()->json($query->orderBy('logged_at', 'desc')->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'nullable|exists:tasks,id',
            'description' => 'required|string',
            'hours' => 'required|numeric|min:0.1',
            'logged_at' => 'required|date',
        ]);

        $validated['user_id'] = $request->user()->id;

        $entry = TimeEntry::create($validated);
        $entry->load('task');

        return response()->json([
            'message' => 'Horas registradas correctamente',
            'entry' => $entry
        ], 201);
    }
}
