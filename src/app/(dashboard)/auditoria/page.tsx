import { History } from 'lucide-react'

export const metadata = {
    title: 'Auditoría y Trazabilidad',
}

export default function AuditoriaPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Auditoría y Trazabilidad de Eventos
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Bitácora global de transacciones, cambios de estado en incapacidades y accesos al sistema.
                    </p>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                    <History className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Auditoría (Prioridad 12)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará el historial consolidado de auditoría con detalles del cambio realizado, usuario responsable, fecha y hora e IP de origen.
                    </p>
                </div>
            </div>
        </div>
    )
}
