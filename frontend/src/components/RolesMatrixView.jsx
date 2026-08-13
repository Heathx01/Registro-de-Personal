import React from 'react';

export default function RolesMatrixView() {
  const roleMatrix = [
    {
      role: 'Director General / CEO',
      badge: 'admin',
      position: 'Chief Executive Officer, CTO & Fundador',
      department: 'Dirección Ejecutiva',
      access: 'Acceso Total e Ilimitado a todos los módulos y configuraciones.',
      privileges: 'Crear, editar y eliminar personal; asignar roles; administrar presupuestos; crear proyectos y tareas.',
      restrictions: 'Sin restricciones en el sistema.',
    },
    {
      role: 'Líder Técnico / Tech Lead',
      badge: 'lead',
      position: 'Lead Software Architect & Tech Lead',
      department: 'Ingeniería de Software',
      access: 'Módulo de Proyectos, Tareas, Directorio de Personal y Organigrama.',
      privileges: 'Crear proyectos técnicos, asignar tareas diarias a desarrolladores, revisar código y evaluar progreso.',
      restrictions: 'No puede eliminar usuarios de la empresa ni cambiar salarios o roles administrativos.',
    },
    {
      role: 'Desarrollador de Software',
      badge: 'developer',
      position: 'Senior / Junior Fullstack & Backend Engineer',
      department: 'Ingeniería de Software',
      access: 'Tareas Asignadas (Kanban), Vista de Proyectos y Organigrama.',
      privileges: 'Actualizar el estado de sus propias tareas (Pendiente -> En Progreso -> Completado), registrar horas de código.',
      restrictions: 'No puede modificar la estructura de proyectos, ni asignar tareas a otros usuarios, ni alterar personal.',
    },
    {
      role: 'Especialista en Calidad (QA)',
      badge: 'qa',
      position: 'QA Automation Lead & Security Tester',
      department: 'Calidad y Seguridad',
      access: 'Módulo de Tareas/Bugs, Proyectos y Organigrama.',
      privileges: 'Crear reportes de errores/bugs, mover tareas a estado "En Revisión QA", validar entregables.',
      restrictions: 'No puede modificar código fuente del repositorio ni parámetros financieros.',
    },
    {
      role: 'Recursos Humanos (HR)',
      badge: 'hr',
      position: 'Human Resources & Talent Manager',
      department: 'Recursos Humanos',
      access: 'Directorio de Personal, Gestión de Usuarios, Organigrama.',
      privileges: 'Registrar nuevos empleados, actualizar información de contacto, dar de alta/baja personal.',
      restrictions: 'No puede modificar proyectos de desarrollo de software ni tareas de arquitectura técnica.',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Matriz de Roles, Privilegios, Restricciones y Accesos</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Definición formal de la arquitectura de seguridad basada en roles (RBAC) ajustada al organigrama de la empresa de software.
        </p>
      </div>

      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>ROL ORGANIZACIONAL</th>
              <th>PUESTO TÍPICO</th>
              <th>NIVEL DE ACCESO</th>
              <th>PRIVILEGIOS CONCEDIDOS</th>
              <th>RESTRICCIONES OPERATIVAS</th>
            </tr>
          </thead>
          <tbody>
            {roleMatrix.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <span className={`badge badge-${item.badge}`} style={{ marginBottom: '4px' }}>
                    {item.role}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.department}</div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--cyan)' }}>{item.position}</td>
                <td>{item.access}</td>
                <td style={{ color: 'var(--emerald)' }}>{item.privileges}</td>
                <td style={{ color: 'var(--rose)' }}>{item.restrictions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
