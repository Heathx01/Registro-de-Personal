import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function DashboardCharts({ tasks, projects, users }) {
  // Chart 1: Tareas por Estado (Pie Chart)
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Pendiente', value: taskStatusCounts['Pending'] || 0, color: '#f59e0b' },
    { name: 'En Progreso', value: taskStatusCounts['In Progress'] || 0, color: '#06b6d4' },
    { name: 'En Revisión', value: taskStatusCounts['In Review'] || 0, color: '#8b5cf6' },
    { name: 'Completado', value: taskStatusCounts['Completed'] || 0, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Chart 2: Tareas por Desarrollador (Bar Chart)
  const devTasks = users.filter(u => u.role === 'developer' || u.role === 'qa').map(dev => {
    const devAssigned = tasks.filter(t => String(t.assigned_to) === String(dev.id));
    return {
      name: dev.name.split(' ')[0], // Only first name for space
      completadas: devAssigned.filter(t => t.status === 'Completed').length,
      pendientes: devAssigned.filter(t => t.status !== 'Completed').length,
    };
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '15px' }}>Estado de Tareas</h3>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-main)' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '15px' }}>Carga por Desarrollador</h3>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={devTasks} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Legend />
              <Bar dataKey="completadas" name="Completadas" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="pendientes" name="Pendientes" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
