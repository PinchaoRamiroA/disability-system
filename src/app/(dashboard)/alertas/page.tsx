import { Bell } from 'lucide-react'

export const metadata = {
    title: 'Centro de Alertas',
}

export default function AlertasPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Centro de Alertas y Vencimientos
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Alertas tempranas de plazos de radicación, documentos faltantes y pagos en mora.
                    </p>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
                    <Bell className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Alertas (Prioridad 8)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará tarjetas estilo tablero kanban con prioridades alta, media y baja conectadas a <code className="text-red-400">GET /cartera/alertas-vencimiento</code> y <code className="text-red-400">GET /notificaciones</code>.
                    </p>
                </div>
            </div>
        </div>
    )
}
