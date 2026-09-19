'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Building2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronRight,
  FolderOpen,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  const stats = [
    {
      title: 'Incapacidades Activas',
      value: '148',
      change: '+12%',
      trend: 'up',
      subtitle: '42 radicadas esta semana',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Pendientes Radicación EPS',
      value: '23',
      change: '-4',
      trend: 'down',
      subtitle: '5 próximas a vencer término',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      title: 'Cartera en Recobro',
      value: '$ 48.2M',
      change: '+8.4%',
      trend: 'up',
      subtitle: '91% tasa de recuperación',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Colaboradores Registrados',
      value: '1,280',
      change: '+15',
      trend: 'up',
      subtitle: 'En 12 sedes operativas',
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
  ];

  const modules = [
    {
      title: 'Gestión de Incapacidades',
      tag: 'Core Operational',
      description:
        'Registro centralizado, seguimiento de prórrogas, asignación de contingencias y control integral de días hábiles/calendario.',
      href: '/incapacidades',
      icon: FileText,
      badge: 'Prioridad 2',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      features: ['Listado unificado', 'Formulario ágil', 'Timeline de estados'],
    },
    {
      title: 'Gestión y Validación Documental',
      tag: 'Expediente Digital',
      description:
        'Recepción de certificados médicos, validación de firmas, fórmulas y checklist automatizado exigido por EPS/ARL.',
      href: '/documentos',
      icon: FileCheck,
      badge: 'Prioridad 3',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      features: ['Carga drag & drop', 'Visor integrado', 'Aprobación / Rechazo'],
    },
    {
      title: 'Transcripción y Radicación EPS/ARL',
      tag: 'Trámites Externos',
      description:
        'Control estricto de términos legales para radicación ante entidades promotoras de salud y aseguradoras de riesgos laborales.',
      href: '/transcripcion',
      icon: Clock,
      badge: 'Prioridad 4',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      features: ['Semáforo de plazos', 'Evidencia de radicado', 'Control de glosas'],
    },
    {
      title: 'Cobros, Recobros y Cartera',
      tag: 'Financiero',
      description:
        'Conciliación de pagos bancarios, seguimiento de liquidaciones, comprobantes de pago y auditoría de saldos pendientes.',
      href: '/cobros',
      icon: DollarSign,
      badge: 'Prioridad 5',
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      features: ['Liquidación automática', 'Conciliación bancaria', 'Métricas de recaudo'],
    },
    {
      title: 'Auditoría e Historial Cronológico',
      tag: 'Compliance',
      description:
        'Trazabilidad total de cada evento, cambio de estado, responsable, marcas de tiempo y justificaciones clínicas.',
      href: '/historial',
      icon: ShieldCheck,
      badge: 'Seguridad',
      badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      features: ['Log inmutable', 'Auditoría de cambios', 'Exportación legal'],
    },
    {
      title: 'Catálogos y Parámetros del Sistema',
      tag: 'Administración',
      description:
        'Configuración de entidades (EPS, ARL, AFP, IPS), clasificador internacional CIE-10 y tablas de origen común/laboral.',
      href: '/catalogos',
      icon: Building2,
      badge: 'Configuración',
      badgeColor: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
      features: ['Maestro de EPS', 'Catálogo CIE-10', 'Reglas de negocio'],
    },
  ];

  const recentCases = [
    {
      id: 'INC-2026-089',
      colaborador: 'Carlos Eduardo Ramírez',
      documento: 'CC 1.094.882.110',
      entidad: 'Sura EPS',
      diagnostico: 'M54.5 - Lumbago no especificado',
      dias: 5,
      estado: 'En Radicación',
      estadoColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      fecha: '18 Sep 2026',
    },
    {
      id: 'INC-2026-088',
      colaborador: 'María Camila Benítez',
      documento: 'CC 52.410.998',
      entidad: 'Sanitas EPS',
      diagnostico: 'J06.9 - Infección respiratoria aguda',
      dias: 3,
      estado: 'Aprobada',
      estadoColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      fecha: '17 Sep 2026',
    },
    {
      id: 'INC-2026-087',
      colaborador: 'Jorge Andrés Martínez',
      documento: 'CC 1.128.400.320',
      entidad: 'Positiva ARL',
      diagnostico: 'S82.2 - Fractura de tibia (Accidente Laboral)',
      dias: 30,
      estado: 'Documentos Pendientes',
      estadoColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      fecha: '16 Sep 2026',
    },
    {
      id: 'INC-2026-086',
      colaborador: 'Laura Marcela Torres',
      documento: 'CC 1.018.441.779',
      entidad: 'Compensar EPS',
      diagnostico: 'O80.0 - Parto único espontáneo',
      dias: 126,
      estado: 'Liquidada',
      estadoColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      fecha: '15 Sep 2026',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Enterprise Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#334155]/60 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white">Disability System</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8]">Sistema de Gestión de Incapacidades</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#334155]/60 text-sm">
              <a
                href="#modulos"
                className="px-3 py-1.5 rounded-lg text-white font-medium bg-[#1e293b]/70 hover:bg-[#1e293b] transition"
              >
                Módulos
              </a>
              <a
                href="#casos"
                className="px-3 py-1.5 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-[#1e293b]/40 transition"
              >
                Casos Recientes
              </a>
              <a
                href="#arquitectura"
                className="px-3 py-1.5 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-[#1e293b]/40 transition"
              >
                Arquitectura & Contratos
              </a>
            </nav>
          </div>

          {/* Quick Search & Status */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar caso, colaborador, cédula..."
                className="w-full pl-9 pr-12 py-1.5 rounded-lg bg-[#111827] border border-[#334155] text-sm text-[#f8fafc] placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                ⌘K
              </span>
            </div>

            {/* Backend Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#334155]/80 text-xs">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[#cbd5e1] font-medium hidden sm:inline">Backend API v1</span>
              <span className="text-[10px] text-[#94a3b8] hidden md:inline">disability-system-backend</span>
            </div>

            {/* User Session or Login Button */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#334155]/60">
              {isInitialized && isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-none">
                      {user.nombre}
                    </div>
                    <span className="text-[10px] text-blue-400 font-medium">
                      {user.rol?.nombre || 'Operador'}
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                    {user.nombre.substring(0, 2).toUpperCase()}
                  </div>
                  <button
                    onClick={() => logout()}
                    title="Cerrar Sesión"
                    className="p-2 rounded-lg bg-[#1e293b] hover:bg-red-500/20 hover:text-red-400 border border-[#334155] text-[#94a3b8] transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm active:scale-95"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Iniciar Sesión</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#111827] border border-[#334155] p-8 shadow-2xl">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nueva Arquitectura Next.js 16 • React 19 • Tailwind CSS 4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Control Clínico, Administrativo y Financiero de Incapacidades Médicas
            </h1>
            <p className="text-[#cbd5e1] text-base leading-relaxed">
              Plataforma empresarial de alto rendimiento diseñada para optimizar los tiempos de radicación ante EPS/ARL,
              garantizar el cumplimiento normativo y acelerar el recobro de prestaciones económicas.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#modulos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/25 active:scale-[0.98]"
              >
                <span>Explorar Módulos Operativos</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#arquitectura"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-[#cbd5e1] hover:text-white border border-[#334155] font-medium text-sm transition"
              >
                <Layers className="h-4 w-4 text-blue-400" />
                <span>Ver Contratos Zod & Estado</span>
              </a>
            </div>
          </div>
        </div>

        {/* Executive KPI Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-xl bg-[#111827] border border-[#334155] p-5 hover:border-[#475569] transition duration-200 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`p-2.5 rounded-lg ${stat.bgColor} ${stat.borderColor} border`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold tracking-tight text-white">{stat.value}</span>
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      stat.trend === 'up'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-amber-400 bg-amber-500/10'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#cbd5e1]">{stat.subtitle}</p>
              </div>
            );
          })}
        </section>

        {/* Modules Grid Section */}
        <section id="modulos" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-400" />
                <span>Módulos de la Plataforma (Disability System Core)</span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Estructura alineada con FRONTEND_TASKS.md y contratos tipados en contracts/
              </p>
            </div>
            <span className="text-xs text-[#cbd5e1] bg-[#111827] border border-[#334155] px-3 py-1 rounded-lg">
              6 Módulos Operacionales
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="rounded-xl bg-[#111827] border border-[#334155] p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] group-hover:border-blue-500/40 group-hover:bg-blue-500/10 transition">
                        <Icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                        {m.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                        {m.tag}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition mt-0.5">
                        {m.title}
                      </h3>
                      <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#334155]/60">
                      <ul className="space-y-1.5">
                        {m.features.map((feat) => (
                          <li key={feat} className="text-xs text-[#94a3b8] flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#334155]/40 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#94a3b8] group-hover:text-white transition">
                      Acceder al flujo
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-[#1e293b] flex items-center justify-center text-[#cbd5e1] group-hover:text-white group-hover:bg-blue-600 transition">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Cases Table Preview */}
        <section id="casos" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                <span>Bandeja de Casos Recientes</span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Seguimiento en tiempo real según los estados del ciclo de vida médico
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['todos', 'pendientes', 'aprobadas'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-[#111827] text-[#94a3b8] hover:text-white border border-[#334155]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#334155] bg-[#111827] shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead className="bg-[#1e293b]/70 text-[#94a3b8] uppercase tracking-wider font-semibold border-b border-[#334155]">
                  <tr>
                    <th className="px-5 py-3.5">Código Caso</th>
                    <th className="px-5 py-3.5">Colaborador</th>
                    <th className="px-5 py-3.5">Entidad (EPS / ARL)</th>
                    <th className="px-5 py-3.5">Diagnóstico (CIE-10)</th>
                    <th className="px-5 py-3.5 text-center">Días</th>
                    <th className="px-5 py-3.5">Estado</th>
                    <th className="px-5 py-3.5">Fecha</th>
                    <th className="px-5 py-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60">
                  {recentCases.map((c) => (
                    <tr key={c.id} className="hover:bg-[#1e293b]/50 transition">
                      <td className="px-5 py-4 font-mono font-medium text-white">{c.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{c.colaborador}</div>
                        <div className="text-[11px] text-[#94a3b8]">{c.documento}</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-[#cbd5e1]">{c.entidad}</td>
                      <td className="px-5 py-4 max-w-xs truncate text-[#cbd5e1]">{c.diagnostico}</td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#1e293b] font-semibold text-white border border-[#334155]">
                          {c.dias}d
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${c.estadoColor}`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#94a3b8]">{c.fecha}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="px-3 py-1 rounded-lg bg-[#1e293b] hover:bg-blue-600 hover:text-white text-[#cbd5e1] border border-[#334155] font-medium transition text-xs">
                          Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Architecture & Contracts Status Card */}
        <section id="arquitectura" className="rounded-2xl border border-[#334155] bg-[#111827] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Estado de la Arquitectura & Contratos Tipados</h3>
                <p className="text-xs text-[#94a3b8]">
                  Validado y vinculado a los estándares de desarrollo de AGENTS.md y DESING.md
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-400">Totalmente Integrado</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                Contratos Zod
              </span>
              <div className="text-sm font-bold text-white mt-1">7 Módulos (@/contracts)</div>
              <p className="text-xs text-[#94a3b8] mt-1">
                Auth, Incapacidades, Documentos, Cobros, Cartera, Notificaciones, Catálogos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                Next.js & React
              </span>
              <div className="text-sm font-bold text-white mt-1">Next.js 16.3 • React 19</div>
              <p className="text-xs text-[#94a3b8] mt-1">
                App Router, Server Components y compilación de rutas estables.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                Sistema de Diseño
              </span>
              <div className="text-sm font-bold text-white mt-1">Disability System Dark</div>
              <p className="text-xs text-[#94a3b8] mt-1">
                Colores oficiales, tokens HSL/HEX, tipografía Inter y sombras suaves.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                Backend Conectado
              </span>
              <div className="text-sm font-bold text-white mt-1">Go Hexagonal REST API</div>
              <p className="text-xs text-[#94a3b8] mt-1 truncate">
                disability-system-backend.onrender.com/api/v1
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#334155]/60 bg-[#0f172a] py-6 px-6 mt-12">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Disability System Enterprise</span>
            <span>—</span>
            <span>Sistema Integral de Gestión de Incapacidades y Salud Ocupacional</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Next.js 16.3.5</span>
            <span>Tailwind CSS 4</span>
            <span>TypeScript Strict</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
