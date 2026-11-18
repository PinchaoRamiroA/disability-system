'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    FileCheck2,
    FileText,
    HelpCircle,
    Layers,
    Lock,
    LogIn,
    LogOut,
    Plus,
    Receipt,
    RefreshCw,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
    ChevronRight,
    Calculator,
    AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
    const { user, isAuthenticated, isInitialized, logout } = useAuth()

    // Interactive Preview Tabs
    const [activeTab, setActiveTab] = useState<'radicacion' | 'documentos' | 'cobros' | 'ausentismo'>('radicacion')

    // ROI Calculator States
    const [numEmployees, setNumEmployees] = useState(650)
    const [avgSalary, setAvgSalary] = useState(2500000)

    // ROI Calculations based on Colombian corporate benchmarks
    const roiMetrics = useMemo(() => {
        // Promedio colombiano: ~4.5% ausentismo médico anual / ~6.8 días por colaborador al año
        const estimatedLeaveDays = Math.round(numEmployees * 6.8)
        // Días a cargo de EPS/ARL (a partir del día 3 para enfermedad general o día 1 para ARL)
        const reimbursableDays = Math.round(estimatedLeaveDays * 0.72)
        const dailySalary = avgSalary / 30
        const totalEconomicBenefits = Math.round(reimbursableDays * dailySalary * 0.6667)
        // Sin sistema se pierde típicamente entre 35% y 50% por glosas o prescripción de 3 años
        const unrecoveredLoss = Math.round(totalEconomicBenefits * 0.38)
        // Con Disability System se recupera más del 95%
        const recoveredWithSystem = Math.round(totalEconomicBenefits * 0.94)
        const netAnnualSavings = recoveredWithSystem - (totalEconomicBenefits - unrecoveredLoss)

        return {
            estimatedLeaveDays,
            reimbursableDays,
            totalEconomicBenefits,
            unrecoveredLoss,
            recoveredWithSystem,
            netAnnualSavings,
        }
    }, [numEmployees, avgSalary])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col selection:bg-blue-600 selection:text-white antialiased">
            {/* Top Enterprise SaaS Navigation */}
            <header className="sticky top-0 z-50 border-b border-[#334155]/70 bg-[#0f172a]/90 backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20 group-hover:scale-105 transition duration-200">
                                <Activity className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition">
                                        Disability System
                                    </span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                        SaaS B2B
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#94a3b8] font-medium tracking-tight">
                                    Gestión Integral & Recobro EPS / ARL
                                </p>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1 pl-6 border-l border-[#334155]/60 text-sm font-medium text-[#cbd5e1]">
                            <a
                                href="#solucion"
                                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1e293b]/60 transition"
                            >
                                Solución
                            </a>
                            <a
                                href="#plataforma"
                                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1e293b]/60 transition"
                            >
                                Demostración
                            </a>
                            <a
                                href="#flujo"
                                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1e293b]/60 transition"
                            >
                                Ciclo Operativo
                            </a>
                            <a
                                href="#modulos"
                                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1e293b]/60 transition"
                            >
                                Módulos
                            </a>
                            <a
                                href="#calculadora"
                                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1e293b]/60 transition text-blue-400 font-semibold"
                            >
                                Calculadora ROI
                            </a>
                            <a
                                href="#seguridad"
                                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1e293b]/60 transition"
                            >
                                Seguridad & Normativa
                            </a>
                        </nav>
                    </div>

                    {/* Right Actions / Auth Session */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#334155]/80 text-xs text-[#cbd5e1]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-medium">Sistema Operativo</span>
                            <span className="text-[#94a3b8] hidden xl:inline">• Latencia &lt; 45ms</span>
                        </div>

                        {isInitialized && isAuthenticated && user ? (
                            <div className="flex items-center gap-3 pl-3 border-l border-[#334155]">
                                <Link
                                    href="/dashboard"
                                    className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition active:scale-95"
                                >
                                    <span>Ir al Dashboard</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs font-semibold text-white leading-tight">
                                        {user.nombre}
                                    </div>
                                    <span className="text-[10px] text-blue-400 font-medium">
                                        {user.rol?.nombre || 'Administrador'}
                                    </span>
                                </div>
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                    {user.nombre?.substring(0, 2).toUpperCase() || 'US'}
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
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] border border-transparent hover:border-[#334155] transition"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition active:scale-95"
                                >
                                    <span>Solicitar Acceso</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-12 space-y-24">
                {/* HERO SECTION */}
                <section className="relative pt-6 pb-4">
                    {/* Background Decorative Gradients */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
                    <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        {/* Pill Tag */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1e293b]/90 border border-blue-500/30 text-xs font-medium text-blue-300 shadow-sm backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                            <span>Plataforma SaaS de Salud Ocupacional & Cartera EPS/ARL</span>
                            <span className="text-[#94a3b8]">•</span>
                            <span className="text-white font-semibold flex items-center gap-1">
                                Colombia <Sparkles className="h-3 w-3 text-amber-400" />
                            </span>
                        </div>

                        {/* High Impact Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                            Control total de incapacidades y{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                aceleración de recobros ante EPS y ARL
                            </span>
                        </h1>

                        {/* Value Proposition Description */}
                        <p className="text-base sm:text-lg text-[#cbd5e1] max-w-3xl mx-auto leading-relaxed">
                            Centraliza la recepción de certificados médicos, valida requisitos clínicos sin errores,
                            garantiza la radicación en los términos de ley y concilia las prestaciones económicas en un único
                            sistema empresarial auditado.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            {isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition duration-200 active:scale-[0.98]"
                                >
                                    <span>Acceder a la Plataforma</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition duration-200 active:scale-[0.98]"
                                >
                                    <span>Ingresar a la Plataforma</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                            <a
                                href="#plataforma"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#111827] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#334155] font-semibold text-sm transition duration-200"
                            >
                                <Zap className="h-4 w-4 text-amber-400" />
                                <span>Ver Demostración Interactiva</span>
                            </a>
                        </div>

                        {/* Trust & Compliance Ticker */}
                        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
                            <div className="p-4 rounded-xl bg-[#111827]/70 border border-[#334155]/60 backdrop-blur-sm">
                                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">98.4%</div>
                                <p className="text-xs text-[#94a3b8] mt-1 font-medium">Tasa de radicación exitosa sin glosas</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[#111827]/70 border border-[#334155]/60 backdrop-blur-sm">
                                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">-75%</div>
                                <p className="text-xs text-[#94a3b8] mt-1 font-medium">Tiempo operativo de transcripción</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[#111827]/70 border border-[#334155]/60 backdrop-blur-sm">
                                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">$4.8B+</div>
                                <p className="text-xs text-[#94a3b8] mt-1 font-medium">En prestaciones económicas gestionadas</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[#111827]/70 border border-[#334155]/60 backdrop-blur-sm">
                                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">0%</div>
                                <p className="text-xs text-[#94a3b8] mt-1 font-medium">Incapacidades prescritas por término legal</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INTERACTIVE SAAS PRODUCT SHOWCASE */}
                <section id="plataforma" className="space-y-6 pt-4">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                            Experiencia Empresarial Diseñada para Alto Rendimiento
                        </h2>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Una interfaz potente, rápida e intuitiva
                        </p>
                        <p className="text-sm text-[#94a3b8]">
                            Explora en tiempo real las cuatro vistas principales con las que operan los equipos de Nómina, Talento Humano y Salud en el Trabajo.
                        </p>
                    </div>

                    {/* Mockup Container Window */}
                    <div className="rounded-2xl border border-[#334155] bg-[#111827] shadow-2xl overflow-hidden">
                        {/* Window Header */}
                        <div className="bg-[#1e293b]/90 border-b border-[#334155] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Window controls & URL bar */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#0f172a] border border-[#334155] text-xs font-mono text-[#94a3b8]">
                                    <Lock className="h-3 w-3 text-emerald-400" />
                                    <span>app.disabilitysystem.com/radicacion-eps</span>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0f172a] border border-[#334155]">
                                <button
                                    onClick={() => setActiveTab('radicacion')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        activeTab === 'radicacion'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-[#94a3b8] hover:text-white'
                                    }`}
                                >
                                    Radicación & Términos
                                </button>
                                <button
                                    onClick={() => setActiveTab('documentos')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        activeTab === 'documentos'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-[#94a3b8] hover:text-white'
                                    }`}
                                >
                                    Auditoría Documental
                                </button>
                                <button
                                    onClick={() => setActiveTab('cobros')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        activeTab === 'cobros'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-[#94a3b8] hover:text-white'
                                    }`}
                                >
                                    Recobro & Cartera
                                </button>
                                <button
                                    onClick={() => setActiveTab('ausentismo')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        activeTab === 'ausentismo'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-[#94a3b8] hover:text-white'
                                    }`}
                                >
                                    Analítica & Costos
                                </button>
                            </div>
                        </div>

                        {/* Interactive Window Body */}
                        <div className="p-6 sm:p-8 bg-[#0f172a]/60">
                            {/* TAB 1: RADICACIÓN & TÉRMINOS */}
                            {activeTab === 'radicacion' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-amber-400" />
                                                <span>Tablero de Términos Legales & Radicación EPS/ARL</span>
                                            </h3>
                                            <p className="text-xs text-[#94a3b8] mt-0.5">
                                                Semáforo normativo para evitar vencimientos por prescripción (30 días licencia paternidad / 3 años cobro general)
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                                ● 42 Al día
                                            </span>
                                            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                                                ● 5 Próximas a vencer
                                            </span>
                                            <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                                                ● 0 Vencidas
                                            </span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#1e293b]/80 text-[#94a3b8] uppercase font-semibold border-b border-[#334155]">
                                                <tr>
                                                    <th className="px-4 py-3">Radicado / ID</th>
                                                    <th className="px-4 py-3">Colaborador</th>
                                                    <th className="px-4 py-3">Entidad</th>
                                                    <th className="px-4 py-3">Origen</th>
                                                    <th className="px-4 py-3">Días</th>
                                                    <th className="px-4 py-3">Término Legal</th>
                                                    <th className="px-4 py-3">Estado</th>
                                                    <th className="px-4 py-3 text-right">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#334155]/60 text-[#cbd5e1]">
                                                <tr className="hover:bg-[#1e293b]/40 transition">
                                                    <td className="px-4 py-3.5 font-mono text-white font-medium">INC-2026-104</td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-semibold text-white">Andrés Felipe Castro</div>
                                                        <div className="text-[11px] text-[#94a3b8]">CC 1.094.882.311</div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="font-medium text-white">SURA EPS</span>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            Enfermedad General
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 font-semibold text-white">15 días</td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" /> Faltan 4 días hábiles
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-medium">
                                                            En verificación EPS
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <button className="px-3 py-1 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-500 transition">
                                                            Ver Radicado
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-[#1e293b]/40 transition">
                                                    <td className="px-4 py-3.5 font-mono text-white font-medium">INC-2026-103</td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-semibold text-white">Juliana Paola Morales</div>
                                                        <div className="text-[11px] text-[#94a3b8]">CC 52.981.420</div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="font-medium text-white">POSITIVA ARL</span>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                            Accidente Laboral
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 font-semibold text-white">28 días</td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Radicado a tiempo
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
                                                            Aprobada ARL
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <button className="px-3 py-1 rounded-md bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#334155] font-medium transition">
                                                            Constancia
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-[#1e293b]/40 transition">
                                                    <td className="px-4 py-3.5 font-mono text-white font-medium">INC-2026-102</td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-semibold text-white">Mateo Gómez Restrepo</div>
                                                        <div className="text-[11px] text-[#94a3b8]">CC 1.017.200.412</div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="font-medium text-white">SANITAS EPS</span>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                            Paternidad
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 font-semibold text-white">14 días</td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Dentro de 30 días
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] font-medium">
                                                            En liquidación
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <button className="px-3 py-1 rounded-md bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#334155] font-medium transition">
                                                            Detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: AUDITORÍA DOCUMENTAL */}
                            {activeTab === 'documentos' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-5 rounded-xl bg-[#111827] border border-[#334155] space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-[#94a3b8] uppercase">Checklist Clínico</span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">100% Válido</span>
                                        </div>
                                        <div className="space-y-3 text-xs">
                                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f172a] border border-[#334155]">
                                                <span className="flex items-center gap-2 text-white">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Certificado Original
                                                </span>
                                                <span className="text-[#94a3b8]">PDF firmado</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f172a] border border-[#334155]">
                                                <span className="flex items-center gap-2 text-white">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Epicrisis Médica (&gt;2d)
                                                </span>
                                                <span className="text-[#94a3b8]">Validada</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f172a] border border-[#334155]">
                                                <span className="flex items-center gap-2 text-white">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Registro Médico ReTHUS
                                                </span>
                                                <span className="text-[#94a3b8]">Vigente</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f172a] border border-[#334155]">
                                                <span className="flex items-center gap-2 text-white">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Coherencia CIE-10
                                                </span>
                                                <span className="text-[#94a3b8]">M54.5</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 p-5 rounded-xl bg-[#111827] border border-[#334155] flex flex-col justify-between space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                                    <FileCheck2 className="h-4 w-4 text-blue-400" />
                                                    <span>Pre-validación Automática de Documentos</span>
                                                </h4>
                                                <span className="text-[11px] font-mono text-[#94a3b8]">Protocolo MinSalud</span>
                                            </div>
                                            <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                                                El sistema inspecciona automáticamente que cada incapacidad adjunte los documentos obligatorios según el origen: FURIPS para accidentes de tránsito, Epicrisis para incapacidades de más de 2 días y Registro Civil de Nacimiento en licencias parentales.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-3">
                                            <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-white block font-semibold mb-0.5">
                                                    Regla de 3 días para subsanación
                                                </strong>
                                                Si el colaborador entrega soportes incompletos, la plataforma emite una notificación con conteo regresivo de 72 horas para evitar la pérdida del radicado ante la entidad promotora.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: RECOBRO & CARTERA */}
                            {activeTab === 'cobros' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-[#111827] border border-[#334155]">
                                            <span className="text-[11px] text-[#94a3b8] uppercase font-semibold">En Cobro Persuasivo</span>
                                            <div className="text-2xl font-bold text-white mt-1">$ 124.600.000</div>
                                            <p className="text-[11px] text-[#94a3b8] mt-1">18 expedientes en trámite</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#111827] border border-[#334155]">
                                            <span className="text-[11px] text-[#94a3b8] uppercase font-semibold">Conciliado Este Mes</span>
                                            <div className="text-2xl font-bold text-emerald-400 mt-1">$ 89.450.000</div>
                                            <p className="text-[11px] text-emerald-400 mt-1">Cruce bancario 100% OK</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#111827] border border-[#334155]">
                                            <span className="text-[11px] text-[#94a3b8] uppercase font-semibold">Cobro Jurídico / Glosas</span>
                                            <div className="text-2xl font-bold text-amber-400 mt-1">$ 12.800.000</div>
                                            <p className="text-[11px] text-[#94a3b8] mt-1">Reclamaciones con sustento</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] text-xs space-y-3">
                                        <div className="flex items-center justify-between font-semibold text-white">
                                            <span>Flujo de Conciliación con Tesorería y Contabilidad</span>
                                            <span className="text-emerald-400">Automatizado con extractos bancarios</span>
                                        </div>
                                        <p className="text-[#cbd5e1] leading-relaxed">
                                            Cruza automáticamente las transferencias de las EPS contra los radicados individuales. Identifica pagos parciales, descuentos indebidos y genera el soporte contable para liberar provisiones en el balance general.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: ANALÍTICA & COSTOS */}
                            {activeTab === 'ausentismo' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                                        <div className="p-4 rounded-xl bg-[#111827] border border-[#334155]">
                                            <span className="text-[#94a3b8]">Índice de Frecuencia (I.F.)</span>
                                            <div className="text-2xl font-bold text-white mt-1">2.4%</div>
                                            <span className="text-emerald-400 font-semibold">-0.6% vs mes ant.</span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#111827] border border-[#334155]">
                                            <span className="text-[#94a3b8]">Índice de Severidad (I.S.)</span>
                                            <div className="text-2xl font-bold text-white mt-1">8.2 días</div>
                                            <span className="text-[#94a3b8]">Promedio por evento</span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#111827] border border-[#334155]">
                                            <span className="text-[#94a3b8]">Costo Nómina Asumido (Días 1-2)</span>
                                            <div className="text-2xl font-bold text-amber-400 mt-1">$ 14.200.000</div>
                                            <span className="text-[#94a3b8]">Obligación empleador</span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#111827] border border-[#334155]">
                                            <span className="text-[#94a3b8]">Recobrado a EPS (Días 3+)</span>
                                            <div className="text-2xl font-bold text-emerald-400 mt-1">$ 48.900.000</div>
                                            <span className="text-emerald-400 font-semibold">Tasa recobro 96.2%</span>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-xl bg-[#111827] border border-[#334155]">
                                        <h4 className="text-sm font-bold text-white mb-2">
                                            Distribución de Diagnósticos CIE-10 de Mayor Impacto
                                        </h4>
                                        <div className="space-y-3 text-xs">
                                            <div>
                                                <div className="flex justify-between text-[#cbd5e1] mb-1">
                                                    <span>Trastornos musculoesqueléticos (M54.5 Lumbago / M75 Lesiones hombro)</span>
                                                    <span className="font-semibold text-white">41% ($24.8M)</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-[#0f172a] overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '41%' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[#cbd5e1] mb-1">
                                                    <span>Enfermedades respiratorias agudas (J06.9 Infecciones respiratorias)</span>
                                                    <span className="font-semibold text-white">26% ($15.7M)</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-[#0f172a] overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '26%' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[#cbd5e1] mb-1">
                                                    <span>Licencias de maternidad y paternidad (O80.0 / Partos)</span>
                                                    <span className="font-semibold text-white">21% ($12.6M)</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-[#0f172a] overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* THE 4 PILLARS OF ENTERPRISE VALUE */}
                <section id="solucion" className="space-y-8 pt-4">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Propuesta de Valor Integral
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white">
                            ¿Por qué las organizaciones líderes eligen Disability System?
                        </h2>
                        <p className="text-sm text-[#cbd5e1] leading-relaxed">
                            Diseñado específicamente para resolver la fricción normativa y financiera entre las empresas, las EPS, las ARL y los Fondos de Pensiones en Colombia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-blue-500/50 transition duration-300 space-y-4 group">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition duration-200">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                                Cero Pérdidas por Prescripción
                            </h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                El sistema vigila los términos legales de radicación y cobro (30 días en paternidad y plazos de prescripción trienal), evitando que el dinero de las prestaciones se pierda en el olvido.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-emerald-500/50 transition duration-300 space-y-4 group">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition duration-200">
                                <FileCheck2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                                Blindaje ante Glosas EPS
                            </h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                Validación previa de requisitos médicos y formatos específicos (FURIPS, Epicrisis, registros médicos ReTHUS) antes de presentar la reclamación ante la entidad promotora.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-purple-500/50 transition duration-300 space-y-4 group">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition duration-200">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                                Recobro & Conciliación Ágil
                            </h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                Automatización del cruce de nómina vs reembolsos reales de EPS. Módulo especializado de cobro persuasivo y jurídico para carteras vencidas o pagos objetados.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-sky-500/50 transition duration-300 space-y-4 group">
                            <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition duration-200">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition">
                                Trazabilidad Jurídica Total
                            </h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                Registro cronológico inmutable de cada acción, aprobación y cambio de estado, cumpliendo con la estricta regulación de Habeas Data y protección de historias clínicas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* THE 4-STEP OPERATIONAL FLOW */}
                <section id="flujo" className="space-y-8 pt-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                                Ciclo Operativo de Extremo a Extremo
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">
                                De la recepción al desembolso bancario
                            </h2>
                            <p className="text-sm text-[#94a3b8] mt-1">
                                Flujo automatizado paso a paso para los equipos de Talento Humano y Tesorería
                            </p>
                        </div>
                        <Link
                            href="/incapacidades"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                        >
                            <span>Ver gestión de incapacidades en vivo</span>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        {/* Step 1 */}
                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4 relative">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-black text-blue-500/40">01</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    Recepción
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white">Recepción & Digitalización</h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                Registro digital del caso por canales web, correo o presencial. Clasificación inmediata de la contingencia (Enfermedad General, Accidente de Trabajo, Tránsito, Maternidad o Paternidad).
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4 relative">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-black text-emerald-500/40">02</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Validación
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white">Checklist & Auditoría Médica</h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                Verificación de Epicrisis para incapacidades superiores a 2 días, FURIPS para eventos de tránsito y pertinencia del código diagnóstico CIE-10.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4 relative">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-black text-amber-500/40">03</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Radicación
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white">Transcripción & Radicación</h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                Envío formal ante la EPS o ARL correspondiente antes del vencimiento del término legal. Custodia probatoria del radicado oficial de la entidad.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4 relative">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-black text-purple-500/40">04</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    Recobro
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white">Cobro & Conciliación Bancaria</h3>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                Cruce con los giros de tesorería, conciliación del valor liquidado contra lo pagado por la EPS, y disposición segura de expedientes médicos confidenciales.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PLATFORM MODULES GRID */}
                <section id="modulos" className="space-y-8 pt-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                                Arquitectura de Módulos
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">
                                Suite Operativa Empresarial
                            </h2>
                            <p className="text-sm text-[#94a3b8] mt-1">
                                Conectada directamente a la API Hexagonal y contratos de alta disponibilidad
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Module 1 */}
                        <Link
                            href="/incapacidades"
                            className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/5 transition duration-200 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        Core Operacional
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                                        Gestión de Incapacidades
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                                        Registro centralizado, cálculo automático de días hábiles y calendario, seguimiento de prórrogas y timeline interactivo de estados.
                                    </p>
                                </div>
                                <ul className="space-y-1.5 pt-3 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Control de prórrogas y orígenes
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Filtros por EPS, ARL y diagnóstico
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-4 mt-4 border-t border-[#334155]/40 flex items-center justify-between text-xs font-semibold text-[#94a3b8] group-hover:text-white transition">
                                <span>Abrir módulo</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </Link>

                        {/* Module 2 */}
                        <Link
                            href="/documentos"
                            className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/5 transition duration-200 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                                        <FileCheck2 className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Expediente Digital
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                                        Validación Documental
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                                        Carga masiva, visor integrado de certificados y checklist automático de soportes obligatorios exigidos por la legislación.
                                    </p>
                                </div>
                                <ul className="space-y-1.5 pt-3 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Aprobación y rechazo justificado
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Notificaciones de subsanación
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-4 mt-4 border-t border-[#334155]/40 flex items-center justify-between text-xs font-semibold text-[#94a3b8] group-hover:text-white transition">
                                <span>Abrir módulo</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </Link>

                        {/* Module 3 */}
                        <Link
                            href="/transcripciones"
                            className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/5 transition duration-200 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        Trámites EPS/ARL
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                                        Radicación y Transcripciones
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                                        Supervisión de términos perentorios, registro de números de radicado y almacenamiento seguro de constancias oficiales.
                                    </p>
                                </div>
                                <ul className="space-y-1.5 pt-3 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Semáforo de vencimientos
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Control por entidad prestadora
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-4 mt-4 border-t border-[#334155]/40 flex items-center justify-between text-xs font-semibold text-[#94a3b8] group-hover:text-white transition">
                                <span>Abrir módulo</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </Link>

                        {/* Module 4 */}
                        <Link
                            href="/cobros"
                            className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/5 transition duration-200 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                        Financiero & Jurídico
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                                        Cobros & Cartera Médica
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                                        Gestión de cobro persuasivo y jurídico, resolución de glosas y seguimiento financiero de prestaciones económicas por cobrar.
                                    </p>
                                </div>
                                <ul className="space-y-1.5 pt-3 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Cobro coactivo y tutelas
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Control de pagos parciales
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-4 mt-4 border-t border-[#334155]/40 flex items-center justify-between text-xs font-semibold text-[#94a3b8] group-hover:text-white transition">
                                <span>Abrir módulo</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </Link>

                        {/* Module 5 */}
                        <Link
                            href="/conciliacion"
                            className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/5 transition duration-200 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition">
                                        <Receipt className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        Tesorería
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                                        Conciliación Bancaria
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                                        Cruce de comprobantes de pago de las EPS con los registros contables internos para cierre financiero exacto.
                                    </p>
                                </div>
                                <ul className="space-y-1.5 pt-3 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Soporte contable y fiscal
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Historial de dispersión
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-4 mt-4 border-t border-[#334155]/40 flex items-center justify-between text-xs font-semibold text-[#94a3b8] group-hover:text-white transition">
                                <span>Abrir módulo</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </Link>

                        {/* Module 6 */}
                        <Link
                            href="/auditoria"
                            className="p-6 rounded-2xl bg-[#111827] border border-[#334155] hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/5 transition duration-200 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        Auditoría & Logs
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                                        Pista de Auditoría
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed">
                                        Trazabilidad completa de modificaciones, marcas de tiempo, operadores responsables y archivo final seguro conforme a la ley.
                                    </p>
                                </div>
                                <ul className="space-y-1.5 pt-3 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Registro inmutable de eventos
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Cumplimiento Ley 1581
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-4 mt-4 border-t border-[#334155]/40 flex items-center justify-between text-xs font-semibold text-[#94a3b8] group-hover:text-white transition">
                                <span>Abrir módulo</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </Link>
                    </div>
                </section>

                {/* INTERACTIVE ROI / RECOVERY ESTIMATOR */}
                <section id="calculadora" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#111827] border border-[#334155] shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

                    <div className="max-w-2xl space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                            <Calculator className="h-3.5 w-3.5" />
                            <span>Calculadora de Impacto Financiero & Recobro</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">
                            Calcula cuánto dinero puede recuperar tu empresa
                        </h2>
                        <p className="text-sm text-[#cbd5e1]">
                            Estima el monto anual de subsidios que la EPS debe reembolsar a tu organización y el capital que dejas de perder por glosas o prescripción.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Sliders Input */}
                        <div className="space-y-6 bg-[#0f172a]/70 p-6 rounded-2xl border border-[#334155]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-white">Número de Colaboradores:</span>
                                    <span className="font-mono text-base font-bold text-blue-400">
                                        {numEmployees.toLocaleString('es-CO')} personas
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="5000"
                                    step="50"
                                    value={numEmployees}
                                    onChange={(e) => setNumEmployees(Number(e.target.value))}
                                    className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[11px] text-[#94a3b8]">
                                    <span>50 emp.</span>
                                    <span>2.500 emp.</span>
                                    <span>5.000 emp.</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-white">Salario Promedio Mensual (COP):</span>
                                    <span className="font-mono text-base font-bold text-emerald-400">
                                        {formatCurrency(avgSalary)}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1400000"
                                    max="12000000"
                                    step="200000"
                                    value={avgSalary}
                                    onChange={(e) => setAvgSalary(Number(e.target.value))}
                                    className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex justify-between text-[11px] text-[#94a3b8]">
                                    <span>$ 1.4M (SMLMV)</span>
                                    <span>$ 6.0M</span>
                                    <span>$ 12.0M</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] text-xs text-[#cbd5e1] space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Días estimados de incapacidad/año:</span>
                                    <span className="font-semibold text-white">{roiMetrics.estimatedLeaveDays} días</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Días con derecho a recobro EPS/ARL:</span>
                                    <span className="font-semibold text-white">{roiMetrics.reimbursableDays} días</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Total subsidios legalmente exigibles:</span>
                                    <span className="font-semibold text-blue-400">{formatCurrency(roiMetrics.totalEconomicBenefits)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Results Card */}
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-950/40 via-[#111827] to-[#0f172a] border border-blue-500/30 space-y-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                                    Impacto de Recuperación Financiera
                                </span>
                                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                                    {formatCurrency(roiMetrics.netAnnualSavings)}
                                </div>
                                <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                                    <TrendingUp className="h-4 w-4" />
                                    Capital neto anual rescatado de la pérdida por glosas y retrasos
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#334155]">
                                <div>
                                    <span className="text-xs text-[#94a3b8]">Sin plataforma especializada:</span>
                                    <div className="text-lg font-bold text-red-400 line-through">
                                        -{formatCurrency(roiMetrics.unrecoveredLoss)}
                                    </div>
                                    <span className="text-[11px] text-[#94a3b8]">Pérdida promedio del 38%</span>
                                </div>
                                <div>
                                    <span className="text-xs text-[#94a3b8]">Con Disability System:</span>
                                    <div className="text-lg font-bold text-emerald-400">
                                        {formatCurrency(roiMetrics.recoveredWithSystem)}
                                    </div>
                                    <span className="text-[11px] text-emerald-400">94%+ efectividad de cobro</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/register"
                                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition active:scale-[0.98]"
                                >
                                    <span>Solicitar Diagnóstico Financiero Gratuito</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECURITY & COMPLIANCE */}
                <section id="seguridad" className="space-y-6 pt-4">
                    <div className="p-8 rounded-2xl bg-[#111827] border border-[#334155] space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Seguridad, Cumplimiento Normativo & Habeas Data
                                    </h3>
                                    <p className="text-xs text-[#94a3b8]">
                                        Estrictamente alineado con la legislación colombiana sobre custodia de datos de salud
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                                <Lock className="h-3.5 w-3.5" />
                                <span>Cifrado Grado Militar AES-256</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-[#cbd5e1]">
                            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-400" />
                                    Ley 1581 de 2012 (Habeas Data)
                                </h4>
                                <p className="leading-relaxed text-[#94a3b8]">
                                    Los datos de diagnósticos e historias clínicas cuentan con tratamiento de especial sensibilidad. El sistema garantiza la no permanencia indebida de epicrisis en archivos definitivos según la ley.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <Users className="h-4 w-4 text-emerald-400" />
                                    Roles Segregados (RBAC)
                                </h4>
                                <p className="leading-relaxed text-[#94a3b8]">
                                    Control granular de permisos: el personal médico de SST tiene acceso clínico exclusivo, mientras que Nómina y Tesorería gestionan únicamente los días y valores de liquidación.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <Receipt className="h-4 w-4 text-amber-400" />
                                    Pista Inmutable de Auditoría
                                </h4>
                                <p className="leading-relaxed text-[#94a3b8]">
                                    Cada radicación, aprobación de documentos, cambio de estado y exportación de certificados genera un log con firma de tiempo UTC y dirección IP para plena validez legal.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BOTTOM HIGH-CONVERTING CTA BANNER */}
                <section className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-900/60 via-[#111827] to-[#1e293b] border border-blue-500/40 text-center space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Transforma tu Operación Hoy
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            ¿Listo para modernizar la gestión de incapacidades de tu empresa?
                        </h2>
                        <p className="text-sm text-[#cbd5e1] leading-relaxed">
                            Únete a las organizaciones que han eliminado las pérdidas económicas ante EPS/ARL y digitalizado sus procesos de salud ocupacional.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition duration-200"
                            >
                                <span>Ingresar al Sistema</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition duration-200"
                                >
                                    <span>Solicitar Demostración</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-[#cbd5e1] hover:text-white border border-[#334155] font-semibold text-sm transition duration-200"
                                >
                                    <span>Iniciar Sesión</span>
                                </Link>
                            </>
                        )}
                    </div>
                </section>
            </main>

            {/* Enterprise SaaS Footer */}
            <footer className="border-t border-[#334155]/60 bg-[#0c1322] py-12 px-6 mt-16 text-xs text-[#94a3b8]">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#334155]/60">
                    <div className="space-y-3 md:col-span-1">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                <Activity className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-white text-base">Disability System</span>
                        </div>
                        <p className="leading-relaxed">
                            Plataforma SaaS B2B empresarial para la administración, radicación y recobro de incapacidades médicas en Colombia.
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>Servicios y APIs 100% Operativos</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-bold text-white text-xs uppercase tracking-wider">Módulos</h5>
                        <ul className="space-y-1.5">
                            <li>
                                <Link href="/incapacidades" className="hover:text-white transition">
                                    Gestión de Incapacidades
                                </Link>
                            </li>
                            <li>
                                <Link href="/documentos" className="hover:text-white transition">
                                    Validación Documental
                                </Link>
                            </li>
                            <li>
                                <Link href="/transcripciones" className="hover:text-white transition">
                                    Radicación EPS / ARL
                                </Link>
                            </li>
                            <li>
                                <Link href="/cobros" className="hover:text-white transition">
                                    Cobros & Cartera
                                </Link>
                            </li>
                            <li>
                                <Link href="/conciliacion" className="hover:text-white transition">
                                    Conciliación de Pagos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-bold text-white text-xs uppercase tracking-wider">Normativa Colombiana</h5>
                        <ul className="space-y-1.5">
                            <li>Decreto Ley 019 de 2012</li>
                            <li>Ley 100 de 1993 (Seguridad Social)</li>
                            <li>Ley 1581 de 2012 (Habeas Data)</li>
                            <li>Decreto 1427 de 2022 (Prestaciones)</li>
                            <li>Catálogo CIE-10 MinSalud</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-bold text-white text-xs uppercase tracking-wider">Acceso Rápido</h5>
                        <ul className="space-y-1.5">
                            <li>
                                <Link href="/login" className="hover:text-white transition">
                                    Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="hover:text-white transition">
                                    Crear Cuenta Empresarial
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-white transition">
                                    Dashboard Operativo
                                </Link>
                            </li>
                            <li>
                                <a href="#calculadora" className="hover:text-white transition text-blue-400">
                                    Calculadora ROI
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
                    <p>© 2026 Disability System Enterprise SaaS. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-6">
                        <span>Privacidad & Datos Médicos</span>
                        <span>Términos de Servicio B2B</span>
                        <span>SLA 99.9%</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
