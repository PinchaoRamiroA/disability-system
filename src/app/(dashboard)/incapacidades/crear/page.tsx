import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata = {
    title: 'Radicar Incapacidad',
}

export default function CrearIncapacidadPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/incapacidades"
                        className="p-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-[#94a3b8] hover:text-white transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Radicar Nueva Incapacidad
                        </h1>
                        <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                            Formulario de radicación con cálculo automático de días y validación de contingencia.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Placeholder Card */}
            <div className="p-8 rounded-xl bg-[#111827] border border-[#334155] space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <FileText className="h-5 w-5 shrink-0" />
                    <div className="text-xs">
                        <strong className="font-semibold block text-white">
                            Formulario de Creación (Tarea 2.2)
                        </strong>
                        Ruta configurada con éxito en el App Router. En la Prioridad 2 se implementará el formulario completo con Formik + Zod para <code className="text-blue-300">POST /incapacidades</code>.
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 pointer-events-none">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#cbd5e1]">
                            Colaborador / Empleado
                        </label>
                        <div className="h-10 rounded-lg bg-[#0f172a] border border-[#334155]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#cbd5e1]">
                            Entidad de Salud (EPS / ARL)
                        </label>
                        <div className="h-10 rounded-lg bg-[#0f172a] border border-[#334155]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#cbd5e1]">
                            Tipo de Contingencia
                        </label>
                        <div className="h-10 rounded-lg bg-[#0f172a] border border-[#334155]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#cbd5e1]">
                            Fecha de Inicio
                        </label>
                        <div className="h-10 rounded-lg bg-[#0f172a] border border-[#334155]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
