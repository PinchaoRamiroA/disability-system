import Link from 'next/link'
import {
    FileText,
    PlusCircle,
    Search,
    Filter,
    ArrowUpDown,
} from 'lucide-react'

export const metadata = {
    title: 'Gestión de Incapacidades',
}

export default function IncapacidadesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Gestión de Incapacidades
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Registro maestro, control de estados, seguimiento de prórrogas y contingencias.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/incapacidades/crear"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-95"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Radicar Incapacidad</span>
                    </Link>
                </div>
            </div>

            {/* Quick Filter Bar Placeholder */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                    <input
                        type="text"
                        placeholder="Buscar por colaborador, cédula, código CIE-10 o EPS..."
                        className="w-full pl-9 pr-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e293b] border border-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white transition">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filtros Avanzados</span>
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e293b] border border-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white transition">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        <span>Ordenar</span>
                    </button>
                </div>
            </div>

            {/* Empty State / Module Ready Notice */}
            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                    <FileText className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Incapacidades (Prioridad 2)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Este módulo está configurado en el layout principal. En la siguiente fase se conectará con el endpoint <code className="text-blue-400">GET /incapacidades</code> para listado con paginación de servidor, filtros por entidad/estado y acciones rápidas.
                    </p>
                </div>
                <div className="pt-2">
                    <Link
                        href="/incapacidades/crear"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Probar formulario de radicación</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
